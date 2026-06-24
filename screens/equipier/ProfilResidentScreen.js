import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EquipierProfilResidentScreen({ onNavigate, resident }) {
  if (!resident) return null;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('voir-residents')}>
          <Ionicons name="arrow-back" size={24} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.profilTop}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={46} color="#fb7500" />
          </View>
          <Text style={styles.nom}>{resident.prenom} {resident.nom}</Text>
          {resident.dateInscription && (
            <Text style={styles.sub}>Inscrit(e) depuis le {resident.dateInscription}</Text>
          )}
        </View>

        {/* Jours */}
        {resident.jours?.length > 0 && (
          <View style={styles.card}>
            <Ionicons name="sunny-outline" size={26} color="#fb7500" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>Jours de présence</Text>
              <Text style={styles.cardValue}>{resident.jours.join(' · ')}</Text>
            </View>
          </View>
        )}

        {/* Contact urgence */}
        {resident.contactNom && (
          <View style={styles.card}>
            <Ionicons name="call-outline" size={26} color="#fb7500" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>Contact d'urgence</Text>
              <Text style={styles.cardValue}>{resident.contactNom} · {resident.contactLien}</Text>
              {resident.contactTel && <Text style={styles.cardSub}>{resident.contactTel}</Text>}
            </View>
          </View>
        )}

        {/* Transport */}
        {resident.transport && (
          <View style={styles.card}>
            <Ionicons name="car-outline" size={26} color="#fb7500" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>Transport</Text>
              <Text style={styles.cardValue}>{resident.transport}</Text>
              {resident.transportTel && <Text style={styles.cardSub}>{resident.transportTel}</Text>}
            </View>
          </View>
        )}

        {/* PIA */}
        {resident.pia && resident.pia !== 'Aucun' && (
          <View style={styles.card}>
            <Ionicons name="document-text-outline" size={26} color="#fb7500" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>PIA</Text>
              <Text style={styles.cardValue}>{resident.pia}</Text>
              {resident.piaMaj && <Text style={styles.cardSub}>Mis à jour le {resident.piaMaj}</Text>}
            </View>
          </View>
        )}

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
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  spacer: { width: 44 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  profilTop: { alignItems: 'center', gap: 6, marginBottom: 6 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#fff3e8', borderWidth: 3, borderColor: '#fb7500',
    alignItems: 'center', justifyContent: 'center',
  },
  nom: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  sub: { fontSize: 13, color: '#aaa' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 3,
  },
  cardIcon: { marginRight: 16, marginTop: 2 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 13, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardValue: { fontSize: 17, fontWeight: '600', color: '#333' },
  cardSub: { fontSize: 14, color: '#aaa', marginTop: 4 },
});
