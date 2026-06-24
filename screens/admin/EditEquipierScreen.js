import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Champ({ label, valeur, onChange, placeholder, clavier }) {
  return (
    <View style={styles.champ}>
      <Text style={styles.champLabel}>{label}</Text>
      <TextInput
        style={styles.champInput}
        value={valeur}
        onChangeText={onChange}
        placeholder={placeholder || '—'}
        placeholderTextColor="#bbb"
        keyboardType={clavier || 'default'}
      />
    </View>
  );
}

export default function EditEquipierScreen({ onNavigate, equipier, onSauvegarder, onSupprimer, onOuvrirMessagerie }) {
  const [form, setForm] = useState(equipier ? { ...equipier } : {});
  const [modalVisible, setModalVisible] = useState(false);
  if (!equipier) return null;

  const set = (c) => (v) => setForm(prev => ({ ...prev, [c]: v }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('gerer-equipe')}>
          <Ionicons name="close" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => onOuvrirMessagerie(equipier)}>
          <Ionicons name="mail" size={22} color="#fb7500" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Identité</Text>
          <Champ label="Prénom" valeur={form.prenom} onChange={set('prenom')} />
          <Champ label="Nom" valeur={form.nom} onChange={set('nom')} />
          <Champ label="Poste" valeur={form.poste} onChange={set('poste')} placeholder="ex: Aide-soignant(e)..." />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Contact</Text>
          <Champ label="Téléphone" valeur={form.telephone} onChange={set('telephone')} clavier="phone-pad" />
          <Champ label="Email" valeur={form.email} onChange={set('email')} clavier="email-address" />
        </View>

        <TouchableOpacity style={styles.boutonSave} onPress={() => onSauvegarder(form)}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.boutonSaveTexte}>Sauvegarder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boutonSupprimer} onPress={() => setModalVisible(true)}>
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
          <Text style={styles.boutonSupprimerTexte}>Supprimer cet équipier</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.dialog}>
            <Ionicons name="trash-outline" size={36} color="#ff4444" style={{ marginBottom: 12 }} />
            <Text style={styles.dialogTitre}>Supprimer cet équipier ?</Text>
            <Text style={styles.dialogSub}>{form.prenom} {form.nom} sera définitivement supprimé.</Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.btnAnnuler} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnAnnulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirmer} onPress={() => onSupprimer(equipier.id)}>
                <Text style={styles.btnConfirmerTexte}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  section: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  sectionTitre: { fontSize: 13, color: '#0EA5E9', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  champ: { gap: 4 },
  champLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 },
  champInput: {
    borderBottomWidth: 1, borderBottomColor: '#eee',
    fontSize: 16, color: '#333', paddingVertical: 6,
  },
  boutonSave: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#0EA5E9', borderRadius: 14,
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonSaveTexte: { color: '#fff', fontSize: 16, fontWeight: '700' },
  boutonSupprimer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff0f0', borderRadius: 14, borderWidth: 1.5, borderColor: '#ff4444',
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonSupprimerTexte: { color: '#ff4444', fontSize: 16, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  dialog: { width: '80%', backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', gap: 8 },
  dialogTitre: { fontSize: 17, fontWeight: '700', color: '#333', textAlign: 'center' },
  dialogSub: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 8 },
  dialogActions: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 4 },
  btnAnnuler: { flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd', paddingVertical: 12, alignItems: 'center' },
  btnAnnulerTexte: { fontSize: 15, fontWeight: '600', color: '#666' },
  btnConfirmer: { flex: 1, borderRadius: 12, backgroundColor: '#ff4444', paddingVertical: 12, alignItems: 'center' },
  btnConfirmerTexte: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
