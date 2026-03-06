import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Plus, Edit, Trash, Search, Users, Trophy, UserCheck, KeyRound } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Team {
    id: number;
    nom: string;
    code: string;
    logo_url?: string | null;
    description?: string | null;
    priorite: number;
    players_count?: number;
    matches_count?: number;
    has_account: boolean;
    created_at: string;
}

interface Props {
    teams: Team[];
    success?: string;
}

export default function TeamsIndex({ teams, success }: Props) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [accountForm, setAccountForm] = useState({
        email: '',
        telephone: '',
        password: '',
    });

    const filteredTeams = teams.filter((team) =>
        team.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: number) => {
        setTeamToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (teamToDelete) {
            router.delete(`/admin/teams/${teamToDelete}`);
        }
        setDeleteDialogOpen(false);
    };

    const handleGenerateAccountClick = (team: Team) => {
        setSelectedTeam(team);
        setAccountForm({ email: '', telephone: '', password: '' });
        setAccountDialogOpen(true);
    };

    const handleGenerateAccountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTeam) {
            router.post(`/admin/teams/${selectedTeam.id}/generate-account`, accountForm);
            setAccountDialogOpen(false);
        }
    };

    return (
        <AdminLayout
            title="Équipes"
            description="Gérez les équipes participantes aux matchs"
        >
            <Head title="Équipes" />

            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">
                        {success}
                    </p>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                        {flash.error}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher une équipe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Link href="/admin/teams/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une équipe
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Équipe</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Priorité</TableHead>
                            <TableHead>Joueurs</TableHead>
                            <TableHead>Matchs</TableHead>
                            <TableHead>Compte</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeams.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-8 text-gray-500"
                                >
                                    {searchTerm ? (
                                        <p>Aucune équipe trouvée pour "{searchTerm}"</p>
                                    ) : (
                                        <p>Aucune équipe. Commencez par ajouter une équipe.</p>
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeams.map((team) => (
                                <TableRow key={team.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {team.logo_url ? (
                                                <img
                                                    src={team.logo_url}
                                                    alt={team.nom}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                    <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{team.nom}</p>
                                                {team.description && (
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">
                                                        {team.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                            {team.code}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-4 rounded-sm ${
                                                            i < team.priorite
                                                                ? 'bg-blue-500'
                                                                : 'bg-gray-200 dark:bg-gray-700'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">
                                                {team.priorite}/5
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Users className="w-4 h-4" />
                                            {team.players_count ?? 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Trophy className="w-4 h-4" />
                                            {team.matches_count ?? 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {team.has_account ? (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                <UserCheck className="w-4 h-4" />
                                                <span className="text-sm font-medium">Créé</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                                <KeyRound className="w-4 h-4" />
                                                <span className="text-sm font-medium">À créer</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link
                                            href={`/admin/teams/${team.id}/edit`}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                title="Modifier"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {!team.has_account && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleGenerateAccountClick(team)}
                                                title="Générer un compte équipe"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <KeyRound className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(team.id)}
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
                title="Supprimer l'équipe"
                description="Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
            />

            {/* Dialog for generating team account */}
            <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Générer un compte équipe</DialogTitle>
                        <DialogDescription>
                            Créez un compte pour permettre à l'équipe de se connecter et gérer sa composition.
                            {selectedTeam && (
                                <p className="mt-2 font-medium text-blue-600">
                                    Équipe : {selectedTeam.nom}
                                </p>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGenerateAccountSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone (identifiant de connexion) *</Label>
                                <Input
                                    id="telephone"
                                    type="tel"
                                    placeholder="+237 600 000 000"
                                    value={accountForm.telephone}
                                    onChange={(e) => setAccountForm({ ...accountForm, telephone: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Ce numéro servira d'identifiant pour la connexion
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email (optionnel)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="equipe@example.com"
                                    value={accountForm.email}
                                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={accountForm.password}
                                    onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                                <p className="text-xs text-gray-500">
                                    Minimum 6 caractères
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAccountDialogOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit">
                                <KeyRound className="w-4 h-4 mr-2" />
                                Générer le compte
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
