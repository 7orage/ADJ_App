import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

function Champ({ label, valeur, onChange, placeholder }) {
  return (
    <View style={styles.champ}>
      <Text style={styles.champLabel}>{label}</Text>
      <TextInput
        style={styles.champInput}
        value={valeur}
        onChangeText={onChange}
        placeholder={placeholder || '—'}
        placeholderTextColor="#bbb"
      />
    </View>
  );
}

export default function EditResidentScreen({ onNavigate, resident, onSauvegarder, onSupprimer, onOuvrirMessagerie }) {
  const [form, setForm] = useState(resident ? { ...resident } : {});
  if (!resident) return null;

  const set = (champ) => (val) => setForm(prev => ({ ...prev, [champ]: val }));

  const toggleJour = (jour) => {
    setForm(prev => ({
      ...prev,
      jours: prev.jours.includes(jour)
        ? prev.jours.filter(j => j !== jour)
        : [...prev.jours, jour],
    }));
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('residents')}>
          <Ionicons name="close" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => onOuvrirMessagerie(resident)}>
          <Ionicons name="mail" size={22} color="#fb7500" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Nom / Prénom */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Identité</Text>
          <Champ label="Prénom" valeur={form.prenom} onChange={set('prenom')} />
          <Champ label="Nom" valeur={form.nom} onChange={set('nom')} />
        </View>

        {/* Inscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Inscription</Text>
          <Champ label="Date d'inscription" valeur={form.dateInscription} onChange={set('dateInscription')} />

          <Text style={styles.champLabel}>Jours inscrits</Text>
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

          <Champ label="Prix à la journée" valeur={form.prix} onChange={set('prix')} />
        </View>

        {/* PIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Dispositifs (PIA)</Text>
          <Champ label="Statut PIA" valeur={form.pia} onChange={set('pia')} />
          <Champ label="Mise à jour le" valeur={form.piaMaj} onChange={set('piaMaj')} />
        </View>

        {/* Contact urgence & transport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Contact & Transport</Text>
          <Champ label="Nom contact urgence" valeur={form.contactNom} onChange={set('contactNom')} />
          <Champ label="Lien de parenté" valeur={form.contactLien} onChange={set('contactLien')} />
          <Champ label="Téléphone urgence" valeur={form.contactTel} onChange={set('contactTel')} />
          <Champ label="Transport" valeur={form.transport} onChange={set('transport')} />
          <Champ label="Téléphone transport" valeur={form.transportTel} onChange={set('transportTel')} />
        </View>

        {/* Bouton sauvegarder */}
        <TouchableOpacity style={styles.boutonSave} onPress={() => onSauvegarder(form)}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#ffffff" />
          <Text style={styles.boutonSaveTexte}>Sauvegarder</Text>
        </TouchableOpacity>

        {/* Bouton supprimer */}
        <TouchableOpacity
          style={styles.boutonSupprimer}
          onPress={() =>
            Alert.alert(
              'Supprimer ce résident ?',
              `${form.prenom} ${form.nom} sera définitivement supprimé.`,
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => onSupprimer(form.id) },
              ]
            )
          }
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
          <Text style={styles.boutonSupprimerTexte}>Supprimer ce résident</Text>
        </TouchableOpacity>

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
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  section: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 16, gap: 12,
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
  joursRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  jourBtn: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: '#eee',
    alignItems: 'center', justifyContent: 'center',
  },
  jourBtnActif: { backgroundColor: '#fb7500', borderColor: '#fb7500' },
  jourTexte: { fontSize: 12, fontWeight: '600', color: '#aaa' },
  jourTexteActif: { color: '#ffffff' },
  boutonSave: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fb7500', borderRadius: 14,
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonSaveTexte: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  boutonSupprimer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff0f0', borderRadius: 14, borderWidth: 1.5, borderColor: '#ff4444',
    paddingVertical: 16, justifyContent: 'center',
  },
  boutonSupprimerTexte: { color: '#ff4444', fontSize: 16, fontWeight: '600' },
});
