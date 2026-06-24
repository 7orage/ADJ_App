import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentsScreen({ onNavigate, residents, onOuvrirResident }) {
  const [recherche, setRecherche] = useState('');

  const filtres = residents.filter(r =>
    `${r.prenom} ${r.nom}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('home')}>
          <Ionicons name="close" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>

        <Text style={styles.titre}>Résidents ({residents.length})</Text>

        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un résident..."
            placeholderTextColor="#bbb"
            value={recherche}
            onChangeText={setRecherche}
          />
          {recherche.length > 0 && (
            <TouchableOpacity onPress={() => setRecherche('')}>
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Liste */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filtres.length === 0 && (
            <Text style={styles.aucun}>Aucun résident trouvé</Text>
          )}
          {filtres.map(r => (
            <TouchableOpacity
              key={r.id}
              style={styles.carte}
              onPress={() => onOuvrirResident(r)}
            >
              <View style={styles.avatar}>
                {r.photo
                  ? <Image source={{ uri: r.photo }} style={styles.avatarImg} />
                  : <Ionicons name="person" size={24} color="#fb7500" />
                }
              </View>
              <View style={styles.carteTexte}>
                <Text style={styles.carteNom}>{r.prenom} {r.nom}</Text>
                <Text style={styles.carteSub}>{r.jours.join(' · ')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </ScrollView>

      </View>
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
  content: { flex: 1, padding: 20, gap: 16 },
  titre: { fontSize: 20, fontWeight: '700', color: '#333' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#ffffff', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  aucun: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  carte: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderRadius: 16,
    padding: 16, marginBottom: 10, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#fff3e8', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fb7500', overflow: 'hidden',
  },
  avatarImg: { width: 48, height: 48, borderRadius: 24 },
  carteTexte: { flex: 1 },
  carteNom: { fontSize: 17, fontWeight: '600', color: '#333' },
  carteSub: { fontSize: 13, color: '#aaa', marginTop: 2 },
});
