import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

function Champ({ label, valeur, onChange, clavier, multiline }) {
  return (
    <View style={styles.champ}>
      <Text style={styles.champLabel}>{label}</Text>
      <TextInput
        style={[styles.champInput, multiline && styles.champMultiline]}
        value={valeur}
        onChangeText={onChange}
        placeholder="—"
        placeholderTextColor="#bbb"
        keyboardType={clavier || 'default'}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'auto'}
      />
    </View>
  );
}

export default function ProfileScreen({ onNavigate, profil, onSauvegarder, onDeconnexion }) {
  const [form, setForm] = useState({ ...profil });
  const [confirmer, setConfirmer] = useState(false);

  const set = (champ) => (val) => setForm(prev => ({ ...prev, [champ]: val }));

  const choisirPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setForm(prev => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  const sauvegarder = () => {
    onSauvegarder(form);
    onNavigate('home');
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

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Avatar */}
        <View style={styles.avatarZone}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={choisirPhoto}>
            {form.photo
              ? <Image source={{ uri: form.photo }} style={styles.avatarImg} />
              : <View style={styles.avatar}>
                  <Ionicons name="person" size={46} color="#fb7500" />
                </View>
            }
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarNom}>{form.prenom} {form.nom}</Text>
          <Text style={styles.avatarPoste}>{form.poste}</Text>
        </View>

        {/* Responsable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Responsable</Text>
          <Champ label="Prénom" valeur={form.prenom} onChange={set('prenom')} />
          <Champ label="Nom" valeur={form.nom} onChange={set('nom')} />
          <Champ label="Poste" valeur={form.poste} onChange={set('poste')} />
          <Champ label="Téléphone" valeur={form.telephonePerso} onChange={set('telephonePerso')} clavier="phone-pad" />
          <Champ label="Email professionnel" valeur={form.emailPro} onChange={set('emailPro')} clavier="email-address" />
        </View>

        {/* ADJ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>L'établissement</Text>
          <Champ label="Nom de la structure" valeur={form.nomAdj} onChange={set('nomAdj')} />
          <Champ label="Adresse" valeur={form.adresse} onChange={set('adresse')} multiline />
          <Champ label="Horaires d'ouverture" valeur={form.horaires} onChange={set('horaires')} multiline />
        </View>

        <TouchableOpacity style={styles.boutonSave} onPress={sauvegarder}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.boutonSaveTexte}>Sauvegarder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boutonDeconnexion} onPress={() => setConfirmer(true)}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.boutonDeconnexionTexte}>Se déconnecter</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal transparent visible={confirmer} animationType="fade" onRequestClose={() => setConfirmer(false)}>
        <Pressable style={styles.backdrop} onPress={() => setConfirmer(false)}>
          <Pressable style={styles.modalBox}>
            <View style={styles.modalIcone}>
              <Ionicons name="log-out-outline" size={32} color="#ef4444" />
            </View>
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
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  avatarZone: { alignItems: 'center', paddingVertical: 8, gap: 6 },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#fff', borderWidth: 3, borderColor: '#fb7500',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: '#fb7500',
  },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fb7500', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#f5f5f5',
  },
  avatarNom: { fontSize: 20, fontWeight: '700', color: '#333' },
  avatarPoste: { fontSize: 14, color: '#fb7500', fontWeight: '600' },
  section: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  sectionTitre: { fontSize: 13, color: '#fb7500', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  champ: { gap: 4 },
  champLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 },
  champInput: {
    borderBottomWidth: 1, borderBottomColor: '#eee',
    fontSize: 16, color: '#333', paddingVertical: 6,
  },
  champMultiline: { minHeight: 60, lineHeight: 22 },
  boutonSave: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fb7500', borderRadius: 14,
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonSaveTexte: { color: '#fff', fontSize: 16, fontWeight: '700' },
  boutonDeconnexion: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#ef4444', borderRadius: 14,
    paddingVertical: 14, justifyContent: 'center',
  },
  boutonDeconnexionTexte: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28, width: '85%',
    alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  modalIcone: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  modalTitre: { fontSize: 20, fontWeight: '700', color: '#333' },
  modalSub: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
  modalBtnRed: { backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, width: '100%', alignItems: 'center', marginTop: 4 },
  modalBtnRedTexte: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalBtnCancel: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  modalBtnCancelTexte: { color: '#aaa', fontSize: 15 },
});
