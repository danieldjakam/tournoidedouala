import { Head, Link, router } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Shirt } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useState } from 'react';

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero: number | null;
    date_naissance: string | null;
    nationalite: string | null;
}

interface Props {
    team: {
        id: number;
        nom: string;
        code: string;
    };
    players: Player[];
    success?: string;
    error?: string;
}

export default function Index({ team, players, success, error }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setPlayerToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (playerToDelete) {
            router.delete(`/team/players/${playerToDelete}`);
        }
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <Head title="Joueurs" />
            <TeamLayout title="Gestion des joueurs" description="Gérez l'effectif de votre équipe">
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

                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        {players.length} joueur{players.length > 1 ? 's' : ''} dans l'effectif
                    </p>
                    <Link href="/team/players/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un joueur
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun joueur dans l'effectif</p>
                            <p className="text-sm text-gray-400 mt-1">Commencez par ajouter des joueurs à votre équipe</p>
                        </div>
                    ) : (
                        players.map((player) => (
                            <div
                                key={player.id}
                                className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {player.numero || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {player.prenom} {player.nom}
                                            </h3>
                                            {player.nationalite && (
                                                <p className="text-sm text-gray-500">{player.nationalite}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/team/players/${player.id}/edit`}
                                        className="flex-1"
                                    >
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteClick(player.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
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
            </TeamLayout>
        </>
    );
}
