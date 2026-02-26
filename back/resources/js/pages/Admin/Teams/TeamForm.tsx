import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface TeamFormProps {
    team?: {
        id: number;
        nom: string;
        code: string;
        logo?: string | null;
        description?: string | null;
        priorite: number;
    };
}

export default function TeamForm({ team }: TeamFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: team?.nom ?? '',
        code: team?.code ?? '',
        logo: team?.logo ?? '',
        description: team?.description ?? '',
        priorite: (team?.priorite ?? 0).toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (team) {
            put(`/admin/teams/${team.id}`);
        } else {
            post('/admin/teams');
        }
    };

    return (
        <AdminLayout
            title={team ? 'Modifier l\'équipe' : 'Ajouter une équipe'}
            description={team ? 'Modifier les informations de l\'équipe' : 'Créer une nouvelle équipe'}
        >
            <Head title={team ? 'Modifier l\'équipe' : 'Nouvelle équipe'} />

            <div className="max-w-2xl">
                <Link href="/admin/teams">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo Upload */}
                    <div className="grid gap-2">
                        <Label>Logo</Label>
                        <div className="flex items-center gap-4">
                            {data.logo ? (
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img
                                        src={data.logo}
                                        alt="Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-400">
                                        {data.nom ? data.nom.charAt(0).toUpperCase() : '?'}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <Input
                                    type="url"
                                    value={data.logo}
                                    onChange={(e) => setData('logo', e.target.value)}
                                    placeholder="https://exemple.com/logo.png"
                                    className={errors.logo ? 'border-red-500' : ''}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    URL de l'image du logo (optionnel)
                                </p>
                            </div>
                        </div>
                        {errors.logo && (
                            <p className="text-sm text-red-500">{errors.logo}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="nom">Nom de l'équipe</Label>
                        <Input
                            id="nom"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            placeholder="ex: Paris Saint-Germain"
                            className={errors.nom ? 'border-red-500' : ''}
                        />
                        {errors.nom && (
                            <p className="text-sm text-red-500">{errors.nom}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="ex: PSG"
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">
                            Code court pour identifier l'équipe (max 10 caractères)
                        </p>
                        {errors.code && (
                            <p className="text-sm text-red-500">{errors.code}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="priorite">Priorité</Label>
                        <Input
                            id="priorite"
                            type="number"
                            value={data.priorite}
                            onChange={(e) => setData('priorite', e.target.value)}
                            min="0"
                            max="10"
                            className={errors.priorite ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">
                            De 0 (moins prioritaire) à 10 (plus prioritaire)
                        </p>
                        {errors.priorite && (
                            <p className="text-sm text-red-500">{errors.priorite}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Description optionnelle de l'équipe"
                            rows={4}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {team ? 'Mettre à jour' : 'Créer l\'équipe'}
                        </Button>
                        <Link href="/admin/teams">
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
