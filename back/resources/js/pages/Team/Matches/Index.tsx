import { Head, Link } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Calendar, Clock, MapPin } from 'lucide-react';
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
    };
    matches: Match[];
}

export default function Index({ team, matches }: Props) {
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

    const sortedMatches = [...matches].sort(
        (a, b) => new Date(a.date_match).getTime() - new Date(b.date_match).getTime()
    );

    return (
        <>
            <Head title="Matchs" />
            <TeamLayout title="Calendrier des matchs" description="Consultez les matchs de votre équipe">
                <div className="space-y-4">
                    {sortedMatches.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun match programmé</p>
                        </div>
                    ) : (
                        sortedMatches.map((match) => {
                            const isHome = team.id === match.team_1_id;
                            const opponent = isHome ? match.team2 : match.team1;
                            const isMyTeam = team.id === match.team_1_id || team.id === match.team_2_id;

                            return (
                                <Link
                                    key={match.id}
                                    href={`/team/matches/${match.id}`}
                                    className="block"
                                >
                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <img
                                                    src={opponent.logo_url}
                                                    alt={opponent.nom}
                                                    className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(
                                                                match.statut
                                                            )}`}
                                                        >
                                                            {getStatutLabel(match.statut)}
                                                        </span>
                                                        {match.statut === 'termine' && (
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                                {match.score_team_1} - {match.score_team_2}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {team.nom} {isHome ? 'vs' : 'contre'} {opponent.nom}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{match.lieu}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {format(new Date(match.date_match), 'dd MMM yyyy', { locale: fr })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {format(new Date(match.date_match), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </TeamLayout>
        </>
    );
}
