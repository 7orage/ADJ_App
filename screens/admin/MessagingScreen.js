import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const TYPE_ICONES = {
  image: 'image-outline', video: 'videocam-outline',
  audio: 'musical-notes-outline', pdf: 'document-text-outline',
};

export default function MessagingScreen({ onNavigate, resident, messages = [], onEnvoyer, onOuvrir, photoAdmin }) {
  const [message, setMessage] = useState('');
  const [pieces, setPieces] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const scroll = useRef(null);

  const couleur = resident?.poste ? '#0EA5E9' : '#fb7500';

  // Marquer comme lu à l'ouverture
  useEffect(() => { onOuvrir?.(); }, []);

  // Scroll en bas à chaque nouveau message
  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length]);

  const envoyer = () => {
    if (!message.trim() && pieces.length === 0) return;
    onEnvoyer?.(message.trim(), [...pieces]);
    setMessage(''); setPieces([]);
  };

  const ajouterPhoto = async () => { setMenuVisible(false); const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 }); if (!r.canceled) setPieces(p => [...p, { type: 'image', uri: r.assets[0].uri }]); };
  const ajouterVideo = async () => { setMenuVisible(false); const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'] }); if (!r.canceled) setPieces(p => [...p, { type: 'video', uri: r.assets[0].uri, nom: r.assets[0].fileName || 'Vidéo' }]); };
  const ajouterAudio = async () => { setMenuVisible(false); const r = await DocumentPicker.getDocumentAsync({ type: 'audio/*' }); if (!r.canceled) setPieces(p => [...p, { type: 'audio', uri: r.assets[0].uri, nom: r.assets[0].name }]); };
  const ajouterPDF   = async () => { setMenuVisible(false); const r = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' }); if (!r.canceled) setPieces(p => [...p, { type: 'pdf', uri: r.assets[0].uri, nom: r.assets[0].name }]); };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <View style={[styles.header, { backgroundColor: couleur }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('messagerie')}>
          <Ionicons name="close" size={26} color={couleur} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        {resident && (
          <View style={styles.card}>
            <View style={[styles.cardAvatar, { borderColor: couleur, backgroundColor: couleur + '20' }]}>
              {resident.photo
                ? <Image source={{ uri: resident.photo }} style={styles.cardAvatarImg} />
                : <Ionicons name="person" size={26} color={couleur} />
              }
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{resident.poste || 'Résident'}</Text>
              <Text style={styles.cardValue}>{resident.prenom} {resident.nom}</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Messagerie</Text>

        {messages.map(msg => {
          const isAdmin = msg.from === 'admin';
          return (
            <View key={msg.id} style={[styles.bubbleRow, isAdmin ? styles.rowRight : styles.rowLeft]}>
              {!isAdmin && (
                <View style={[styles.msgAvatar, { borderColor: couleur, backgroundColor: couleur + '20' }]}>
                  {resident?.photo
                    ? <Image source={{ uri: resident.photo }} style={styles.msgAvatarImg} />
                    : <Ionicons name="person" size={14} color={couleur} />
                  }
                </View>
              )}
              <View style={[styles.bubble, isAdmin ? [styles.bubbleAdmin, { backgroundColor: couleur }] : styles.bubbleAutre]}>
                {msg.pieces?.map((p, i) => (
                  <View key={i} style={styles.pieceJointe}>
                    {p.type === 'image'
                      ? <Image source={{ uri: p.uri }} style={styles.pieceImage} />
                      : <View style={styles.pieceDoc}><Ionicons name={TYPE_ICONES[p.type]} size={20} color={isAdmin ? '#fff' : couleur} /><Text style={[styles.pieceNom, isAdmin && { color: '#fff' }]} numberOfLines={1}>{p.nom}</Text></View>
                    }
                  </View>
                ))}
                {msg.text ? <Text style={[styles.bubbleText, isAdmin ? styles.bubbleTextAdmin : styles.bubbleTextAutre]}>{msg.text}</Text> : null}
                <View style={styles.bubbleMeta}>
                  <Text style={[styles.bubbleHeure, isAdmin ? styles.heureAdmin : styles.heureAutre]}>{msg.heure}</Text>
                  {isAdmin && (
                    <Ionicons
                      name={msg.lu ? 'checkmark-done' : 'checkmark'}
                      size={14}
                      color={msg.lu ? '#93c5fd' : 'rgba(255,255,255,0.6)'}
                      style={styles.checkmark}
                    />
                  )}
                </View>
              </View>
              {isAdmin && (
                <View style={[styles.msgAvatar, { borderColor: couleur, backgroundColor: couleur + '20' }]}>
                  {photoAdmin
                    ? <Image source={{ uri: photoAdmin }} style={styles.msgAvatarImg} />
                    : <Ionicons name="person" size={14} color={couleur} />
                  }
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {pieces.length > 0 && (
        <View style={styles.previewBar}>
          {pieces.map((p, i) => (
            <View key={i} style={styles.previewItem}>
              {p.type === 'image' ? <Image source={{ uri: p.uri }} style={styles.previewImg} /> : <View style={[styles.previewDoc, { backgroundColor: couleur + '20' }]}><Ionicons name={TYPE_ICONES[p.type]} size={20} color={couleur} /></View>}
              <TouchableOpacity style={styles.previewSuppr} onPress={() => setPieces(p2 => p2.filter((_, j) => j !== i))}>
                <Ionicons name="close-circle" size={18} color="#f00" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachButton} onPress={() => setMenuVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color={couleur} />
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Votre message..." placeholderTextColor="#bbb" value={message} onChangeText={setMessage} multiline />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: couleur }]} onPress={envoyer}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menu}>
            <Text style={styles.menuTitre}>Ajouter une pièce jointe</Text>
            {[
              { label: 'Photo',  icon: 'image-outline',         action: ajouterPhoto },
              { label: 'Vidéo', icon: 'videocam-outline',      action: ajouterVideo },
              { label: 'Audio', icon: 'musical-notes-outline', action: ajouterAudio },
              { label: 'PDF',   icon: 'document-text-outline', action: ajouterPDF   },
            ].map(opt => (
              <TouchableOpacity key={opt.label} style={styles.menuItem} onPress={opt.action}>
                <View style={[styles.menuIcone, { backgroundColor: couleur + '20' }]}><Ionicons name={opt.icon} size={24} color={couleur} /></View>
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
  header: { height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  spacer: { width: 44 },
  content: { padding: 16, gap: 8, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 3, marginBottom: 8, gap: 14 },
  cardAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 13, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardValue: { fontSize: 18, fontWeight: '600', color: '#333' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#555', marginBottom: 4, marginLeft: 4 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  rowRight: { justifyContent: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  msgAvatarImg: { width: 28, height: 28, borderRadius: 14 },
  cardAvatarImg: { width: 50, height: 50, borderRadius: 25 },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bubbleAdmin: { borderBottomRightRadius: 4 },
  bubbleAutre: { backgroundColor: '#ffffff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTextAdmin: { color: '#fff' },
  bubbleTextAutre: { color: '#333' },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 },
  bubbleHeure: { fontSize: 11 },
  heureAdmin: { color: 'rgba(255,255,255,0.7)' },
  heureAutre: { color: '#aaa' },
  checkmark: { marginLeft: 2 },
  pieceJointe: { gap: 4 },
  pieceImage: { width: 200, height: 150, borderRadius: 12 },
  pieceDoc: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pieceNom: { fontSize: 13, color: '#666', flex: 1 },
  previewBar: { flexDirection: 'row', padding: 8, gap: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  previewItem: { position: 'relative' },
  previewImg: { width: 60, height: 60, borderRadius: 10 },
  previewDoc: { width: 60, height: 60, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  previewSuppr: { position: 'absolute', top: -6, right: -6 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  attachButton: { paddingBottom: 4 },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 120 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  menu: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  menuTitre: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  menuIcone: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
});
