import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PointSystem {
    id: number;
    points_vote_equipe: number;
    points_homme_match: number;
    points_vainqueur_tournoi: number;
    description?: string;
}

interface Props {
    pointSystem: PointSystem;
}

export default function PointSystemIndex({ pointSystem }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        points_vote_equipe: pointSystem.points_vote_equipe,
        points_homme_match: pointSystem.points_homme_match,
        points_vainqueur_tournoi: pointSystem.points_vainqueur_tournoi,
        description: pointSystem.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/point-system/${pointSystem.id}`);
    };

    return (
        <AdminLayout
            title="Système de Points"
            description="Configure the point system for user votes"
        >
            <Head title="Point System" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            Définissez ici le nombre de points attribués pour
                            chaque type de vote correct.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="points_vote_equipe">
                            Points pour vote équipe correct
                        </Label>
                        <Input
                            id="points_vote_equipe"
                            type="number"
                            value={data.points_vote_equipe}
                            onChange={(e) =>
                                setData(
                                    'points_vote_equipe',
                                    parseInt(e.target.value)
                                )
                            }
                            min="0"
                            className={
                                errors.points_vote_equipe
                                    ? 'border-red-500'
                                    : ''
                            }
                        />
                        {errors.points_vote_equipe && (
                            <p className="text-sm text-red-500">
                                {errors.points_vote_equipe}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Points attribués quand un utilisateur vote pour la
                            bonne équipe gagnante
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="points_homme_match">
                            Points pour homme du match correct
                        </Label>
                        <Input
                            id="points_homme_match"
                            type="number"
                            value={data.points_homme_match}
                            onChange={(e) =>
                                setData(
                                    'points_homme_match',
                                    parseInt(e.target.value)
                                )
                            }
                            min="0"
                            className={
                                errors.points_homme_match ?
                                    'border-red-500'
                                    : ''
                            }
                        />
                        {errors.points_homme_match && (
                            <p className="text-sm text-red-500">
                                {errors.points_homme_match}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Points attribués quand un utilisateur vote pour le
                            bon homme du match
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="points_vainqueur_tournoi">
                            Points pour vainqueur du tournoi correct
                        </Label>
                        <Input
                            id="points_vainqueur_tournoi"
                            type="number"
                            value={data.points_vainqueur_tournoi}
                            onChange={(e) =>
                                setData(
                                    'points_vainqueur_tournoi',
                                    parseInt(e.target.value)
                                )
                            }
                            min="0"
                            className={
                                errors.points_vainqueur_tournoi
                                    ? 'border-red-500'
                                    : ''
                            }
                        />
                        {errors.points_vainqueur_tournoi && (
                            <p className="text-sm text-red-500">
                                {errors.points_vainqueur_tournoi}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Points attribués quand un utilisateur vote pour le
                            bon vainqueur du tournoi
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Description optionnelle du système"
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les paramètres
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
