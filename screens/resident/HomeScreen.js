import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Photo({ src }) {
  if (src.startsWith('#')) {
    return (
      <View style={[styles.photo, { backgroundColor: src }]}>
        <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.8)" />
      </View>
    );
  }
  return <Image source={{ uri: src }} style={styles.photo} resizeMode="cover" />;
}

export default function HomeScreen({ onNavigate, planningImage, publications = [], messagesNonLus = 0 }) {
  const [planningVisible, setPlanningVisible] = useState(false);

  return (
    <View style={styles.container}>

      {/* Barre du haut */}
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

      {/* Fil des comptes rendus */}
      <ScrollView contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false}>
        {publications.length === 0 && (
          <View style={styles.vide}>
            <Ionicons name="newspaper-outline" size={48} color="#ddd" />
            <Text style={styles.videTexte}>Aucune publication pour l'instant</Text>
          </View>
        )}
        {publications.map(cr => {
          if (cr.type === 'annonce') return (
            <View key={cr.id} style={styles.bandeau}>
              <View style={styles.bandeauTop}>
                <Ionicons name="notifications" size={18} color="#8B5CF6" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bandeauJour}>{cr.jour}</Text>
                  {cr.texte ? <Text style={styles.bandeauTexte}>{cr.texte}</Text> : null}
                </View>
              </View>
              {cr.photos?.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                  {cr.photos.map((src, i) => <Photo key={i} src={src} />)}
                </ScrollView>
              )}
            </View>
          );
          return (
            <View key={cr.id} style={styles.card}>
              <Text style={styles.cardJour}>{cr.jour}</Text>
              {cr.photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                  {cr.photos.map((src, i) => <Photo key={i} src={src} />)}
                </ScrollView>
              )}
              {cr.texte ? <Text style={styles.cardTexte}>{cr.texte}</Text> : null}
            </View>
          );
        })}
      </ScrollView>

      {/* Bouton planning (coin bas droite) */}
      <TouchableOpacity style={styles.fab} onPress={() => setPlanningVisible(true)}>
        <Ionicons name="calendar" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Popup planning */}
      <Modal visible={planningVisible} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setPlanningVisible(false)}>
          <View style={styles.planningCard}>
            <Text style={styles.planningTitle}>Planning de la semaine</Text>
            {!planningImage && (
              <View style={styles.planningPlaceholder}>
                <Ionicons name="calendar-outline" size={60} color="#fb7500" />
                <Text style={styles.placeholderText}>Planning bientôt disponible</Text>
              </View>
            )}
            {planningImage?.type === 'image' && (
              <Image source={{ uri: planningImage.uri }} style={styles.planningImage} resizeMode="contain" />
            )}
            {planningImage?.type === 'pdf' && (
              <View style={styles.planningPlaceholder}>
                <Ionicons name="document-text" size={60} color="#fb7500" />
                <Text style={styles.placeholderText}>{planningImage.nom}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 90,
    backgroundColor: '#fb7500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#ef4444', borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#fb7500',
  },
  badgeTexte: { color: '#fff', fontSize: 10, fontWeight: '700' },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  feed: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  cardJour: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fb7500',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  photoStrip: {
    paddingLeft: 16,
  },
  photo: {
    width: 160,
    height: 110,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexte: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fb7500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planningCard: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  planningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fb7500',
    marginBottom: 20,
  },
  planningImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 8 },
  planningPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  placeholderText: {
    marginTop: 12,
    color: '#999',
    fontSize: 14,
  },
  vide: { alignItems: 'center', paddingTop: 60, gap: 12 },
  videTexte: { color: '#ccc', fontSize: 15 },
  bandeau: {
    backgroundColor: '#f5f0ff', borderRadius: 14,
    borderLeftWidth: 4, borderLeftColor: '#8B5CF6',
    overflow: 'hidden',
  },
  bandeauTop: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 14,
  },
  bandeauJour: { fontSize: 12, color: '#8B5CF6', fontWeight: '700', textTransform: 'capitalize', marginBottom: 4 },
  bandeauTexte: { fontSize: 15, color: '#5B21B6', lineHeight: 21 },
});
