import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACTIONS = [
  { id: 'nouvelle-publication',  label: 'Créer une publication',  icon: 'create-outline',        couleur: '#fb7500' },
  { id: 'planning',              label: 'Planning de la semaine', icon: 'calendar-outline',      couleur: '#8B5CF6' },
  { id: 'publications',          label: 'Voir les publications',  icon: 'newspaper-outline',     couleur: '#F59E0B' },
  { id: 'voir-residents',        label: 'Voir les résidents',     icon: 'people-outline',        couleur: '#fb7500' },
  { id: 'canal-groupe',          label: "Canal de l'équipe",      icon: 'chatbubbles-outline',   couleur: '#0EA5E9' },
];

export default function EquipierHomeScreen({ onNavigate, messagesNonLus = 0 }) {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('profil')}>
          <Ionicons name="person" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.title}>Accueil du Jour</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('messagerie')}>
          <Ionicons name="mail" size={26} color="#fb7500" />
          {messagesNonLus > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTexte}>{messagesNonLus > 9 ? '9+' : messagesNonLus}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grille}>
          {ACTIONS.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.carte}
              onPress={() => onNavigate(action.id)}
            >
              <View style={[styles.iconeCercle, { backgroundColor: action.couleur + '20' }]}>
                <Ionicons name={action.icon} size={36} color={action.couleur} />
              </View>
              <Text style={styles.carteLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  title: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  content: { padding: 24, gap: 8 },
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  carte: {
    width: '47%', backgroundColor: '#ffffff',
    borderRadius: 20, padding: 24,
    alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  iconeCercle: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
  },
  carteLabel: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center', lineHeight: 20 },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#ef4444', borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#fb7500',
  },
  badgeTexte: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
