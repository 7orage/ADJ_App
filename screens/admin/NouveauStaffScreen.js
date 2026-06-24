import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Champ({ label, valeur, onChange, placeholder, clavier, secret, obligatoire }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.champ}>
      <Text style={styles.champLabel}>
        {label}{obligatoire ? <Text style={styles.obligatoire}> *</Text> : ''}
      </Text>
      <View style={styles.champRow}>
        <TextInput
          style={[styles.champInput, { flex: 1 }]}
          value={valeur}
          onChangeText={onChange}
          placeholder={placeholder || '—'}
          placeholderTextColor="#bbb"
          keyboardType={clavier || 'default'}
          secureTextEntry={secret && !visible}
          autoCapitalize={secret ? 'none' : 'sentences'}
        />
        {secret && (
          <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.eyeBtn}>
            <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function NouveauStaffScreen({ onNavigate, onCreerStaff }) {
  const [form, setForm] = useState({
    prenom: '', nom: '', poste: '',
    email: '', motDePasse: '', confirmation: '',
    telephone: '',
  });
  const [erreur, setErreur] = useState('');

  const set = (champ) => (val) => setForm(prev => ({ ...prev, [champ]: val }));

  const creer = () => {
    setErreur('');
    if (!form.prenom || !form.nom) { setErreur('Le prénom et le nom sont obligatoires.'); return; }
    if (!form.poste) { setErreur('Sélectionnez un poste.'); return; }
    if (!form.email) { setErreur('L\'email est obligatoire.'); return; }
    if (!form.motDePasse) { setErreur('Le mot de passe est obligatoire.'); return; }
    if (form.motDePasse !== form.confirmation) { setErreur('Les mots de passe ne correspondent pas.'); return; }

    onCreerStaff({
      id: Date.now().toString(),
      prenom: form.prenom,
      nom: form.nom,
      poste: form.poste,
      email: form.email,
      telephone: form.telephone,
    });
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

        <Text style={styles.titre}>Nouvel équipier</Text>

        {/* Identité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Identité</Text>
          <Champ label="Prénom" valeur={form.prenom} onChange={set('prenom')} obligatoire />
          <Champ label="Nom" valeur={form.nom} onChange={set('nom')} obligatoire />

          <Champ label="Poste" valeur={form.poste} onChange={set('poste')} placeholder="ex: Aide-soignant(e), Animateur/trice..." obligatoire />
        </View>

        {/* Accès */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Accès à l'application</Text>
          <Champ label="Email" valeur={form.email} onChange={set('email')} clavier="email-address" obligatoire />
          <Champ label="Mot de passe" valeur={form.motDePasse} onChange={set('motDePasse')} secret obligatoire />
          <Champ label="Confirmer le mot de passe" valeur={form.confirmation} onChange={set('confirmation')} secret obligatoire />
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color="#0EA5E9" />
            <Text style={styles.infoTexte}>Ces identifiants permettront à l'équipier de se connecter à l'application.</Text>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Contact</Text>
          <Champ label="Téléphone" valeur={form.telephone} onChange={set('telephone')} clavier="phone-pad" />
        </View>

        {/* Erreur */}
        {erreur ? (
          <View style={styles.erreurBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#ff4444" />
            <Text style={styles.erreurTexte}>{erreur}</Text>
          </View>
        ) : null}

        {/* Bouton créer */}
        <TouchableOpacity style={styles.boutonCreer} onPress={creer}>
          <Ionicons name="briefcase-outline" size={22} color="#ffffff" />
          <Text style={styles.boutonCreerTexte}>Créer le compte</Text>
        </TouchableOpacity>

        <Text style={styles.note}>* Champs obligatoires</Text>

      </ScrollView>

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
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  titre: { fontSize: 22, fontWeight: '700', color: '#333' },
  section: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 16, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  sectionTitre: { fontSize: 13, color: '#0EA5E9', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  champ: { gap: 4 },
  champLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 },
  champRow: { flexDirection: 'row', alignItems: 'center' },
  champInput: {
    borderBottomWidth: 1, borderBottomColor: '#eee',
    fontSize: 16, color: '#333', paddingVertical: 6,
  },
  eyeBtn: { paddingHorizontal: 8 },
  obligatoire: { color: '#0EA5E9' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#e0f2fe', borderRadius: 10, padding: 10,
  },
  infoTexte: { flex: 1, fontSize: 12, color: '#0EA5E9', lineHeight: 18 },
  erreurBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff0f0', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#ffcccc',
  },
  erreurTexte: { flex: 1, fontSize: 13, color: '#ff4444' },
  boutonCreer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#0EA5E9', borderRadius: 14,
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonCreerTexte: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  note: { textAlign: 'center', fontSize: 12, color: '#bbb' },
});
