import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EquipierProfileScreen({ onNavigate, equipier, onSauvegarder, onDeconnexion }) {
  const [photo, setPhoto] = useState(equipier?.photo || null);
  const [confirmer, setConfirmer] = useState(false);

  const choisirPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const nouvellePhoto = result.assets[0].uri;
      setPhoto(nouvellePhoto);
      onSauvegarder({ ...equipier, photo: nouvellePhoto });
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('home')}>
          <Ionicons name="close" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Avatar */}
        <View style={styles.profilTop}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={choisirPhoto}>
            {photo
              ? <Image source={{ uri: photo }} style={styles.avatarImg} />
              : <View style={styles.avatar}>
                  <Ionicons name="person" size={46} color="#fb7500" />
                </View>
            }
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.nom}>{equipier.prenom} {equipier.nom}</Text>
          <Text style={styles.poste}>{equipier.poste}</Text>
        </View>

        {/* Identité */}
        <View style={styles.card}>
          <Ionicons name="person-outline" size={26} color="#fb7500" style={styles.cardIcon} />
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>Prénom</Text>
            <Text style={styles.cardValue}>{equipier.prenom}</Text>
            <View style={styles.divider} />
            <Text style={styles.cardLabel}>Nom</Text>
            <Text style={styles.cardValue}>{equipier.nom}</Text>
            <View style={styles.divider} />
            <Text style={styles.cardLabel}>Poste</Text>
            <Text style={styles.cardValue}>{equipier.poste}</Text>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Ionicons name="call-outline" size={26} color="#fb7500" style={styles.cardIcon} />
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>Téléphone</Text>
            <Text style={styles.cardValue}>{equipier.telephone || '—'}</Text>
            {equipier.email && <>
              <View style={styles.divider} />
              <Text style={styles.cardLabel}>Email</Text>
              <Text style={styles.cardValue}>{equipier.email}</Text>
            </>}
          </View>
        </View>

        <TouchableOpacity style={styles.boutonDeconnexion} onPress={() => setConfirmer(true)}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.boutonDeconnexionTexte}>Se déconnecter</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal transparent visible={confirmer} animationType="fade" onRequestClose={() => setConfirmer(false)}>
        <Pressable style={styles.backdrop} onPress={() => setConfirmer(false)}>
          <Pressable style={styles.modalBox}>
            <View style={styles.modalIcone}><Ionicons name="log-out-outline" size={32} color="#ef4444" /></View>
            <Text style={styles.modalTitre}>Se déconnecter ?</Text>
            <Text style={styles.modalSub}>Vous devrez vous reconnecter pour accéder à l'application.</Text>
            <TouchableOpacity style={styles.modalBtnRed} onPress={onDeconnexion}>
              <Text style={styles.modalBtnRedTexte}>Se déconnecter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setConfirmer(false)}>
              <Text style={styles.modalBtnCancelTexte}>Annuler</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  spacer: { width: 44 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  profilTop: { alignItems: 'center', marginBottom: 6, gap: 6 },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#fff', borderWidth: 3, borderColor: '#fb7500',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fb7500' },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fb7500', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#f5f5f5',
  },
  nom: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  poste: { fontSize: 14, color: '#fb7500', fontWeight: '600' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 3,
  },
  cardIcon: { marginRight: 16, marginTop: 2 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 13, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardValue: { fontSize: 18, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  boutonDeconnexion: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#ef4444', borderRadius: 14,
    paddingVertical: 14, justifyContent: 'center',
  },
  boutonDeconnexionTexte: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 24, padding: 28, width: '85%', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  modalIcone: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  modalTitre: { fontSize: 20, fontWeight: '700', color: '#333' },
  modalSub: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
  modalBtnRed: { backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, width: '100%', alignItems: 'center', marginTop: 4 },
  modalBtnRedTexte: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalBtnCancel: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  modalBtnCancelTexte: { color: '#aaa', fontSize: 15 },
});
