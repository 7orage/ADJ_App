import { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import { StatusBar } from 'expo-status-bar';
import { demanderPermissions, envoyerNotification, supprimerToken } from './utils/notifications';

// Zone résidente
import ResidentHome from './screens/resident/HomeScreen';
import ResidentProfile from './screens/resident/ProfileScreen';
import ResidentMessaging from './screens/resident/MessagingScreen';

// Zone équipier
import EquipierHome from './screens/equipier/HomeScreen';
import EquipierProfile from './screens/equipier/ProfileScreen';
import EquipierMessagerie from './screens/equipier/MessagingScreen';
import EquipierProfilAdmin from './screens/equipier/ProfilAdminScreen';
import EquipierResidents from './screens/equipier/ResidentsScreen';
import EquipierProfilResident from './screens/equipier/ProfilResidentScreen';
import EquipierCanalGroupe from './screens/equipier/CanalGroupeScreen';

// Zone admin
import AdminHome from './screens/admin/HomeScreen';
import AdminProfile from './screens/admin/ProfileScreen';
import AdminMessaging from './screens/admin/MessagingScreen';
import AdminMessagerieListe from './screens/admin/MessagerieListeScreen';
import AdminPlanning from './screens/admin/PlanningScreen';
import AdminNouvellePublication from './screens/admin/NouvellePublicationScreen';
import AdminResidents from './screens/admin/ResidentsScreen';
import AdminEditResident from './screens/admin/EditResidentScreen';
import AdminNouveauResident from './screens/admin/NouveauResidentScreen';
import AdminNouvelEquipier from './screens/admin/NouveauStaffScreen';
import AdminGererEquipe from './screens/admin/GererEquipeScreen';
import AdminEditEquipier from './screens/admin/EditEquipierScreen';
import AdminPublications from './screens/admin/PublicationsScreen';

// null = écran de connexion, sinon 'admin' | 'equipier' | 'resident'

const PUBLICATIONS_INITIAL = [
  {
    id: '0',
    type: 'annonce',
    jour: 'Lundi 23 juin',
    texte: 'Rappel : pas de service jeudi prochain, jour férié. Bonne semaine à tous !',
    photos: [],
  },
  {
    id: '1',
    jour: 'Lundi 22 juin',
    texte: "Atelier peinture ce matin, super ambiance ! Tout le monde a participé avec enthousiasme.",
    photos: ['#FFB347', '#87CEEB', '#98FB98'],
  },
  {
    id: '2',
    jour: 'Vendredi 19 juin',
    texte: "Sortie au marché du quartier. Beaux échanges et emplettes pour la cuisine de la semaine prochaine.",
    photos: ['#DDA0DD', '#F0E68C'],
  },
  {
    id: '3',
    jour: 'Mercredi 17 juin',
    texte: "Séance gym douce avec notre kiné. Exercices d'équilibre et étirements en musique.",
    photos: ['#20B2AA', '#FF6347', '#9370DB', '#3CB371'],
  },
];

const RESIDENTS_INITIAL = [
  {
    id: '1',
    prenom: 'Marie',
    nom: 'Dupont',
    dateInscription: '01 janvier 2023',
    jours: ['Lundi', 'Mercredi', 'Vendredi'],
    prix: '18,50 €',
    pia: 'PIA en cours',
    piaMaj: '15 mars 2025',
    contactNom: 'Julie Dupont',
    contactLien: 'Fille',
    contactTel: '06 12 34 56 78',
    transport: 'Véhicule ADJ',
    transportTel: '04 56 78 90 12',
  },
  {
    id: '2',
    prenom: 'Robert',
    nom: 'Martin',
    dateInscription: '10 mars 2022',
    jours: ['Mardi', 'Jeudi'],
    prix: '18,50 €',
    pia: 'Aucun',
    piaMaj: '',
    contactNom: 'Pierre Martin',
    contactLien: 'Fils',
    contactTel: '06 98 76 54 32',
    transport: 'Famille',
    transportTel: '06 98 76 54 32',
  },
];

// convId = 'resident-{id}' ou 'equipier-{id}'
function convId(personne) {
  return personne?.poste ? `equipier-${personne.id}` : `resident-${personne?.id}`;
}

export default function App() {
  const [mode, setMode] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [userId, setUserId] = useState(null);

  // ─── Messages partagés ───────────────────────────────────────────────────
  const [convMessages, setConvMessages] = useState({
    'resident-1': [
      { id: 'init', from: 'admin', text: 'Bonjour, comment pouvons-nous vous aider ?',
        pieces: [], heure: '09:00', lu: false },
    ],
  });

  const envoyerMessage = (cid, from, text, pieces = []) => {
    const msg = {
      id: Date.now().toString(), from, text, pieces,
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lu: false,
    };
    setConvMessages(prev => ({ ...prev, [cid]: [...(prev[cid] || []), msg] }));

    // Notification push au destinataire
    const apercu = text.length > 60 ? text.substring(0, 60) + '…' : (text || '📎 Pièce jointe');
    if (from === 'admin') {
      // Admin → résident ou équipier : cibler uniquement cette personne
      const [type, id] = cid.split('-');
      let userIdDestinataire = null;
      if (type === 'resident') {
        const r = residents.find(r => r.id === id);
        if (r) userIdDestinataire = r.nom.toUpperCase();
      } else {
        const e = equipe.find(e => e.id === id);
        if (e) userIdDestinataire = e.nom.toUpperCase();
      }
      envoyerNotification('💬 Message de l\'ADJ', apercu, [type], userIdDestinataire);
    } else {
      // Résident ou équipier → admin : notifier le mode admin
      envoyerNotification('💬 Nouveau message', apercu, ['admin']);
    }
  };

  const marquerLu = (cid, lecteur) => {
    setConvMessages(prev => ({
      ...prev,
      [cid]: (prev[cid] || []).map(m => m.from !== lecteur ? { ...m, lu: true } : m),
    }));
  };

  // Non-lus calculés dynamiquement
  const nonLusPourAdmin = Object.values(convMessages)
    .reduce((acc, msgs) => acc + msgs.filter(m => m.from !== 'admin' && !m.lu).length, 0);

  const nonLusParConv = Object.fromEntries(
    Object.entries(convMessages).map(([cid, msgs]) => [
      cid, msgs.filter(m => m.from !== 'admin' && !m.lu).length,
    ])
  );

  useEffect(() => {
    if (mode !== null && userId !== null) {
      demanderPermissions(mode, userId);
    }
  }, [mode, userId]);

  const deconnecter = async () => {
    await supprimerToken();
    setMode(null);
    setCurrentPage('home');
    setUserId(null);
  };
  const [planningImage, setPlanningImage] = useState(null);
  const [profilADJ, setProfilADJ] = useState({
    prenom: 'Sophie',
    nom: 'Bernard',
    poste: 'Responsable ADJ',
    telephonePerso: '06 11 22 33 44',
    emailPro: 'sophie.bernard@adj.fr',
    nomAdj: 'Accueil de Jour',
    adresse: '12 rue des Lilas, 75001 Paris',
    telephoneAdj: '01 23 45 67 89',
    emailAdj: 'contact@adj.fr',
    horaires: 'Lundi – Vendredi : 9h00 – 17h00',
  });
  const [equipe, setEquipe] = useState([
    { id: 'e1', prenom: 'Sophie', nom: 'Bernard', poste: 'Responsable ADJ', telephone: '06 11 22 33 44' },
    { id: 'e2', prenom: 'Luc', nom: 'Moreau', poste: 'Aide-soignant', telephone: '06 55 66 77 88' },
  ]);
  const [publications, setPublications] = useState(PUBLICATIONS_INITIAL);
  const [residents, setResidents] = useState(RESIDENTS_INITIAL);
  const [residentSelectionne, setResidentSelectionne] = useState(null);
  const [publicationSelectionnee, setPublicationSelectionnee] = useState(null);
  const [residentMessagerie, setResidentMessagerie] = useState(null);
  const [equipierSelectionne, setEquipierSelectionne] = useState(null);

  const ouvrirResident = (resident) => {
    setResidentSelectionne(resident);
    setCurrentPage('edit-resident');
  };

  const ouvrirMessagerieResident = (resident) => {
    setResidentMessagerie(resident);
    setCurrentPage('messagerie-chat');
  };

  const ouvrirChatDepuisListe = (resident) => {
    setResidentMessagerie(resident);
    setCurrentPage('messagerie-chat');
  };

  const sauvegarderResident = (residentModifie) => {
    setResidents(prev =>
      prev.map(r => r.id === residentModifie.id ? residentModifie : r)
    );
    setCurrentPage('residents');
  };

  const creerResident = (nouveau) => {
    setResidents(prev => [...prev, nouveau]);
    setCurrentPage('residents');
  };

  const creerEquipier = (nouveau) => {
    setEquipe(prev => [...prev, nouveau]);
    setCurrentPage('gerer-equipe');
  };

  const ouvrirEquipier = (e) => { setEquipierSelectionne(e); setCurrentPage('edit-equipier'); };
  const sauvegarderEquipier = (e) => { setEquipe(prev => prev.map(x => x.id === e.id ? e : x)); setCurrentPage('gerer-equipe'); };
  const mettreAJourEquipier = (e) => { setEquipe(prev => prev.map(x => x.id === e.id ? e : x)); };
  const supprimerEquipier = (id) => { setEquipe(prev => prev.filter(x => x.id !== id)); setCurrentPage('gerer-equipe'); };

  const supprimerResident = (id) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    setCurrentPage('residents');
  };

  const publierPublication = (pub) => {
    setPublications(prev => [pub, ...prev]);
    setCurrentPage('home');
    const apercu = pub.texte?.length > 80 ? pub.texte.substring(0, 80) + '…' : (pub.texte || 'Nouvelle publication');
    // Résidents inscrits aujourd'hui seulement
    const jourAujourdhui = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const residentsDuJour = residents.filter(r =>
      r.jours?.some(j => j.toLowerCase() === jourAujourdhui.toLowerCase())
    );
    if (residentsDuJour.length > 0) {
      const userIds = residentsDuJour.map(r => r.nom.toUpperCase());
      envoyerNotification('📸 Accueil du Jour', apercu, ['resident'], null, userIds);
    }
    // Tous les équipiers sans restriction
    envoyerNotification('📸 Accueil du Jour', apercu, ['equipier']);
  };

  const notifierResidents = (texte, photos = []) => {
    setPublications(prev => [{
      id: Date.now().toString(),
      type: 'annonce',
      jour: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      texte,
      photos,
    }, ...prev]);
    // Annonces : tous les équipiers + tous les résidents (pas de restriction jour)
    envoyerNotification('📢 Accueil du Jour', texte, ['resident', 'equipier']);
  };

  const supprimerPublication = (id) => {
    setPublications(prev => prev.filter(p => p.id !== id));
  };

  const ouvrirEditionPublication = (pub) => {
    setPublicationSelectionnee(pub);
    setCurrentPage('edit-publication');
  };

  const sauvegarderPublication = (pubModifiee) => {
    setPublications(prev => prev.map(p => p.id === pubModifiee.id ? pubModifiee : p));
    setCurrentPage('publications');
  };

  if (mode === null) {
    return (
      <>
        <LoginScreen onConnexion={(m, uid) => { setMode(m); setUserId(uid); setCurrentPage('home'); }} />
        <StatusBar style="light" />
      </>
    );
  }

  if (mode === 'admin') {
    const cid = convId(residentMessagerie);
    return (
      <>
        {currentPage === 'home'                && <AdminHome               onNavigate={setCurrentPage} messagesNonLus={nonLusPourAdmin} />}
        {currentPage === 'profil'              && <AdminProfile            onNavigate={setCurrentPage} profil={profilADJ} onSauvegarder={setProfilADJ} onDeconnexion={deconnecter} />}
        {currentPage === 'messagerie'          && <AdminMessagerieListe     onNavigate={setCurrentPage} residents={residents} equipe={equipe} onOuvrirChat={ouvrirChatDepuisListe} nonLusParConv={nonLusParConv} />}
        {currentPage === 'messagerie-chat'     && <AdminMessaging          onNavigate={setCurrentPage} resident={residentMessagerie} messages={convMessages[cid] || []} onEnvoyer={(txt, pieces) => envoyerMessage(cid, 'admin', txt, pieces)} onOuvrir={() => marquerLu(cid, 'admin')} photoAdmin={profilADJ.photo} />}
        {currentPage === 'planning'            && <AdminPlanning           onNavigate={setCurrentPage} planningImage={planningImage} setPlanningImage={setPlanningImage} />}
        {currentPage === 'nouvelle-publication'&& <AdminNouvellePublication onNavigate={setCurrentPage} onPublier={publierPublication} onNotifier={notifierResidents} />}
        {currentPage === 'publications'        && <AdminPublications       onNavigate={setCurrentPage} publications={publications} onSupprimer={supprimerPublication} onModifier={ouvrirEditionPublication} />}
        {currentPage === 'edit-publication'    && <AdminNouvellePublication onNavigate={setCurrentPage} publicationEnCours={publicationSelectionnee} onSauvegarder={sauvegarderPublication} />}
        {currentPage === 'residents'           && <AdminResidents          onNavigate={setCurrentPage} residents={residents} onOuvrirResident={ouvrirResident} />}
        {currentPage === 'edit-resident'       && <AdminEditResident       onNavigate={setCurrentPage} resident={residentSelectionne} onSauvegarder={sauvegarderResident} onSupprimer={supprimerResident} onOuvrirMessagerie={ouvrirMessagerieResident} />}
        {currentPage === 'nouveau-resident'    && <AdminNouveauResident    onNavigate={setCurrentPage} onCreerResident={creerResident} />}
        {currentPage === 'nouvel-equipier'      && <AdminNouvelEquipier     onNavigate={setCurrentPage} onCreerStaff={creerEquipier} />}
        {currentPage === 'gerer-equipe'         && <AdminGererEquipe        onNavigate={setCurrentPage} equipe={equipe} onOuvrirEquipier={ouvrirEquipier} />}
        {currentPage === 'edit-equipier'        && <AdminEditEquipier       onNavigate={setCurrentPage} equipier={equipierSelectionne} onSauvegarder={sauvegarderEquipier} onSupprimer={supprimerEquipier} onOuvrirMessagerie={ouvrirMessagerieResident} />}
        {currentPage === 'canal-groupe'         && <EquipierCanalGroupe     onNavigate={setCurrentPage} equipe={equipe} equipierConnecte={{ prenom: profilADJ.prenom, nom: profilADJ.nom }} />}
        <StatusBar style="light" />
      </>
    );
  }

  if (mode === 'equipier') {
    const equipierConnecte = equipe.find(e => e.nom.toUpperCase() === userId) || equipe[1];
    const cidEq = `equipier-${equipierConnecte?.id}`;
    const nonLusEq = (convMessages[cidEq] || []).filter(m => m.from === 'admin' && !m.lu).length;
    return (
      <>
        {currentPage === 'home'                && <EquipierHome            onNavigate={setCurrentPage} messagesNonLus={nonLusEq} />}
        {currentPage === 'profil'              && <EquipierProfile         onNavigate={setCurrentPage} equipier={equipierConnecte} onSauvegarder={mettreAJourEquipier} onDeconnexion={deconnecter} />}
        {currentPage === 'messagerie'          && <EquipierMessagerie      onNavigate={setCurrentPage} profilADJ={profilADJ} onOuvrirProfilAdmin={() => setCurrentPage('profil-admin')} messages={convMessages[cidEq] || []} onEnvoyer={(txt, pieces) => envoyerMessage(cidEq, 'equipier', txt, pieces)} onOuvrir={() => marquerLu(cidEq, 'equipier')} photoMoi={equipierConnecte?.photo} />}
        {currentPage === 'profil-admin'        && <EquipierProfilAdmin     onNavigate={setCurrentPage} profil={profilADJ} />}
        {currentPage === 'planning'            && <AdminPlanning           onNavigate={setCurrentPage} planningImage={planningImage} setPlanningImage={setPlanningImage} />}
        {currentPage === 'nouvelle-publication'&& <AdminNouvellePublication onNavigate={setCurrentPage} onPublier={publierPublication} onNotifier={notifierResidents} />}
        {currentPage === 'publications'        && <AdminPublications       onNavigate={setCurrentPage} publications={publications} onSupprimer={supprimerPublication} onModifier={ouvrirEditionPublication} />}
        {currentPage === 'edit-publication'    && <AdminNouvellePublication onNavigate={setCurrentPage} publicationEnCours={publicationSelectionnee} onSauvegarder={sauvegarderPublication} />}
        {currentPage === 'voir-residents'      && <EquipierResidents       onNavigate={setCurrentPage} residents={residents} onOuvrirResident={(r) => { setResidentSelectionne(r); setCurrentPage('voir-resident'); }} />}
        {currentPage === 'voir-resident'       && <EquipierProfilResident  onNavigate={setCurrentPage} resident={residentSelectionne} />}
        {currentPage === 'canal-groupe'        && <EquipierCanalGroupe     onNavigate={setCurrentPage} equipe={equipe} equipierConnecte={equipierConnecte} />}
        <StatusBar style="light" />
      </>
    );
  }

  const residentConnecte = residents.find(r => r.nom.toUpperCase() === userId) || residents[0];
  const cidRes = `resident-${residentConnecte?.id}`;
  const nonLusRes = (convMessages[cidRes] || []).filter(m => m.from === 'admin' && !m.lu).length;

  return (
    <>
      {currentPage === 'home'       && <ResidentHome      onNavigate={setCurrentPage} planningImage={planningImage} publications={publications} messagesNonLus={nonLusRes} />}
      {currentPage === 'profil'     && <ResidentProfile   onNavigate={setCurrentPage} resident={residentConnecte} onSauvegarder={(r) => setResidents(prev => prev.map(x => x.id === r.id ? r : x))} onDeconnexion={deconnecter} />}
      {currentPage === 'messagerie' && <ResidentMessaging onNavigate={setCurrentPage} profilADJ={profilADJ} onOuvrirProfilAdmin={() => setCurrentPage('profil-admin')} messages={convMessages[cidRes] || []} onEnvoyer={(txt, pieces) => envoyerMessage(cidRes, 'resident', txt, pieces)} onOuvrir={() => marquerLu(cidRes, 'resident')} />}
      {currentPage === 'profil-admin' && <EquipierProfilAdmin onNavigate={setCurrentPage} profil={profilADJ} />}
      <StatusBar style="light" />
    </>
  );
}
