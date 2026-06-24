import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function PlanningScreen({ onNavigate, planningImage, setPlanningImage }) {

  // Uploader une image depuis la galerie
  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPlanningImage({ type: 'image', uri: result.assets[0].uri });
    }
  };

  // Uploader un PDF depuis les fichiers
  const uploadPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      setPlanningImage({ type: 'pdf', uri: result.assets[0].uri, nom: result.assets[0].name });
    }
  };

  const fichier = planningImage;

  return (
    <View style={styles.container}>

      {/* Barre du haut */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('home')}>
          <Ionicons name="close" size={26} color="#fb7500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accueil du Jour</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>

        <Text style={styles.titre}>Planning de la semaine</Text>

        {/* Aperçu du fichier */}
        {!fichier && (
          <View style={styles.placeholder}>
            <Ionicons name="calendar-outline" size={70} color="#ddd" />
            <Text style={styles.placeholderTexte}>Aucun planning uploadé</Text>
          </View>
        )}

        {fichier?.type === 'image' && (
          <Image source={{ uri: fichier.uri }} style={styles.image} resizeMode="contain" />
        )}

        {fichier?.type === 'pdf' && (
          <View style={styles.pdfApercu}>
            <Ionicons name="document-text" size={60} color="#fb7500" />
            <Text style={styles.pdfNom}>{fichier.nom}</Text>
            <Text style={styles.pdfSub}>PDF uploadé avec succès</Text>
          </View>
        )}

        {/* Boutons upload */}
        <TouchableOpacity style={styles.boutonUpload} onPress={uploadImage}>
          <Ionicons name="image-outline" size={22} color="#ffffff" />
          <Text style={styles.boutonTexte}>
            {fichier?.type === 'image' ? "Changer l'image" : 'Uploader une image'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boutonUpload, styles.boutonPDF]} onPress={uploadPDF}>
          <Ionicons name="document-text-outline" size={22} color="#fb7500" />
          <Text style={[styles.boutonTexte, styles.boutonTextePDF]}>
            {fichier?.type === 'pdf' ? 'Changer le PDF' : 'Uploader un PDF'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          Le planning sera visible immédiatement par les familles.
        </Text>

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
  content: { flex: 1, padding: 24, gap: 16 },
  titre: { fontSize: 20, fontWeight: '700', color: '#333' },
  placeholder: {
    width: '100%', height: 260,
    backgroundColor: '#ffffff', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', gap: 12,
    borderWidth: 2, borderColor: '#eee', borderStyle: 'dashed',
  },
  placeholderTexte: { fontSize: 15, color: '#bbb' },
  image: {
    width: '100%', height: 260,
    borderRadius: 16, backgroundColor: '#fff',
  },
  pdfApercu: {
    width: '100%', height: 260,
    backgroundColor: '#ffffff', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  pdfNom: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'center', paddingHorizontal: 16 },
  pdfSub: { fontSize: 13, color: '#aaa' },
  boutonUpload: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fb7500', borderRadius: 14,
    paddingHorizontal: 28, paddingVertical: 14,
    justifyContent: 'center',
  },
  boutonPDF: {
    backgroundColor: '#ffffff',
    borderWidth: 2, borderColor: '#fb7500',
  },
  boutonTexte: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  boutonTextePDF: { color: '#fb7500' },
  info: { fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20 },
});
