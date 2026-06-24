import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

async function choisirPhoto() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
  });
  if (!result.canceled) return result.assets.map(a => a.uri);
  return [];
}

function StripPhotos({ photos, onSupprimer }) {
  if (photos.length === 0) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
      {photos.map((src, i) => (
        <View key={i} style={styles.photoWrapper}>
          {src.startsWith('#')
            ? <View style={[styles.photo, { backgroundColor: src, alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.8)" />
              </View>
            : <Image source={{ uri: src }} style={styles.photo} />
          }
          {onSupprimer && (
            <TouchableOpacity style={styles.supprimer} onPress={() => onSupprimer(i)}>
              <Ionicons name="close-circle" size={22} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

export default function NouvellePublicationScreen({ onNavigate, onPublier, onSauvegarder, onNotifier, publicationEnCours }) {
  const modeEdition = !!publicationEnCours;
  const [texte, setTexte] = useState(publicationEnCours?.texte ?? '');
  const [photos, setPhotos] = useState(publicationEnCours?.photos ?? []);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifTexte, setNotifTexte] = useState('');
  const [notifPhotos, setNotifPhotos] = useState([]);
  const [notifEnvoyee, setNotifEnvoyee] = useState(false);

  const ajouterPhoto = async () => {
    const nouvelles = await choisirPhoto();
    setPhotos(prev => [...prev, ...nouvelles]);
  };

  const ajouterPhotoNotif = async () => {
    const nouvelles = await choisirPhoto();
    setNotifPhotos(prev => [...prev, ...nouvelles]);
  };

  const publier = () => {
    if (!texte.trim() && photos.length === 0) return;
    if (modeEdition) {
      onSauvegarder({ ...publicationEnCours, texte: texte.trim(), photos });
    } else {
      onPublier({
        id: Date.now().toString(),
        jour: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        texte: texte.trim(),
        photos,
      });
    }
  };

  const envoyerNotif = () => {
    if (!notifTexte.trim() && notifPhotos.length === 0) return;
    onNotifier(notifTexte.trim(), notifPhotos);
    setNotifEnvoyee(true);
    setTimeout(() => {
      setNotifEnvoyee(false);
      setNotifTexte('');
      setNotifPhotos([]);
      setNotifVisible(false);
    }, 2000);
  };

  const fermerNotif = () => {
    setNotifVisible(false);
    setNotifEnvoyee(false);
    setNotifTexte('');
    setNotifPhotos([]);
  };

  const aujourdhui = publicationEnCours?.jour ?? new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate(modeEdition ? 'publications' : 'home')}>
          <Ionicons name="close" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <Text style={styles.titre}>{modeEdition ? 'Modifier la publication' : 'Nouvelle publication'}</Text>
        <Text style={styles.date}>{aujourdhui}</Text>

        <TextInput
          style={styles.input}
          placeholder="Décrivez la journée..."
          placeholderTextColor="#bbb"
          multiline
          value={texte}
          onChangeText={setTexte}
          textAlignVertical="top"
        />

        <StripPhotos photos={photos} onSupprimer={(i) => setPhotos(prev => prev.filter((_, j) => j !== i))} />

        <TouchableOpacity style={styles.boutonPhoto} onPress={ajouterPhoto}>
          <Ionicons name="image-outline" size={22} color="#fb7500" />
          <Text style={styles.boutonPhotoTexte}>Ajouter des photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boutonPublier, (!texte.trim() && photos.length === 0) && styles.boutonDesactive]}
          onPress={publier}
        >
          <Ionicons name={modeEdition ? 'checkmark-circle-outline' : 'send-outline'} size={20} color="#ffffff" />
          <Text style={styles.boutonPublierTexte}>{modeEdition ? 'Sauvegarder' : 'Publier'}</Text>
        </TouchableOpacity>

        {!modeEdition && (
          <TouchableOpacity style={styles.boutonNotif} onPress={() => setNotifVisible(true)}>
            <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />
            <Text style={styles.boutonNotifTexte}>Notifier l'ensemble des résidents</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <Modal visible={notifVisible} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={fermerNotif}>
          <Pressable style={styles.notifCard}>
            {notifEnvoyee ? (
              <View style={styles.notifSuccess}>
                <Ionicons name="checkmark-circle" size={52} color="#10B981" />
                <Text style={styles.notifSuccessTitre}>Notification envoyée !</Text>
                <Text style={styles.notifSuccessSub}>Tous les résidents ont été notifiés.</Text>
              </View>
            ) : (
              <>
                <View style={styles.notifHeader}>
                  <Ionicons name="notifications" size={24} color="#8B5CF6" />
                  <Text style={styles.notifTitre}>Annonce aux résidents</Text>
                </View>
                <Text style={styles.notifSub}>Ce message sera envoyé à toutes les familles.</Text>
                <TextInput
                  style={styles.notifInput}
                  placeholder="Ex : Rappel — pas de service lundi prochain..."
                  placeholderTextColor="#bbb"
                  multiline
                  value={notifTexte}
                  onChangeText={setNotifTexte}
                  textAlignVertical="top"
                />

                <StripPhotos photos={notifPhotos} onSupprimer={(i) => setNotifPhotos(prev => prev.filter((_, j) => j !== i))} />

                <TouchableOpacity style={styles.boutonPhotoNotif} onPress={ajouterPhotoNotif}>
                  <Ionicons name="image-outline" size={18} color="#8B5CF6" />
                  <Text style={styles.boutonPhotoNotifTexte}>Ajouter une photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.boutonEnvoyer, (!notifTexte.trim() && notifPhotos.length === 0) && styles.boutonDesactive]}
                  onPress={envoyerNotif}
                >
                  <Ionicons name="send-outline" size={18} color="#fff" />
                  <Text style={styles.boutonEnvoyerTexte}>Envoyer la notification</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    height: 90, backgroundColor: '#fb7500',
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  spacer: { width: 44 },
  content: { padding: 24, gap: 16, paddingBottom: 40 },
  titre: { fontSize: 22, fontWeight: '700', color: '#333' },
  date: { fontSize: 14, color: '#fb7500', fontWeight: '600', marginTop: -8, textTransform: 'capitalize' },
  input: {
    backgroundColor: '#ffffff', borderRadius: 16,
    padding: 16, fontSize: 16, color: '#333',
    minHeight: 140, lineHeight: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  photoWrapper: { marginHorizontal: 4, position: 'relative' },
  photo: { width: 100, height: 100, borderRadius: 12 },
  supprimer: { position: 'absolute', top: -8, right: -8, backgroundColor: '#fff', borderRadius: 12 },
  boutonPhoto: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#ffffff', borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    borderWidth: 2, borderColor: '#fb7500', justifyContent: 'center',
  },
  boutonPhotoTexte: { color: '#fb7500', fontSize: 16, fontWeight: '600' },
  boutonPublier: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fb7500', borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14, justifyContent: 'center',
  },
  boutonDesactive: { backgroundColor: '#ccc' },
  boutonPublierTexte: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  boutonNotif: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#f5f0ff', borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    borderWidth: 2, borderColor: '#8B5CF6', justifyContent: 'center',
  },
  boutonNotifTexte: { color: '#8B5CF6', fontSize: 15, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  notifCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, gap: 14,
  },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifTitre: { fontSize: 18, fontWeight: '700', color: '#333' },
  notifSub: { fontSize: 13, color: '#aaa' },
  notifInput: {
    backgroundColor: '#f5f5f5', borderRadius: 14,
    padding: 14, fontSize: 15, color: '#333',
    minHeight: 80, lineHeight: 22,
  },
  boutonPhotoNotif: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f5f0ff', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1.5, borderColor: '#8B5CF6', justifyContent: 'center',
  },
  boutonPhotoNotifTexte: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
  boutonEnvoyer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#8B5CF6', borderRadius: 14,
    paddingVertical: 14, justifyContent: 'center', marginBottom: 8,
  },
  boutonEnvoyerTexte: { color: '#fff', fontSize: 15, fontWeight: '700' },
  notifSuccess: { alignItems: 'center', gap: 10, paddingVertical: 20 },
  notifSuccessTitre: { fontSize: 18, fontWeight: '700', color: '#333' },
  notifSuccessSub: { fontSize: 14, color: '#aaa' },
});
