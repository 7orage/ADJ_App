import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilAdminScreen({ onNavigate, profil }) {
  if (!profil) return null;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('messagerie')}>
          <Ionicons name="arrow-back" size={24} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.profilTop}>
          {profil.photo
            ? <Image source={{ uri: profil.photo }} style={styles.avatarImg} />
            : <View style={styles.avatar}>
                <Ionicons name="person" size={46} color="#0EA5E9" />
              </View>
          }
          <Text style={styles.nom}>{profil.prenom} {profil.nom}</Text>
          <Text style={styles.poste}>{profil.poste}</Text>
        </View>

        {/* Contact responsable */}
        <View style={styles.card}>
          <Ionicons name="call-outline" size={26} color="#0EA5E9" style={styles.cardIcon} />
          <View style={styles.cardText}>
            {profil.telephonePerso ? <>
              <Text style={styles.cardLabel}>Téléphone</Text>
              <Text style={styles.cardValue}>{profil.telephonePerso}</Text>
            </> : null}
            {profil.telephonePerso && profil.emailPro ? <View style={styles.divider} /> : null}
            {profil.emailPro ? <>
              <Text style={styles.cardLabel}>Email</Text>
              <Text style={styles.cardValue}>{profil.emailPro}</Text>
            </> : null}
          </View>
        </View>

        {/* Infos ADJ */}
        <View style={styles.card}>
          <Ionicons name="business-outline" size={26} color="#0EA5E9" style={styles.cardIcon} />
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>Établissement</Text>
            <Text style={styles.cardValue}>{profil.nomAdj}</Text>
            {profil.adresse ? <>
              <View style={styles.divider} />
              <Text style={styles.cardLabel}>Adresse</Text>
              <Text style={styles.cardValue}>{profil.adresse}</Text>
            </> : null}
            {profil.horaires ? <>
              <View style={styles.divider} />
              <Text style={styles.cardLabel}>Horaires d'ouverture</Text>
              <Text style={styles.cardValue}>{profil.horaires}</Text>
            </> : null}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    height: 90, backgroundColor: '#0EA5E9',
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
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#e0f2fe', borderWidth: 3, borderColor: '#0EA5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#0EA5E9' },
  nom: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  poste: { fontSize: 14, color: '#0EA5E9', fontWeight: '600' },
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
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
});
