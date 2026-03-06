import { Head } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Calendar, Users, Trophy, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Match {
    id: number;
    team_1_id: number;
    team_2_id: number;
    date_match: string;
    lieu: string;
    statut: string;
    score_team_1: number | null;
    score_team_2: number | null;
    team1: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
    };
    team2: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
    };
}

interface Props {
    team: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
        description: string | null;
    };
    playersCount: number;
    matches: Match[];
    success?: string;
    error?: string;
}

export default function Dashboard({ team, playersCount, matches, success, error }: Props) {
    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'planifie':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'en_cours':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'termine':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case 'planifie':
                return 'À venir';
            case 'en_cours':
                return 'En cours';
            case 'termine':
                return 'Terminé';
            default:
                return statut;
        }
    };

    const isMyTeam = (match: Match) => team.id === match.team_1_id || team.id === match.team_2_id;

    return (
        <>
            <Head title="Tableau de bord" />
            <TeamLayout title={`Gestion de ${team.nom}`} description="Gérez votre équipe et vos compositions">
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                )}

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Joueurs</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{playersCount}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Matchs à venir</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {matches.filter(m => m.statut === 'planifie').length}
                                </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Code équipe</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{team.code}</p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                                <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent matches */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Prochains matchs
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {matches.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                Aucun match programmé
                            </div>
                        ) : (
                            matches.map((match) => {
                                const isHome = team.id === match.team_1_id;
                                const opponent = isHome ? match.team2 : match.team1;

                                // Skip if opponent data is missing
                                if (!opponent) return null;

                                return (
                                    <div
                                        key={match.id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={opponent.logo_url || 'https://via.placeholder.com/48'}
                                                    alt={opponent.nom}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {opponent.nom}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {match.lieu}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(
                                                        match.statut
                                                    )}`}
                                                >
                                                    {getStatutLabel(match.statut)}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {format(new Date(match.date_match), 'dd MMM yyyy', { locale: fr })}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(match.date_match), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </TeamLayout>
        </>
    );
}
