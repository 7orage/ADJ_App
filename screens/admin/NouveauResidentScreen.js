import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

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

export default function NouveauResidentScreen({ onNavigate, onCreerResident }) {
  const [form, setForm] = useState({
    prenom: '', nom: '',
    email: '', motDePasse: '', confirmation: '',
    dateInscription: '', jours: [], prix: '',
    pia: '', piaMaj: '',
    contactNom: '', contactLien: '', contactTel: '',
    transport: '', transportTel: '',
  });

  const set = (champ) => (val) => setForm(prev => ({ ...prev, [champ]: val }));

  const toggleJour = (jour) => {
    setForm(prev => ({
      ...prev,
      jours: prev.jours.includes(jour)
        ? prev.jours.filter(j => j !== jour)
        : [...prev.jours, jour],
    }));
  };

  const creer = () => {
    if (!form.prenom || !form.nom) {
      Alert.alert('Champ manquant', 'Le prénom et le nom sont obligatoires.');
      return;
    }
    if (!form.email) {
      Alert.alert('Champ manquant', 'L\'email est obligatoire.');
      return;
    }
    if (!form.motDePasse) {
      Alert.alert('Champ manquant', 'Le mot de passe est obligatoire.');
      return;
    }
    if (form.motDePasse !== form.confirmation) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.jours.length === 0) {
      Alert.alert('Champ manquant', 'Sélectionnez au moins un jour.');
      return;
    }

    const nouveau = {
      id: Date.now().toString(),
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      dateInscription: form.dateInscription || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      jours: form.jours,
      prix: form.prix || '18,50 €',
      pia: form.pia || 'Aucun',
      piaMaj: form.piaMaj,
      contactNom: form.contactNom,
      contactLien: form.contactLien,
      contactTel: form.contactTel,
      transport: form.transport,
      transportTel: form.transportTel,
    };

    onCreerResident(nouveau);
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

        <Text style={styles.titre}>Nouveau résident</Text>

        {/* Identité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Identité</Text>
          <Champ label="Prénom" valeur={form.prenom} onChange={set('prenom')} obligatoire />
          <Champ label="Nom" valeur={form.nom} onChange={set('nom')} obligatoire />
        </View>

        {/* Connexion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Accès à l'application</Text>
          <Champ label="Email" valeur={form.email} onChange={set('email')} clavier="email-address" obligatoire />
          <Champ label="Mot de passe" valeur={form.motDePasse} onChange={set('motDePasse')} secret obligatoire />
          <Champ label="Confirmer le mot de passe" valeur={form.confirmation} onChange={set('confirmation')} secret obligatoire />
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color="#fb7500" />
            <Text style={styles.infoTexte}>Ces identifiants seront transmis à la famille pour se connecter.</Text>
          </View>
        </View>

        {/* Inscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Inscription</Text>
          <Champ label="Date d'inscription" valeur={form.dateInscription} onChange={set('dateInscription')} placeholder="ex: 01 janvier 2025" />

          <Text style={styles.champLabel}>Jours inscrits <Text style={styles.obligatoire}>*</Text></Text>
          <View style={styles.joursRow}>
            {JOURS_SEMAINE.map(jour => (
              <TouchableOpacity
                key={jour}
                style={[styles.jourBtn, form.jours.includes(jour) && styles.jourBtnActif]}
                onPress={() => toggleJour(jour)}
              >
                <Text style={[styles.jourTexte, form.jours.includes(jour) && styles.jourTexteActif]}>
                  {jour.slice(0, 2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Champ label="Prix à la journée" valeur={form.prix} onChange={set('prix')} placeholder="18,50 €" />
        </View>

        {/* PIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Dispositifs (PIA)</Text>
          <Champ label="Statut PIA" valeur={form.pia} onChange={set('pia')} placeholder="ex: PIA en cours" />
          <Champ label="Date de mise à jour" valeur={form.piaMaj} onChange={set('piaMaj')} placeholder="ex: 15 mars 2025" />
        </View>

        {/* Contact & transport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Contact & Transport</Text>
          <Champ label="Nom contact urgence" valeur={form.contactNom} onChange={set('contactNom')} />
          <Champ label="Lien de parenté" valeur={form.contactLien} onChange={set('contactLien')} placeholder="ex: Fille, Fils..." />
          <Champ label="Téléphone urgence" valeur={form.contactTel} onChange={set('contactTel')} clavier="phone-pad" />
          <Champ label="Transport" valeur={form.transport} onChange={set('transport')} placeholder="ex: Véhicule ADJ, Famille..." />
          <Champ label="Téléphone transport" valeur={form.transportTel} onChange={set('transportTel')} clavier="phone-pad" />
        </View>

        {/* Bouton créer */}
        <TouchableOpacity style={styles.boutonCreer} onPress={creer}>
          <Ionicons name="person-add-outline" size={22} color="#ffffff" />
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
  sectionTitre: { fontSize: 13, color: '#fb7500', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  champ: { gap: 4 },
  champLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 },
  champRow: { flexDirection: 'row', alignItems: 'center' },
  champInput: {
    borderBottomWidth: 1, borderBottomColor: '#eee',
    fontSize: 16, color: '#333', paddingVertical: 6,
  },
  eyeBtn: { paddingHorizontal: 8 },
  obligatoire: { color: '#fb7500' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#fff8f3', borderRadius: 10, padding: 10,
  },
  infoTexte: { flex: 1, fontSize: 12, color: '#fb7500', lineHeight: 18 },
  joursRow: { flexDirection: 'row', gap: 8 },
  jourBtn: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: '#eee',
    alignItems: 'center', justifyContent: 'center',
  },
  jourBtnActif: { backgroundColor: '#fb7500', borderColor: '#fb7500' },
  jourTexte: { fontSize: 12, fontWeight: '600', color: '#aaa' },
  jourTexteActif: { color: '#ffffff' },
  boutonCreer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fb7500', borderRadius: 14,
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonCreerTexte: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  note: { textAlign: 'center', fontSize: 12, color: '#bbb' },
});
