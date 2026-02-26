import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Plus, Edit, Trash, Search, User } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero?: string;
    date_naissance?: string;
    nationalite?: string;
    team?: {
        id: number;
        nom: string;
    };
}

interface Team {
    id: number;
    nom: string;
}

interface Props {
    players: Player[];
    teams: Team[];
    selectedTeam?: number;
    success?: string;
}

export default function PlayersIndex({ players, teams, selectedTeam, success }: Props) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState(selectedTeam?.toString() ?? 'all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);

    const filteredPlayers = useMemo(() => {
        return players.filter((player) => {
            const matchesSearch =
                player.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                player.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (player.numero && player.numero.includes(searchTerm));
            
            const matchesTeam = teamFilter === 'all' || player.team?.id.toString() === teamFilter;
            
            return matchesSearch && matchesTeam;
        });
    }, [players, searchTerm, teamFilter]);

    const handleDeleteClick = (id: number) => {
        setPlayerToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (playerToDelete) {
            router.delete(`/admin/players/${playerToDelete}`);
        }
        setDeleteDialogOpen(false);
    };

    return (
        <AdminLayout
            title="Joueurs"
            description="Gérez les joueurs de toutes les équipes"
        >
            <Head title="Joueurs" />

            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">
                        {success}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher un joueur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Toutes les équipes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les équipes</SelectItem>
                            {teams.map((team) => (
                                <SelectItem key={team.id} value={team.id.toString()}>
                                    {team.nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Link href="/admin/players/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un joueur
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Joueurs</p>
                            <p className="text-2xl font-bold">{players.length}</p>
                        </div>
                        <User className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Équipes</p>
                            <p className="text-2xl font-bold">{teams.length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Search className="w-4 h-4 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Filtrés</p>
                            <p className="text-2xl font-bold">{filteredPlayers.length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Search className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Joueur</TableHead>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Équipe</TableHead>
                            <TableHead>Nationalité</TableHead>
                            <TableHead>Âge</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlayers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500"
                                >
                                    {searchTerm || teamFilter !== 'all' ? (
                                        <p>Aucun joueur trouvé pour les filtres sélectionnés</p>
                                    ) : (
                                        <p>Aucun joueur. Commencez par ajouter un joueur.</p>
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPlayers.map((player) => (
                                <TableRow key={player.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{player.prenom} {player.nom}</p>
                                                {player.date_naissance && (
                                                    <p className="text-xs text-gray-500">
                                                        Né(e) le {new Date(player.date_naissance).toLocaleDateString('fr-FR')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {player.numero ? (
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                                                {player.numero}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {player.team ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                {player.team.nom}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Aucune équipe</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {player.nationalite ? (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {player.nationalite}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {player.date_naissance ? (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {calculateAge(player.date_naissance)} ans
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link
                                            href={`/admin/players/${player.id}/edit`}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                title="Modifier"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(player.id)}
                                            title="Supprimer"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
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
                title="Supprimer le joueur"
                description="Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </AdminLayout>
    );
}

function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}
