import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Trophy, Users, Zap, TrendingUp } from 'lucide-react';

interface DashboardStats {
    teams_count: number;
    players_count: number;
    matches_count: number;
    upcomingMatches: Array<{
        id: number;
        team1: { nom: string };
        team2: { nom: string };
        date_match: string;
    }>;
}

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <AdminLayout title="Dashboard" description="Overview of the system">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Équipes
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.teams_count}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Équipes disponibles
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Joueurs
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.players_count}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Joueurs registered
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Matchs
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.matches_count}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Matchs planifiés
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Prochains matchs
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.upcomingMatches.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cette semaine
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Prochains Matchs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.upcomingMatches.length > 0 ? (
                            stats.upcomingMatches.map((match) => (
                                <div
                                    key={match.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold">
                                            {match.team1.nom} vs{' '}
                                            {match.team2.nom}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(
                                                match.date_match
                                            ).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                    <Link href={`/admin/matches/${match.id}/edit`}>
                                        <button className="text-blue-500 hover:underline text-sm">
                                            Modifier
                                        </button>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">
                                Aucun match à venir
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
