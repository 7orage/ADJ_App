import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const COULEUR = '#fb7500';
const TYPE_ICONES = {
  image: 'image-outline', video: 'videocam-outline',
  audio: 'musical-notes-outline', pdf: 'document-text-outline',
};

export default function MessagingScreen({ onNavigate, profilADJ, onOuvrirProfilAdmin, messages = [], onEnvoyer, onOuvrir }) {
  const [message, setMessage] = useState('');
  const [pieces, setPieces] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const scroll = useRef(null);

  useEffect(() => { onOuvrir?.(); }, []);
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

  const nomAdmin = profilADJ ? `${profilADJ.prenom} ${profilADJ.nom}` : 'Responsable';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('home')}>
          <Ionicons name="close" size={26} color={COULEUR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.card} onPress={onOuvrirProfilAdmin}>
          <View style={styles.cardAvatar}>
            {profilADJ?.photo
              ? <Image source={{ uri: profilADJ.photo }} style={styles.cardAvatarImg} />
              : <Ionicons name="person" size={26} color={COULEUR} />
            }
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>{profilADJ?.poste || 'Responsable ADJ'}</Text>
            <Text style={styles.cardValue}>{nomAdmin}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Messagerie</Text>

        {messages.map(msg => {
          const isMoi = msg.from === 'resident';
          return (
            <View key={msg.id} style={[styles.bubbleRow, isMoi ? styles.rowRight : styles.rowLeft]}>
              {!isMoi && (
                <View style={styles.msgAvatar}>
                  {profilADJ?.photo
                    ? <Image source={{ uri: profilADJ.photo }} style={styles.msgAvatarImg} />
                    : <Ionicons name="person" size={14} color={COULEUR} />
                  }
                </View>
              )}
              <View style={[styles.bubble, isMoi ? styles.bubbleMoi : styles.bubbleAutre]}>
                {msg.pieces?.map((p, i) => (
                  <View key={i} style={styles.pieceJointe}>
                    {p.type === 'image'
                      ? <Image source={{ uri: p.uri }} style={styles.pieceImage} />
                      : <View style={styles.pieceDoc}><Ionicons name={TYPE_ICONES[p.type]} size={20} color={isMoi ? '#fff' : COULEUR} /><Text style={[styles.pieceNom, isMoi && { color: '#fff' }]} numberOfLines={1}>{p.nom}</Text></View>
                    }
                  </View>
                ))}
                {msg.text ? <Text style={[styles.bubbleText, isMoi ? styles.textMoi : styles.textAutre]}>{msg.text}</Text> : null}
                <View style={styles.bubbleMeta}>
                  <Text style={[styles.bubbleHeure, isMoi ? styles.heureRight : styles.heureLeft]}>{msg.heure}</Text>
                  {isMoi && (
                    <Ionicons
                      name={msg.lu ? 'checkmark-done' : 'checkmark'}
                      size={14}
                      color={msg.lu ? '#fed7aa' : 'rgba(255,255,255,0.6)'}
                      style={styles.checkmark}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {pieces.length > 0 && (
        <View style={styles.previewBar}>
          {pieces.map((p, i) => (
            <View key={i} style={styles.previewItem}>
              {p.type === 'image' ? <Image source={{ uri: p.uri }} style={styles.previewImg} /> : <View style={styles.previewDoc}><Ionicons name={TYPE_ICONES[p.type]} size={20} color={COULEUR} /></View>}
              <TouchableOpacity style={styles.previewSuppr} onPress={() => setPieces(p2 => p2.filter((_, j) => j !== i))}>
                <Ionicons name="close-circle" size={18} color="#f00" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachButton} onPress={() => setMenuVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color={COULEUR} />
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Votre message..." placeholderTextColor="#bbb" value={message} onChangeText={setMessage} multiline />
        <TouchableOpacity style={styles.sendButton} onPress={envoyer}>
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
                <View style={styles.menuIcone}><Ionicons name={opt.icon} size={24} color={COULEUR} /></View>
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
  header: { height: 90, backgroundColor: COULEUR, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  spacer: { width: 44 },
  content: { padding: 16, gap: 8, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 3, marginBottom: 8, gap: 14 },
  cardAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff3e8', borderWidth: 2, borderColor: COULEUR, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 13, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  cardValue: { fontSize: 18, fontWeight: '600', color: '#333' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#555', marginLeft: 4 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  rowRight: { justifyContent: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: COULEUR, backgroundColor: '#fff3e8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  msgAvatarImg: { width: 28, height: 28, borderRadius: 14 },
  cardAvatarImg: { width: 50, height: 50, borderRadius: 25 },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bubbleMoi: { backgroundColor: COULEUR, borderBottomRightRadius: 4 },
  bubbleAutre: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  textMoi: { color: '#fff' },
  textAutre: { color: '#333' },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 },
  bubbleHeure: { fontSize: 11 },
  heureRight: { color: 'rgba(255,255,255,0.7)' },
  heureLeft: { color: '#aaa' },
  checkmark: { marginLeft: 2 },
  pieceJointe: { gap: 4 },
  pieceImage: { width: 200, height: 150, borderRadius: 12 },
  pieceDoc: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pieceNom: { fontSize: 13, color: '#666', flex: 1 },
  previewBar: { flexDirection: 'row', padding: 8, gap: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  previewItem: { position: 'relative' },
  previewImg: { width: 60, height: 60, borderRadius: 10 },
  previewDoc: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#fff3e8', alignItems: 'center', justifyContent: 'center' },
  previewSuppr: { position: 'absolute', top: -6, right: -6 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  attachButton: { paddingBottom: 4 },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 120 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COULEUR, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  menu: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  menuTitre: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  menuIcone: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff3e8', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
});
