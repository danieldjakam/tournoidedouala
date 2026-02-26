import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Save, ArrowLeft, User } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PlayerFormProps {
    player?: {
        id: number;
        team_id: number;
        prenom: string;
        nom: string;
        numero?: string;
        date_naissance?: string;
        nationalite?: string;
        bio?: string;
        team?: {
            id: number;
            nom: string;
        };
    };
    teams: Array<{ id: number; nom: string }>;
}

export default function PlayerForm({ player, teams }: PlayerFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        team_id: player?.team_id?.toString() ?? (teams.length === 1 ? teams[0].id.toString() : ''),
        prenom: player?.prenom ?? '',
        nom: player?.nom ?? '',
        numero: player?.numero ?? '',
        date_naissance: player?.date_naissance ?? '',
        nationalite: player?.nationalite ?? '',
        bio: player?.bio ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (player) {
            put(`/admin/players/${player.id}`);
        } else {
            post('/admin/players');
        }
    };

    return (
        <AdminLayout
            title={player ? 'Modifier un joueur' : 'Ajouter un joueur'}
            description={player ? 'Modifier les informations du joueur' : 'Créer un nouveau joueur'}
        >
            <Head title={player ? 'Modifier le joueur' : 'Nouveau joueur'} />

            <div className="max-w-2xl">
                <Link href="/admin/players">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar placeholder */}
                    <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {player ? `${player.prenom} ${player.nom}` : 'Nouveau joueur'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {player?.team?.nom ?? 'Aucune équipe'}
                            </p>
                        </div>
                    </div>

                    {/* Équipe */}
                    <div className="grid gap-2">
                        <Label htmlFor="team_id">Équipe *</Label>
                        <Select
                            value={data.team_id}
                            onValueChange={(value) =>
                                setData('team_id', value)
                            }
                        >
                            <SelectTrigger
                                className={errors.team_id ? 'border-red-500' : ''}
                            >
                                <SelectValue placeholder="Sélectionner une équipe" />
                            </SelectTrigger>
                            <SelectContent>
                                {teams.map((team) => (
                                    <SelectItem
                                        key={team.id}
                                        value={team.id.toString()}
                                    >
                                        {team.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.team_id && (
                            <p className="text-sm text-red-500">{errors.team_id}</p>
                        )}
                    </div>

                    {/* Prénom et Nom */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="prenom">Prénom *</Label>
                            <Input
                                id="prenom"
                                value={data.prenom}
                                onChange={(e) =>
                                    setData('prenom', e.target.value)
                                }
                                placeholder="Jean"
                                className={errors.prenom ? 'border-red-500' : ''}
                            />
                            {errors.prenom && (
                                <p className="text-sm text-red-500">{errors.prenom}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nom">Nom *</Label>
                            <Input
                                id="nom"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                placeholder="Dupont"
                                className={errors.nom ? 'border-red-500' : ''}
                            />
                            {errors.nom && (
                                <p className="text-sm text-red-500">{errors.nom}</p>
                            )}
                        </div>
                    </div>

                    {/* Numéro et Date de naissance */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="numero">Numéro du joueur</Label>
                            <Input
                                id="numero"
                                type="number"
                                value={data.numero}
                                onChange={(e) =>
                                    setData('numero', e.target.value)
                                }
                                min="1"
                                max="99"
                                placeholder="10"
                                className={errors.numero ? 'border-red-500' : ''}
                            />
                            <p className="text-xs text-gray-500">
                                Numéro du maillot (1-99)
                            </p>
                            {errors.numero && (
                                <p className="text-sm text-red-500">{errors.numero}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_naissance">Date de naissance</Label>
                            <Input
                                id="date_naissance"
                                type="date"
                                value={data.date_naissance}
                                onChange={(e) =>
                                    setData('date_naissance', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Nationalité */}
                    <div className="grid gap-2">
                        <Label htmlFor="nationalite">Nationalité</Label>
                        <Input
                            id="nationalite"
                            value={data.nationalite}
                            onChange={(e) =>
                                setData('nationalite', e.target.value)
                            }
                            placeholder="France"
                        />
                    </div>

                    {/* Biographie */}
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder="Informations complémentaires sur le joueur..."
                            rows={4}
                        />
                        <p className="text-xs text-gray-500">
                            Description optionnelle du joueur
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {player ? 'Mettre à jour' : 'Créer le joueur'}
                        </Button>
                        <Link href="/admin/players">
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
