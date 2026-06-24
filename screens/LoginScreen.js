import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Identifiant = NOM en majuscules
const COMPTES = [
  { nom: 'BERNARD', motDePasse: 'admin123',    mode: 'admin',    label: 'Sophie Bernard — Responsable' },
  { nom: 'MOREAU',  motDePasse: 'equipier123', mode: 'equipier', label: 'Luc Moreau — Équipier' },
  { nom: 'DUPONT',  motDePasse: 'resident123', mode: 'resident', label: 'Marie Dupont — Résidente' },
];

export default function LoginScreen({ onConnexion }) {
  const [nom, setNom]               = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur]         = useState('');
  const [mdpVisible, setMdpVisible] = useState(false);
  const [demoOuvert, setDemoOuvert] = useState(false);
  const [mdpOublie, setMdpOublie]   = useState(false);

  const connecter = () => {
    const compte = COMPTES.find(
      c => c.nom === nom.trim().toUpperCase() && c.motDePasse === motDePasse
    );
    if (compte) {
      setErreur('');
      onConnexion(compte.mode, compte.nom);
    } else {
      setErreur('Nom ou mot de passe incorrect.');
    }
  };

  const remplir = (compte) => {
    setNom(compte.nom);
    setMotDePasse(compte.motDePasse);
    setErreur('');
    setDemoOuvert(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* En-tête */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="sunny" size={48} color="#fff" />
          </View>
          <Text style={styles.appNom}>Accueil du Jour</Text>
          <Text style={styles.appSub}>Espace professionnel & familles</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.carte}>
          <Text style={styles.titreCarte}>Connexion</Text>

          <View style={styles.champ}>
            <Ionicons name="person-outline" size={20} color="#aaa" style={styles.champIcone} />
            <TextInput
              style={styles.input}
              placeholder="Nom de famille"
              placeholderTextColor="#bbb"
              value={nom}
              onChangeText={v => { setNom(v); setErreur(''); }}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.champ}>
            <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.champIcone} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#bbb"
              value={motDePasse}
              onChangeText={v => { setMotDePasse(v); setErreur(''); }}
              secureTextEntry={!mdpVisible}
            />
            <TouchableOpacity onPress={() => setMdpVisible(v => !v)}>
              <Ionicons name={mdpVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

          <TouchableOpacity style={styles.bouton} onPress={connecter}>
            <Text style={styles.boutonTexte}>Se connecter</Text>
          </TouchableOpacity>

          {/* Mot de passe oublié */}
          <TouchableOpacity style={styles.mdpOublieHeader} onPress={() => setMdpOublie(v => !v)}>
            <Text style={styles.mdpOublieLabel}>Mot de passe oublié ?</Text>
            <Ionicons name={mdpOublie ? 'chevron-up' : 'chevron-down'} size={16} color="#aaa" />
          </TouchableOpacity>
          {mdpOublie && (
            <View style={styles.mdpOublieBox}>
              <Ionicons name="information-circle-outline" size={18} color="#0EA5E9" />
              <Text style={styles.mdpOublieTexte}>
                Pour réinitialiser votre mot de passe, veuillez contacter le responsable de la structure.
              </Text>
            </View>
          )}
        </View>

        {/* Comptes démo */}
        <View style={styles.demo}>
          <TouchableOpacity style={styles.demoHeader} onPress={() => setDemoOuvert(v => !v)}>
            <Ionicons name="information-circle-outline" size={18} color="#aaa" />
            <Text style={styles.demoTitre}>Comptes de démonstration</Text>
            <Ionicons name={demoOuvert ? 'chevron-up' : 'chevron-down'} size={16} color="#aaa" />
          </TouchableOpacity>

          {demoOuvert && COMPTES.map(c => (
            <TouchableOpacity key={c.nom} style={styles.demoItem} onPress={() => remplir(c)}>
              <View style={[styles.demoTag, { backgroundColor: c.mode === 'admin' ? '#fff3e8' : c.mode === 'equipier' ? '#e0f2fe' : '#ecfdf5' }]}>
                <Text style={[styles.demoTagTexte, { color: c.mode === 'admin' ? '#fb7500' : c.mode === 'equipier' ? '#0EA5E9' : '#10B981' }]}>
                  {c.mode === 'admin' ? 'Admin' : c.mode === 'equipier' ? 'Équipier' : 'Résident'}
                </Text>
              </View>
              <View style={styles.demoTexte}>
                <Text style={styles.demoLabel}>{c.label}</Text>
                <Text style={styles.demoEmail}>Nom : {c.nom}</Text>
              </View>
              <Ionicons name="arrow-forward-circle-outline" size={22} color="#fb7500" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  hero: {
    backgroundColor: '#fb7500', paddingTop: 70, paddingBottom: 50,
    alignItems: 'center', gap: 10,
  },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  appNom:  { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  appSub:  { fontSize: 15, color: 'rgba(255,255,255,0.8)' },

  carte: {
    margin: 20, backgroundColor: '#fff', borderRadius: 24,
    padding: 24, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 5,
    marginTop: -24,
  },
  titreCarte: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 4 },

  champ: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  champIcone: {},
  input: { flex: 1, fontSize: 16, color: '#333' },

  erreur: { fontSize: 14, color: '#ef4444', marginTop: -4 },

  bouton: {
    backgroundColor: '#fb7500', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  boutonTexte: { color: '#fff', fontSize: 17, fontWeight: '700' },

  mdpOublieHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: -4,
  },
  mdpOublieLabel: { fontSize: 14, color: '#aaa' },
  mdpOublieBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#e0f2fe', borderRadius: 12, padding: 12,
  },
  mdpOublieTexte: { flex: 1, fontSize: 14, color: '#0369a1', lineHeight: 20 },

  demo: {
    marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  demoHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16,
  },
  demoTitre: { flex: 1, fontSize: 14, color: '#aaa', fontWeight: '600' },
  demoItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  demoTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  demoTagTexte: { fontSize: 11, fontWeight: '700' },
  demoTexte: { flex: 1 },
  demoLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  demoEmail: { fontSize: 12, color: '#aaa', marginTop: 1 },
});
