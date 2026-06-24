import { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, Modal, Pressable, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const TYPE_ICONES = {
  image: 'image-outline',
  video: 'videocam-outline',
  audio: 'musical-notes-outline',
  pdf:   'document-text-outline',
};

export default function CanalGroupeScreen({ onNavigate, equipe, equipierConnecte }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const auteur = equipierConnecte
    ? `${equipierConnecte.prenom} ${equipierConnecte.nom}`
    : 'Moi';

  const envoyer = () => {
    if (!message.trim() && pieces.length === 0) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      auteur,
      text: message.trim(),
      pieces: [...pieces],
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      moi: true,
    }]);
    setMessage('');
    setPieces([]);
  };

  const ajouterPhoto = async () => {
    setMenuVisible(false);
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!res.canceled) setPieces(p => [...p, { type: 'image', uri: res.assets[0].uri }]);
  };

  const ajouterVideo = async () => {
    setMenuVisible(false);
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'] });
    if (!res.canceled) setPieces(p => [...p, { type: 'video', uri: res.assets[0].uri, nom: res.assets[0].fileName || 'Vidéo' }]);
  };

  const ajouterAudio = async () => {
    setMenuVisible(false);
    const res = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!res.canceled) setPieces(p => [...p, { type: 'audio', uri: res.assets[0].uri, nom: res.assets[0].name }]);
  };

  const ajouterPDF = async () => {
    setMenuVisible(false);
    const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!res.canceled) setPieces(p => [...p, { type: 'pdf', uri: res.assets[0].uri, nom: res.assets[0].name }]);
  };

  const membres = equipe?.map(e => e.prenom).join(', ') || '';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('home')}>
          <Ionicons name="close" size={26} color="#0EA5E9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.card}>
          <View style={styles.cardAvatar}>
            <Ionicons name="chatbubbles" size={24} color="#0EA5E9" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitre}>Canal de l'équipe</Text>
            <Text style={styles.cardMembres}>{membres}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Messages</Text>

        {messages.length === 0 && (
          <Text style={styles.vide}>Aucun message pour l'instant</Text>
        )}

        {messages.map(msg => (
          <View key={msg.id} style={[styles.bubbleWrapper, msg.moi && styles.bubbleWrapperMoi]}>
            <Text style={[styles.bubbleAuteur, msg.moi && styles.bubbleAuteurMoi]}>{msg.auteur}</Text>
            <View style={[styles.bubble, msg.moi ? styles.bubbleMoi : styles.bubbleAutre]}>
              {/* Pièces jointes */}
              {msg.pieces?.map((p, i) => (
                <View key={i} style={styles.pieceJointe}>
                  {p.type === 'image'
                    ? <Image source={{ uri: p.uri }} style={styles.pieceImage} />
                    : (
                      <View style={styles.pieceDoc}>
                        <Ionicons name={TYPE_ICONES[p.type]} size={22} color={msg.moi ? '#fff' : '#0EA5E9'} />
                        <Text style={[styles.pieceNom, msg.moi && { color: '#fff' }]} numberOfLines={1}>{p.nom}</Text>
                      </View>
                    )
                  }
                </View>
              ))}
              {msg.text ? (
                <Text style={[styles.bubbleText, msg.moi && styles.bubbleTextMoi]}>{msg.text}</Text>
              ) : null}
              <Text style={[styles.bubbleHeure, msg.moi && styles.heureRight]}>{msg.heure}</Text>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Aperçu pièces jointes */}
      {pieces.length > 0 && (
        <View style={styles.previewBar}>
          {pieces.map((p, i) => (
            <View key={i} style={styles.previewItem}>
              {p.type === 'image'
                ? <Image source={{ uri: p.uri }} style={styles.previewImg} />
                : (
                  <View style={styles.previewDoc}>
                    <Ionicons name={TYPE_ICONES[p.type]} size={20} color="#0EA5E9" />
                  </View>
                )
              }
              <TouchableOpacity style={styles.previewSuppr} onPress={() => setPieces(p2 => p2.filter((_, j) => j !== i))}>
                <Ionicons name="close-circle" size={18} color="#f00" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachButton} onPress={() => setMenuVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color="#0EA5E9" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          placeholderTextColor="#bbb"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={envoyer}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Menu pièces jointes */}
      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menu}>
            <Text style={styles.menuTitre}>Ajouter une pièce jointe</Text>
            {[
              { label: 'Photo',    icon: 'image-outline',         action: ajouterPhoto },
              { label: 'Vidéo',   icon: 'videocam-outline',      action: ajouterVideo },
              { label: 'Audio',   icon: 'musical-notes-outline', action: ajouterAudio },
              { label: 'PDF',     icon: 'document-text-outline', action: ajouterPDF   },
            ].map(opt => (
              <TouchableOpacity key={opt.label} style={styles.menuItem} onPress={opt.action}>
                <View style={styles.menuIcone}>
                  <Ionicons name={opt.icon} size={24} color="#0EA5E9" />
                </View>
                <Text style={styles.menuLabel}>{opt.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

    </KeyboardAvoidingView>
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
  content: { padding: 16, gap: 12, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 3, marginBottom: 4,
  },
  cardAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#e0f2fe', borderWidth: 2, borderColor: '#0EA5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitre: { fontSize: 17, fontWeight: '700', color: '#333' },
  cardMembres: { fontSize: 13, color: '#0EA5E9', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#555', marginLeft: 4 },
  vide: { textAlign: 'center', color: '#ccc', marginTop: 40, fontSize: 15 },
  bubbleWrapper: { alignSelf: 'flex-start', maxWidth: '80%' },
  bubbleWrapperMoi: { alignSelf: 'flex-end' },
  bubbleAuteur: { fontSize: 12, color: '#0EA5E9', fontWeight: '700', marginBottom: 3 },
  bubbleAuteurMoi: { textAlign: 'right' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  bubbleMoi: { backgroundColor: '#0EA5E9', borderBottomRightRadius: 4 },
  bubbleAutre: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 16, color: '#333' },
  bubbleTextMoi: { color: '#fff' },
  bubbleHeure: { fontSize: 11, color: '#bbb' },
  heureRight: { textAlign: 'right', color: 'rgba(255,255,255,0.7)' },
  pieceJointe: { marginBottom: 4 },
  pieceImage: { width: 180, height: 130, borderRadius: 10 },
  pieceDoc: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pieceNom: { fontSize: 14, color: '#333', flex: 1 },
  previewBar: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
  },
  previewItem: { position: 'relative' },
  previewImg: { width: 56, height: 56, borderRadius: 10 },
  previewDoc: {
    width: 56, height: 56, borderRadius: 10,
    backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center',
  },
  previewSuppr: { position: 'absolute', top: -6, right: -6 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 12, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee', gap: 8,
  },
  attachButton: { paddingBottom: 10 },
  input: {
    flex: 1, backgroundColor: '#f5f5f5', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 16, maxHeight: 100, color: '#333',
  },
  sendButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#0EA5E9', alignItems: 'center', justifyContent: 'center',
  },
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, gap: 4,
  },
  menuTitre: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 12 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  menuIcone: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 17, color: '#333' },
});
