import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Shield, Users, ArrowLeft, Activity, Goal, Trophy, Star, Home, ChevronRight, Grid, List } from 'lucide-react';

// Données factices pour les joueurs
const mockPlayers = [
  { id: 1, prenom: 'Jean', nom: 'Mbarga', numero: 1, poste: 'gardien', age: 28, buts: 0, est_capitaine: false },
  { id: 2, prenom: 'Patrick', nom: 'Essome', numero: 16, poste: 'gardien', age: 25, buts: 0, est_capitaine: false },
  { id: 3, prenom: 'Emmanuel', nom: 'Kundé', numero: 4, poste: 'defenseur', age: 26, buts: 2, est_capitaine: true },
  { id: 4, prenom: 'Nicolas', nom: 'Nkoulou', numero: 5, poste: 'defenseur', age: 29, buts: 1, est_capitaine: false },
  { id: 5, prenom: 'Enoch', nom: 'Mwepu', numero: 3, poste: 'defenseur', age: 24, buts: 0, est_capitaine: false },
  { id: 6, prenom: 'Olivier', nom: 'Ntcham', numero: 2, poste: 'defenseur', age: 27, buts: 1, est_capitaine: false },
  { id: 7, prenom: 'André', nom: 'Onana', numero: 6, poste: 'milieu', age: 25, buts: 3, est_capitaine: false },
  { id: 8, prenom: 'Georges', nom: 'Kevin', numero: 8, poste: 'milieu', age: 26, buts: 5, est_capitaine: false },
  { id: 9, prenom: 'Samuel', nom: 'Eto\'o', numero: 10, poste: 'milieu', age: 30, buts: 8, est_capitaine: false },
  { id: 10, prenom: 'Christian', nom: 'Bassogog', numero: 7, poste: 'milieu', age: 24, buts: 4, est_capitaine: false },
  { id: 11, prenom: 'Vincent', nom: 'Aboubakar', numero: 9, poste: 'attaquant', age: 29, buts: 12, est_capitaine: false },
  { id: 12, prenom: 'Eric', nom: 'Choupo', numero: 13, poste: 'attaquant', age: 31, buts: 10, est_capitaine: false },
  { id: 13, prenom: 'Karl', nom: 'Toko', numero: 11, poste: 'attaquant', age: 23, buts: 6, est_capitaine: false },
  { id: 14, prenom: 'Moumi', nom: 'Ngamaleu', numero: 14, poste: 'attaquant', age: 26, buts: 5, est_capitaine: false },
];

// Composant Terrain de Football
const FootballField = ({ players }) => {
  const gardien = players.filter(p => p.poste === 'gardien')[0];
  const defenseurs = players.filter(p => p.poste === 'defenseur').slice(0, 4);
  const milieux = players.filter(p => p.poste === 'milieu').slice(0, 4);
  const attaquants = players.filter(p => p.poste === 'attaquant').slice(0, 2);

  const PlayerBadge = ({ player, top, left }) => {
    if (!player) return null;
    return (
      <div
        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ top: `${top}%`, left: `${left}%` }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-[#023e78] to-[#023e78]/70 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white">
          {player.numero}
        </div>
        <span className="text-xs font-semibold text-gray-700 mt-1 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded">
          {player.prenom?.split(' ')[0]}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Terrain */}
      <div className="relative bg-gradient-to-b from-green-600 via-green-500 to-green-600 rounded-lg overflow-hidden border-4 border-white shadow-2xl" style={{ aspectRatio: '3/4' }}>
        {/* Lignes du terrain */}
        <div className="absolute inset-4 border-2 border-white/60 rounded"></div>
        
        {/* Ligne médiane */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60"></div>
        
        {/* Rond central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/60"></div>
        
        {/* Point central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>

        {/* Surface de réparation haut */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white/60 border-t-0"></div>
        
        {/* Surface de réparation bas */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white/60 border-b-0"></div>

        {/* Buts */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-white/40 rounded-b"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-white/40 rounded-t"></div>

        {/* Zones de coins */}
        <div className="absolute top-0 left-0 w-8 h-8 border-2 border-white/60 border-r-0 border-b-0 rounded-tl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-2 border-white/60 border-l-0 border-b-0 rounded-tr"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-2 border-white/60 border-r-0 border-t-0 rounded-bl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-2 border-white/60 border-l-0 border-t-0 rounded-br"></div>

        {/* Joueurs - Formation 4-4-2 */}
        {/* Gardien */}
        <PlayerBadge player={gardien} top={88} left={50} />

        {/* Défenseurs */}
        {defenseurs.map((player, index) => (
          <PlayerBadge
            key={player.id}
            player={player}
            top={72}
            left={20 + (index * 20)}
          />
        ))}

        {/* Milieux */}
        {milieux.map((player, index) => (
          <PlayerBadge
            key={player.id}
            player={player}
            top={45}
            left={15 + (index * 23)}
          />
        ))}

        {/* Attaquants */}
        {attaquants.map((player, index) => (
          <PlayerBadge
            key={player.id}
            player={player}
            top={20}
            left={35 + (index * 30)}
          />
        ))}

        {/* Légende */}
        <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-2 rounded-lg text-xs shadow-lg">
          <div className="font-bold text-[#023e78] mb-1">Formation 4-4-2</div>
          <div className="text-gray-600">{players.length} joueurs</div>
        </div>
      </div>
    </div>
  );
};

// Données factices pour l'équipe
const mockTeam = {
  id: '1',
  name: 'Lions Indomptables',
  logo_url: 'https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg',
};

const BordereauPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  // États
  const [activeTab, setActiveTab] = useState('equipes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showFieldView, setShowFieldView] = useState(false);

  // Gestion responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Simulation de chargement avec données factices
        setTimeout(() => {
          setTeam(mockTeam);
          setPlayers(mockPlayers);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur chargement données:', error);
        setTeam(mockTeam);
        setPlayers(mockPlayers);
        setLoading(false);
      }
    };

    loadData();
  }, [teamId]);

  // Filtrer les joueurs par poste
  const gardiens = players.filter(p => p.poste === 'gardien');
  const defenseurs = players.filter(p => p.poste === 'defenseur');
  const milieux = players.filter(p => p.poste === 'milieu');
  const attaquants = players.filter(p => p.poste === 'attaquant');

  // Obtenir l'abréviation du poste
  const getPosteCode = (poste) => {
    const codes = { gardien: 'G', defenseur: 'D', milieu: 'M', attaquant: 'A' };
    return codes[poste] || poste?.substring(0, 2).toUpperCase();
  };

  const isMobile = windowWidth < 768;

  // Affichage chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#023e78] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du bordereau...</p>
        </div>
      </div>
    );
  }

  // Affichage erreur
  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center px-6">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Équipe non trouvée</h3>
          <button
            onClick={() => navigate('/equipes')}
            className="mt-4 px-6 py-2 bg-[#023e78] text-white rounded-lg hover:bg-[#023e78]/80 transition"
          >
            Retour aux équipes
          </button>
        </div>
      </div>
    );
  }

  // Composant carte joueur
  const PlayerCard = ({ player, index }) => (
    <div className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200 hover:border-[#023e78]/30 hover:shadow-md transition-all">
      {/* Numéro et poste */}
      <div className="flex items-center gap-3 w-20 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-[#023e78] to-[#023e78]/70 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {player.numero}
        </div>
        <span className="text-xs text-gray-500 font-medium uppercase">{getPosteCode(player.poste)}</span>
      </div>

      {/* Infos joueur */}
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-800">{player.prenom} {player.nom}</h4>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
          <span>{player.age} ans</span>
          <span className="flex items-center gap-1">
            <Trophy size={12} /> {player.buts} buts
          </span>
        </div>
      </div>

      {/* Badge capitaine */}
      {player.est_capitaine && (
        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star size={12} className="fill-current" /> C
        </div>
      )}
    </div>
  );

  // Composant section joueurs
  const PlayerSection = ({ title, icon: Icon, players }) => {
    if (!players || players.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#023e78] rounded-lg flex items-center justify-center">
            <Icon size={18} className="text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
            {players.length}
          </span>
        </div>
        <div className="space-y-2">
          {players.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Contenu principal */}
      <main className={`transition-all duration-300 ${!isMobile ? 'ml-72' : ''} ${isMobile ? 'pt-16 pb-20' : 'pb-8'}`}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Home size={14} />
            <ChevronRight size={12} />
            <Link to="/equipes" className="text-[#023e78] hover:underline font-medium">Équipes</Link>
            <ChevronRight size={12} />
            <span className="font-medium text-gray-700">Bordereau</span>
          </div>

          {/* Info équipe */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/equipes"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>

              <div className="w-14 h-14 bg-white rounded-full p-2 shadow-md border border-gray-200">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#023e78]">{team.name?.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#023e78]">{team.name}</h1>
                <p className="text-sm text-gray-500">{players.length} joueurs</p>
              </div>
            </div>

            {/* Bouton Vue Terrain */}
            <button
              onClick={() => setShowFieldView(!showFieldView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-md ${
                showFieldView
                  ? 'bg-[#023e78] text-white'
                  : 'bg-white text-[#023e78] hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {showFieldView ? <List size={18} /> : <Grid size={18} />}
              <span className="hidden sm:inline">{showFieldView ? 'Voir liste' : 'Voir terrain'}</span>
            </button>
          </div>
        </div>

        {/* Contenu bordereau */}
        <div className="px-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-[#023e78] to-[#023e78]/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-white" />
                <h2 className="text-lg font-bold text-white">
                  {showFieldView ? 'Composition sur le Terrain' : 'Bordereau des Joueurs'}
                </h2>
              </div>
            </div>

            {/* Corps */}
            <div className="p-6">
              {showFieldView ? (
                /* Vue Terrain */
                <div className="relative">
                  <FootballField players={players} />
                </div>
              ) : (
                /* Vue Liste */
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
                      <div className="text-xl font-bold text-[#023e78]">{players.length}</div>
                      <div className="text-xs text-gray-600 uppercase mt-0.5">Total</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
                      <div className="text-xl font-bold text-green-600">{gardiens.length}</div>
                      <div className="text-xs text-gray-600 uppercase mt-0.5">Gardiens</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center border border-purple-200">
                      <div className="text-xl font-bold text-purple-600">{defenseurs.length + milieux.length}</div>
                      <div className="text-xs text-gray-600 uppercase mt-0.5">Déf/Mil</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 text-center border border-red-200">
                      <div className="text-xl font-bold text-red-600">{attaquants.length}</div>
                      <div className="text-xs text-gray-600 uppercase mt-0.5">Attaquants</div>
                    </div>
                  </div>

                  {/* Sections par poste */}
                  <PlayerSection title="Gardiens" icon={Shield} players={gardiens} />
                  <PlayerSection title="Défenseurs" icon={Activity} players={defenseurs} />
                  <PlayerSection title="Milieux" icon={Goal} players={milieux} />
                  <PlayerSection title="Attaquants" icon={Trophy} players={attaquants} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Espacement mobile */}
        {isMobile && <div className="h-16"></div>}
      </main>
    </div>
  );
};

export default BordereauPage;
