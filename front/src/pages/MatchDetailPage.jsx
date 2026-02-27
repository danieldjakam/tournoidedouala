import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader,
  Shirt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '../components/layout/Sidebar';
import MatchVoteModal from '../components/MatchVoteModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import * as matchService from '@/api/matchService';

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('matches');
  const [match, setMatch] = useState(null);
  const [composition, setComposition] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  useEffect(() => {
    const loadMatchDetails = async () => {
      try {
        setIsLoading(true);

        // Load match details
        const matchResult = await matchService.getMatch(matchId);
        if (matchResult.success) {
          setMatch(matchResult.match);
          setComposition(matchResult.composition);
          setUserVote(matchResult.userVote);
          setHasVoted(!!matchResult.userVote);
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les détails du match',
            variant: 'destructive',
          });
        }

        // Check if user has voted
        if (currentUser) {
          const voteResult = await matchService.getMyVoteForMatch(matchId);
          if (voteResult.success) {
            setHasVoted(voteResult.hasVoted);
            setUserVote(voteResult.vote);
          }
        }
      } catch (error) {
        console.error('Error loading match details:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchId, currentUser, toast]);

  const handleVoteClick = () => {
    if (!currentUser) {
      toast({
        title: 'Authentification requise',
        description: 'Veuillez vous connecter pour voter',
        variant: 'destructive',
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: 'Déjà voté',
        description: 'Vous avez déjà voté pour ce match',
        variant: 'destructive',
      });
      return;
    }

    if (!matchService.canUserVote(match, hasVoted)) {
      toast({
        title: 'Vote fermé',
        description: 'Les votes sont fermés pour ce match',
        variant: 'destructive',
      });
      return;
    }

    setIsVoteModalOpen(true);
  };

  const handleVoteSuccess = (vote) => {
    setUserVote(vote);
    setHasVoted(true);
    toast({
      title: 'Succès',
      description: 'Votre pronostic a été enregistré avec succès',
    });
  };

  const canVote = match && matchService.canUserVote(match, hasVoted);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusBadge = (statut) => {
    const badges = {
      planifie: { label: 'À venir', color: 'bg-blue-100 text-blue-800' },
      en_cours: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
      termine: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
    };
    return badges[statut] || { label: statut, color: 'bg-gray-100 text-gray-800' };
  };

  const getStatusInfo = () => {
    if (!match) return null;
    
    if (hasVoted && userVote) {
      return {
        icon: CheckCircle,
        text: 'Vous avez voté',
        subtext: `Équipe: ${userVote.team_vote?.nom || 'N/A'}`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      };
    }
    
    if (match.statut === 'termine') {
      return {
        icon: Lock,
        text: 'Match terminé',
        subtext: 'Les votes sont fermés',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      };
    }
    
    if (match.statut === 'en_cours') {
      return {
        icon: Lock,
        text: 'Match en cours',
        subtext: 'Les votes sont fermés',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      };
    }
    
    if (hasVoted) {
      return {
        icon: Lock,
        text: 'Déjà voté',
        subtext: 'Votre pronostic est verrouillé',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      };
    }
    
    return {
      icon: Trophy,
      text: 'Vote ouvert',
      subtext: 'Faites votre pronostic avant le début du match',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="mx-auto text-[#023e78] animate-spin mb-4" />
          <p className="text-gray-600">Chargement du match...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Match non trouvé</h2>
          <p className="text-gray-500 mb-4">Ce match n'existe pas ou a été supprimé</p>
          <Link to="/matches">
            <Button className="bg-[#023e78] hover:bg-[#0356a8]">
              Retour aux matchs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(match.statut);
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] relative">
      {/* Éléments décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="flex relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 md:ml-72 p-6 lg:p-8 transition-all duration-300">
          {/* Back button */}
          <button
            onClick={() => navigate('/matches')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#023e78] mb-6 transition"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Retour aux matchs</span>
          </button>

          {/* Match Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            {/* Status Bar */}
            <div className={`px-6 py-4 ${statusInfo.bgColor} border-b border-gray-100`}>
              <div className="flex items-center gap-3">
                <StatusIcon size={20} className={statusInfo.color} />
                <div>
                  <p className={`font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                  <p className="text-sm text-gray-600">{statusInfo.subtext}</p>
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(match.date_match)}</span>
                  </div>
                  {match.lieu && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{match.lieu}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-3 gap-4 items-center mb-6">
                {/* Team 1 */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 bg-gray-50 rounded-full p-3 shadow">
                    <img
                      src={match.team1?.logo_url || 'https://via.placeholder.com/100'}
                      alt={match.team1?.nom}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-bold text-base text-gray-900">{match.team1?.nom}</p>
                  {match.statut === 'termine' && (
                    <p className="text-3xl font-black text-[#023e78] mt-2">
                      {match.score_team_1 ?? 0}
                    </p>
                  )}
                </div>

                {/* VS / Score */}
                <div className="text-center">
                  {match.statut === 'termine' ? (
                    <div className="text-2xl font-bold text-gray-400">-</div>
                  ) : (
                    <div className="text-3xl font-black text-gray-300">VS</div>
                  )}
                </div>

                {/* Team 2 */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 bg-gray-50 rounded-full p-3 shadow">
                    <img
                      src={match.team2?.logo_url || 'https://via.placeholder.com/100'}
                      alt={match.team2?.nom}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-bold text-base text-gray-900">{match.team2?.nom}</p>
                  {match.statut === 'termine' && (
                    <p className="text-3xl font-black text-[#023e78] mt-2">
                      {match.score_team_2 ?? 0}
                    </p>
                  )}
                </div>
              </div>

              {/* Vote Button */}
              {canVote && (
                <Button
                  onClick={handleVoteClick}
                  className="w-full bg-gradient-to-r from-[#023e78] to-[#0356a8] hover:from-[#0356a8] hover:to-[#023e78] text-white py-6 text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Trophy size={20} className="mr-2" />
                  Faire un pronostic
                </Button>
              )}

              {/* Already voted message */}
              {hasVoted && userVote && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <p className="font-bold text-green-800">Votre pronostic</p>
                  </div>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>
                      <span className="font-medium">Équipe gagnante :</span>{' '}
                      <span className="font-bold">{userVote.team_vote?.nom || 'N/A'}</span>
                    </p>
                    {userVote.player_vote && (
                      <p>
                        <span className="font-medium">Homme du match :</span>{' '}
                        <span className="font-bold">
                          {userVote.player_vote.prenom} {userVote.player_vote.nom}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-green-600 mt-2">
                      Votre pronostic est verrouillé et ne peut plus être modifié.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compositions */}
          {composition && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-[#023e78]/10 to-[#f71a18]/10 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Shirt size={20} className="text-[#023e78]" />
                  <h2 className="text-lg font-bold text-gray-900">Compositions d'équipe</h2>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team 1 Composition */}
                <div>
                  <h3 className="font-bold text-[#023e78] mb-4 flex items-center gap-2">
                    <img
                      src={match.team1?.logo_url || 'https://via.placeholder.com/32'}
                      alt={match.team1?.nom}
                      className="w-6 h-6 object-contain"
                    />
                    {match.team1?.nom}
                  </h3>
                  <div className="space-y-2">
                    {composition.team1
                      ?.filter((p) => p.titulaire)
                      .map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-xs font-bold bg-[#023e78] text-white px-2 py-1 rounded">
                            {player.poste}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {player.prenom} {player.nom}
                          </span>
                          {player.numero && (
                            <span className="text-xs text-gray-500">#{player.numero}</span>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Substitutes */}
                  {composition.team1?.some((p) => !p.titulaire) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-gray-600 mb-2">Remplaçants</h4>
                      <div className="space-y-2">
                        {composition.team1
                          ?.filter((p) => !p.titulaire)
                          .map((player) => (
                            <div
                              key={player.id}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                              <span className="text-xs font-bold bg-gray-400 text-white px-2 py-1 rounded">
                                {player.poste}
                              </span>
                              <span className="text-sm text-gray-700">
                                {player.prenom} {player.nom}
                              </span>
                              {player.numero && (
                                <span className="text-xs text-gray-500">#{player.numero}</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team 2 Composition */}
                <div>
                  <h3 className="font-bold text-[#023e78] mb-4 flex items-center gap-2">
                    <img
                      src={match.team2?.logo_url || 'https://via.placeholder.com/32'}
                      alt={match.team2?.nom}
                      className="w-6 h-6 object-contain"
                    />
                    {match.team2?.nom}
                  </h3>
                  <div className="space-y-2">
                    {composition.team2
                      ?.filter((p) => p.titulaire)
                      .map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-xs font-bold bg-[#f71a18] text-white px-2 py-1 rounded">
                            {player.poste}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {player.prenom} {player.nom}
                          </span>
                          {player.numero && (
                            <span className="text-xs text-gray-500">#{player.numero}</span>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Substitutes */}
                  {composition.team2?.some((p) => !p.titulaire) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-gray-600 mb-2">Remplaçants</h4>
                      <div className="space-y-2">
                        {composition.team2
                          ?.filter((p) => !p.titulaire)
                          .map((player) => (
                            <div
                              key={player.id}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                              <span className="text-xs font-bold bg-gray-400 text-white px-2 py-1 rounded">
                                {player.poste}
                              </span>
                              <span className="text-sm text-gray-700">
                                {player.prenom} {player.nom}
                              </span>
                              {player.numero && (
                                <span className="text-xs text-gray-500">#{player.numero}</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Composition not visible */}
          {!composition && match.statut === 'planifie' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <Lock size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Composition non disponible
              </h3>
              <p className="text-gray-500">
                Les compositions seront affichées 1 heure avant le début du match.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de vote */}
      <MatchVoteModal
        match={match}
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onVoteSuccess={handleVoteSuccess}
      />
    </div>
  );
};

export default MatchDetailPage;
