import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash, Eye, Settings, Users, Search, Calendar, MapPin, Trophy, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate } from '@/lib/utils';

interface Match {
    id: number;
    team_1_id: number;
    team_2_id: number;
    date_match: string;
    lieu: string | null;
    statut: 'planifie' | 'en_cours' | 'termine';
    score_team_1: number | null;
    score_team_2: number | null;
    compo_publique: boolean;
    team1?: { nom: string; code: string };
    team2?: { nom: string; code: string };
    player_matches_count?: number;
}

interface Props {
    matches: Match[];
    success?: string;
}

export default function MatchesIndex({ matches, success }: Props) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [matchToDelete, setMatchToDelete] = useState<number | null>(null);

    const filteredMatches = matches.filter((match) =>
        match.team1?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2?.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: number) => {
        setMatchToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (matchToDelete) {
            router.delete(`/admin/matches/${matchToDelete}`);
        }
        setDeleteDialogOpen(false);
    };

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'planifie':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'en_cours':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'termine':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <AdminLayout
            title="Matchs"
            description="Gérez les matchs, compositions et résultats"
        >
            <Head title="Matchs" />

            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher un match..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Link href="/admin/matches/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un match
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Matchs</p>
                            <p className="text-2xl font-bold">{matches.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Planifiés</p>
                            <p className="text-2xl font-bold">
                                {matches.filter((m) => m.statut === 'planifie').length}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Terminés</p>
                            <p className="text-2xl font-bold">
                                {matches.filter((m) => m.statut === 'termine').length}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Match</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Lieu</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Compo</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMatches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    {searchTerm ? (
                                        <p>Aucun match trouvé pour "{searchTerm}"</p>
                                    ) : (
                                        <p>Aucun match. Commencez par ajouter un match.</p>
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMatches.map((match) => (
                                <TableRow key={match.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{match.team1?.nom}</span>
                                            <span className="text-gray-400">vs</span>
                                            <span className="font-semibold">{match.team2?.nom}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {match.team1?.code}
                                            </Badge>
                                            <span className="text-gray-400">-</span>
                                            <Badge variant="outline" className="text-xs">
                                                {match.team2?.code}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{formatDate(match.date_match)}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(match.date_match).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {match.lieu ? (
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate max-w-[150px]">{match.lieu}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {match.statut === 'termine' && match.score_team_1 !== null && match.score_team_2 !== null ? (
                                            <div className="flex items-center gap-2 font-bold text-lg">
                                                <span>{match.score_team_1}</span>
                                                <span className="text-gray-400">-</span>
                                                <span>{match.score_team_2}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.statut)}`}>
                                            {match.statut === 'planifie' && 'Planifié'}
                                            {match.statut === 'en_cours' && 'En cours'}
                                            {match.statut === 'termine' && 'Terminé'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {match.player_matches_count ?? 0}
                                            </span>
                                            {match.compo_publique ? (
                                                <Eye className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/matches/${match.id}/detail`}>
                                                <Button variant="outline" size="sm" title="Gérer">
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/matches/${match.id}/edit`}>
                                                <Button variant="ghost" size="sm" title="Modifier">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteClick(match.id)}
                                                title="Supprimer"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="Supprimer le match"
                description="Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </AdminLayout>
    );
}
