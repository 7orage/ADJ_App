import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Photo({ src }) {
  if (src.startsWith('#')) {
    return (
      <View style={[styles.photo, { backgroundColor: src }]}>
        <Ionicons name="image-outline" size={20} color="rgba(255,255,255,0.8)" />
      </View>
    );
  }
  return <Image source={{ uri: src }} style={styles.photo} resizeMode="cover" />;
}

export default function PublicationsScreen({ onNavigate, publications, onSupprimer, onModifier }) {
  const [pubASupprimer, setPubASupprimer] = useState(null);

  const confirmer = () => {
    onSupprimer(pubASupprimer.id);
    setPubASupprimer(null);
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

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.titre}>Publications ({publications.length})</Text>

        {publications.length === 0 && (
          <View style={styles.vide}>
            <Ionicons name="newspaper-outline" size={48} color="#ddd" />
            <Text style={styles.videTexte}>Aucune publication</Text>
          </View>
        )}

        {publications.map(pub => {
          if (pub.type === 'annonce') return (
            <View key={pub.id} style={styles.bandeau}>
              <View style={styles.bandeauTop}>
                <Ionicons name="notifications" size={18} color="#8B5CF6" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bandeauJour}>{pub.jour}</Text>
                  {pub.texte ? <Text style={styles.bandeauTexte}>{pub.texte}</Text> : null}
                </View>
                <TouchableOpacity style={styles.btnModifierViolet} onPress={() => onModifier(pub)}>
                  <Ionicons name="pencil-outline" size={16} color="#8B5CF6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSupprimer} onPress={() => setPubASupprimer(pub)}>
                  <Ionicons name="trash-outline" size={16} color="#ff4444" />
                </TouchableOpacity>
              </View>
              {pub.photos?.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                  {pub.photos.map((src, i) => <Photo key={i} src={src} />)}
                </ScrollView>
              )}
            </View>
          );
          return (
            <View key={pub.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardJour}>{pub.jour}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.btnModifier} onPress={() => onModifier(pub)}>
                    <Ionicons name="pencil-outline" size={18} color="#fb7500" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSupprimer} onPress={() => setPubASupprimer(pub)}>
                    <Ionicons name="trash-outline" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
              {pub.photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                  {pub.photos.map((src, i) => <Photo key={i} src={src} />)}
                </ScrollView>
              )}
              {pub.texte ? <Text style={styles.cardTexte}>{pub.texte}</Text> : null}
            </View>
          );
        })}

      </ScrollView>

      {/* Modale de confirmation suppression */}
      <Modal visible={!!pubASupprimer} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setPubASupprimer(null)}>
          <View style={styles.dialog}>
            <Ionicons name="trash-outline" size={36} color="#ff4444" style={{ marginBottom: 12 }} />
            <Text style={styles.dialogTitre}>Supprimer cette publication ?</Text>
            <Text style={styles.dialogSub}>"{pubASupprimer?.jour}" sera définitivement supprimée.</Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.btnAnnuler} onPress={() => setPubASupprimer(null)}>
                <Text style={styles.btnAnnulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirmer} onPress={confirmer}>
                <Text style={styles.btnConfirmerTexte}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

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
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  titre: { fontSize: 20, fontWeight: '700', color: '#333' },
  vide: { alignItems: 'center', paddingTop: 60, gap: 12 },
  videTexte: { color: '#ccc', fontSize: 15 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
  },
  cardJour: { fontSize: 15, fontWeight: '700', color: '#fb7500', flex: 1 },
  cardActions: { flexDirection: 'row', gap: 8 },
  btnModifier: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff3e8', alignItems: 'center', justifyContent: 'center',
  },
  btnSupprimer: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff0f0', alignItems: 'center', justifyContent: 'center',
  },
  btnModifierViolet: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f0ebff', alignItems: 'center', justifyContent: 'center',
  },
  photoStrip: { paddingLeft: 16 },
  photo: {
    width: 100, height: 70, borderRadius: 10,
    marginRight: 8, alignItems: 'center', justifyContent: 'center',
  },
  cardTexte: { fontSize: 14, color: '#444', lineHeight: 20, padding: 16 },
  bandeau: {
    backgroundColor: '#f5f0ff', borderRadius: 14,
    borderLeftWidth: 4, borderLeftColor: '#8B5CF6',
    overflow: 'hidden',
  },
  bandeauTop: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 14,
  },
  bandeauJour: { fontSize: 12, color: '#8B5CF6', fontWeight: '700', textTransform: 'capitalize', marginBottom: 4 },
  bandeauTexte: { fontSize: 14, color: '#5B21B6', lineHeight: 20, flex: 1 },
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  dialog: {
    width: '80%', backgroundColor: '#ffffff', borderRadius: 20,
    padding: 24, alignItems: 'center', gap: 8,
  },
  dialogTitre: { fontSize: 17, fontWeight: '700', color: '#333', textAlign: 'center' },
  dialogSub: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 8 },
  dialogActions: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 4 },
  btnAnnuler: {
    flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd',
    paddingVertical: 12, alignItems: 'center',
  },
  btnAnnulerTexte: { fontSize: 15, fontWeight: '600', color: '#666' },
  btnConfirmer: {
    flex: 1, borderRadius: 12, backgroundColor: '#ff4444',
    paddingVertical: 12, alignItems: 'center',
  },
  btnConfirmerTexte: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
