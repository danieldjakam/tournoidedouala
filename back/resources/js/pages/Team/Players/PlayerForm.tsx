import { Head, useForm, router } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero: number | null;
    date_naissance: string | null;
    nationalite: string | null;
    bio: string | null;
}

interface Props {
    team: {
        id: number;
        nom: string;
        code: string;
    };
    player?: Player;
}

export default function PlayerForm({ team, player }: Props) {
    const isEdit = !!player;

    const { data, setData, post, processing, errors } = useForm({
        prenom: player?.prenom || '',
        nom: player?.nom || '',
        numero: player?.numero?.toString() || '',
        date_naissance: player?.date_naissance || '',
        nationalite: player?.nationalite || '',
        bio: player?.bio || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = isEdit ? `/team/players/${player.id}` : '/team/players';
        const method = isEdit ? 'put' : 'post';

        if (method === 'put') {
            router.put(url, data);
        } else {
            post(url, data);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Modifier le joueur' : 'Ajouter un joueur'} />
            <TeamLayout
                title={isEdit ? 'Modifier le joueur' : 'Nouveau joueur'}
                description={isEdit ? 'Modifiez les informations du joueur' : 'Ajoutez un nouveau joueur à votre effectif'}
            >
                <Card className="max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prenom">Prénom</Label>
                                    <Input
                                        id="prenom"
                                        value={data.prenom}
                                        onChange={(e) => setData('prenom', e.target.value)}
                                        disabled={processing}
                                        placeholder="Ex: Jean"
                                    />
                                    {errors.prenom && (
                                        <p className="text-sm text-red-500">{errors.prenom}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom</Label>
                                    <Input
                                        id="nom"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        disabled={processing}
                                        placeholder="Ex: Dupont"
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-500">{errors.nom}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="numero">Numéro (optionnel)</Label>
                                    <Input
                                        id="numero"
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={data.numero}
                                        onChange={(e) => setData('numero', e.target.value)}
                                        disabled={processing}
                                        placeholder="Ex: 10"
                                    />
                                    {errors.numero && (
                                        <p className="text-sm text-red-500">{errors.numero}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationalite">Nationalité (optionnel)</Label>
                                    <Input
                                        id="nationalite"
                                        value={data.nationalite}
                                        onChange={(e) => setData('nationalite', e.target.value)}
                                        disabled={processing}
                                        placeholder="Ex: Cameroun"
                                    />
                                    {errors.nationalite && (
                                        <p className="text-sm text-red-500">{errors.nationalite}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_naissance">Date de naissance (optionnel)</Label>
                                <Input
                                    id="date_naissance"
                                    type="date"
                                    value={data.date_naissance}
                                    onChange={(e) => setData('date_naissance', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.date_naissance && (
                                    <p className="text-sm text-red-500">{errors.date_naissance}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio (optionnel)</Label>
                                <textarea
                                    id="bio"
                                    rows={4}
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    disabled={processing}
                                    placeholder="Courte description du joueur..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.bio && (
                                    <p className="text-sm text-red-500">{errors.bio}</p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Ajouter')} le joueur
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={processing}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </TeamLayout>
        </>
    );
}
