import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Carte({ item, couleur, onPress, nonLus = 0 }) {
  return (
    <TouchableOpacity style={styles.carte} onPress={onPress}>
      <View style={[styles.avatar, { borderColor: couleur, backgroundColor: couleur + '20' }]}>
        {item.photo
          ? <Image source={{ uri: item.photo }} style={styles.avatarImg} />
          : <Ionicons name="person" size={22} color={couleur} />
        }
        {nonLus > 0 && (
          <View style={styles.badgeConv}>
            <Text style={styles.badgeConvTexte}>{nonLus > 9 ? '9+' : nonLus}</Text>
          </View>
        )}
      </View>
      <View style={styles.carteTexte}>
        <Text style={[styles.carteNom, nonLus > 0 && styles.carteNomGras]}>{item.prenom} {item.nom}</Text>
        {item.poste && <Text style={[styles.carteSub, { color: couleur }]}>{item.poste}</Text>}
        {nonLus > 0 && <Text style={styles.nonLuLabel}>{nonLus} message{nonLus > 1 ? 's' : ''} non lu{nonLus > 1 ? 's' : ''}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

export default function MessagerieListeScreen({ onNavigate, residents, equipe, onOuvrirChat, nonLusParConv = {} }) {
  const [recherche, setRecherche] = useState('');

  const filtre = (liste) => liste.filter(r =>
    `${r.prenom} ${r.nom}`.toLowerCase().includes(recherche.toLowerCase())
  );
  const filtresResidents = filtre(residents);
  const filtresEquipe = filtre(equipe);

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

        <Text style={styles.titre}>Messagerie</Text>

        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une personne..."
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

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtresResidents.length === 0 && filtresEquipe.length === 0 && (
            <Text style={styles.aucun}>Aucun résultat</Text>
          )}

          {filtresResidents.length > 0 && (
            <Text style={styles.categorie}>Résidents</Text>
          )}
          {filtresResidents.map(r => (
            <Carte key={r.id} item={r} couleur="#fb7500" onPress={() => onOuvrirChat(r)} nonLus={nonLusParConv[`resident-${r.id}`] || 0} />
          ))}

          {filtresEquipe.length > 0 && (
            <Text style={styles.categorie}>Équipe</Text>
          )}
          {filtresEquipe.map(e => (
            <Carte key={e.id} item={e} couleur="#0EA5E9" onPress={() => onOuvrirChat(e)} nonLus={nonLusParConv[`equipier-${e.id}`] || 0} />
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
  carteNomGras: { fontWeight: '700', color: '#111' },
  carteSub: { fontSize: 13, marginTop: 2 },
  nonLuLabel: { fontSize: 12, color: '#ef4444', fontWeight: '600', marginTop: 3 },
  categorie: { fontSize: 12, fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4, marginLeft: 4 },
  badgeConv: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#ef4444', borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#fff',
  },
  badgeConvTexte: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
