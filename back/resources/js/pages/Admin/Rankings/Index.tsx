import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Trophy,
    Users,
    TrendingUp,
    Target,
    Award,
    RefreshCw,
} from 'lucide-react';

interface TeamRanking {
    id: number;
    nom: string;
    code: string;
    logo: string | null;
    priorite: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    points: number;
    votes_won: number;
    form: string[];
}

interface UserRanking {
    id: number;
    prenom: string;
    nom: string;
    telephone: string;
    points: number;
    total_votes: number;
    correct_votes: number;
    accuracy: number;
    match_votes: number;
    tournament_votes: number;
}

export default function RankingsIndex() {
    const [activeTab, setActiveTab] = useState<'teams' | 'users'>('teams');
    const [teamRankings, setTeamRankings] = useState<TeamRanking[]>([]);
    const [userRankings, setUserRankings] = useState<UserRanking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRankings = async () => {
        setLoading(true);
        try {
            const [teamsRes, usersRes] = await Promise.all([
                fetch('/admin/rankings/teams'),
                fetch('/admin/rankings/users'),
            ]);
            const teamsData = await teamsRes.json();
            const usersData = await usersRes.json();
            setTeamRankings(teamsData);
            setUserRankings(usersData);
        } catch (error) {
            console.error('Error fetching rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    const getFormBadgeColor = (result: string) => {
        switch (result) {
            case 'W':
                return 'bg-green-500 text-white';
            case 'D':
                return 'bg-gray-400 text-white';
            case 'L':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return 'bg-yellow-400 text-yellow-900';
        if (rank === 2) return 'bg-gray-300 text-gray-700';
        if (rank === 3) return 'bg-amber-600 text-amber-100';
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <AdminLayout
            title="Classements"
            description="Consultez les classements des équipes et des pronostiqueurs"
        >
            <Head title="Classements" />

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('teams')}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                        activeTab === 'teams'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Trophy className="w-4 h-4" />
                    Équipes
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                        activeTab === 'users'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    Pronostiqueurs
                </button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchRankings}
                    className="ml-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Classement des équipes */}
            {activeTab === 'teams' && (
                <div className="space-y-6">
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                        <Trophy className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Équipes</p>
                                        <p className="text-2xl font-bold">{teamRankings.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Meilleure attaque</p>
                                        <p className="text-lg font-bold">
                                            {teamRankings.length > 0
                                                ? teamRankings.reduce((max, t) => t.goals_for > max.goals_for ? t : max).nom
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                                        <Target className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Meilleure défense</p>
                                        <p className="text-lg font-bold">
                                            {teamRankings.length > 0
                                                ? teamRankings.reduce((min, t) => t.goals_against < min.goals_against ? t : min).nom
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Leader</p>
                                        <p className="text-lg font-bold">
                                            {teamRankings.length > 0 ? teamRankings[0].nom : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classement des équipes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Équipe</TableHead>
                                        <TableHead className="text-center">J</TableHead>
                                        <TableHead className="text-center">G</TableHead>
                                        <TableHead className="text-center">N</TableHead>
                                        <TableHead className="text-center">P</TableHead>
                                        <TableHead className="text-center">BP</TableHead>
                                        <TableHead className="text-center">BC</TableHead>
                                        <TableHead className="text-center">Diff</TableHead>
                                        <TableHead className="text-center">Pts</TableHead>
                                        <TableHead className="text-center">Forme</TableHead>
                                        <TableHead className="text-center">Votes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamRankings.map((team, index) => (
                                        <TableRow key={team.id}>
                                            <TableCell>
                                                <Badge className={getRankBadge(index + 1)}>
                                                    {index + 1}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {team.logo ? (
                                                        <img
                                                            src={team.logo}
                                                            alt={team.nom}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <Trophy className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p>{team.nom}</p>
                                                        <p className="text-xs text-gray-500">{team.code}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{team.played}</TableCell>
                                            <TableCell className="text-center text-green-600 font-medium">
                                                {team.wins}
                                            </TableCell>
                                            <TableCell className="text-center">{team.draws}</TableCell>
                                            <TableCell className="text-center text-red-600">
                                                {team.losses}
                                            </TableCell>
                                            <TableCell className="text-center">{team.goals_for}</TableCell>
                                            <TableCell className="text-center">{team.goals_against}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={team.goal_difference > 0 ? 'text-green-600 font-medium' : team.goal_difference < 0 ? 'text-red-600' : ''}>
                                                    {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-lg">
                                                {team.points}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    {team.form.map((result, i) => (
                                                        <Badge
                                                            key={i}
                                                            className={`w-6 h-6 ${getFormBadgeColor(result)}`}
                                                        >
                                                            {result}
                                                        </Badge>
                                                    ))}
                                                    {team.form.length === 0 && (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{team.votes_won}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {teamRankings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                                                Aucun match terminé pour le moment
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Classement des pronostiqueurs */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pronostiqueurs</p>
                                        <p className="text-2xl font-bold">{userRankings.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Leader</p>
                                        <p className="text-lg font-bold">
                                            {userRankings.length > 0
                                                ? `${userRankings[0].prenom} ${userRankings[0].nom}`
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                        <Target className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Meilleure précision</p>
                                        <p className="text-lg font-bold">
                                            {userRankings.length > 0
                                                ? `${userRankings.reduce((max, u) => u.accuracy > max.accuracy ? u : max).accuracy}%`
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                        <Trophy className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Plus de points</p>
                                        <p className="text-lg font-bold">
                                            {userRankings.length > 0 ? userRankings[0].points : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classement des pronostiqueurs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Pronostiqueur</TableHead>
                                        <TableHead className="text-center">Points</TableHead>
                                        <TableHead className="text-center">Votes</TableHead>
                                        <TableHead className="text-center">Corrects</TableHead>
                                        <TableHead className="text-center">Précision</TableHead>
                                        <TableHead className="text-center">Matchs</TableHead>
                                        <TableHead className="text-center">Tournoi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userRankings.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <Badge className={getRankBadge(index + 1)}>
                                                    {index + 1}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p>{user.prenom} {user.nom}</p>
                                                    <p className="text-xs text-gray-500">{user.telephone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-bold text-lg text-blue-600">{user.points}</span>
                                            </TableCell>
                                            <TableCell className="text-center">{user.total_votes}</TableCell>
                                            <TableCell className="text-center text-green-600 font-medium">
                                                {user.correct_votes}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${user.accuracy}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">{user.accuracy}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{user.match_votes}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{user.tournament_votes}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {userRankings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                Aucun pronostiqueur pour le moment
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AdminLayout>
    );
}
