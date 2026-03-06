import { Head } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Trophy, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Team {
    id: number;
    nom: string;
    code: string;
    logo_url: string;
    priorite: number;
    total_points: number;
    rank: number;
}

interface Props {
    teamsRanking: Team[];
    currentTeam: Team;
}

export default function Rankings({ teamsRanking, currentTeam }: Props) {
    const getRankBadgeColor = (rank: number) => {
        if (rank === 1) return 'bg-yellow-400 text-yellow-900';
        if (rank === 2) return 'bg-gray-300 text-gray-700';
        if (rank === 3) return 'bg-amber-600 text-amber-50';
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <>
            <Head title="Classements" />
            <TeamLayout title="Classements" description="Consultez le classement des équipes">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Classement des Équipes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {teamsRanking.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Aucune équipe classée</p>
                            ) : (
                                teamsRanking.map((team) => (
                                    <div
                                        key={team.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${
                                            team.id === currentTeam.id
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadgeColor(team.rank)}`}>
                                                {team.rank <= 3 ? (
                                                    <Medal className="w-5 h-5" />
                                                ) : (
                                                    team.rank
                                                )}
                                            </div>
                                            <img
                                                src={team.logo_url || 'https://via.placeholder.com/40'}
                                                alt={team.nom}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {team.nom}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Code: {team.code}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {team.total_points} pts
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TeamLayout>
        </>
    );
}
