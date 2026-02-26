import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DragDropComposition } from '@/components/DragDropComposition';
import {
    ArrowLeft,
    Save,
    Trash2,
    Plus,
    Users,
    MapPin,
    Calendar,
    Eye,
    EyeOff,
    Trophy,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero: string;
}

interface Team {
    id: number;
    nom: string;
    code: string;
    players: Player[];
}

interface PlayerMatch {
    id: number;
    player_id: number;
    poste: string;
    titulaire: boolean;
    minutes: number | null;
    player?: Player;
    x?: number;
    y?: number;
}

interface Match {
    id: number;
    team_1_id: number;
    team_2_id: number;
    date_match: string;
    lieu: string | null;
    statut: 'planifie' | 'en_cours' | 'termine';
    score_team_1: number | null;
    score_team_2: number | null;
    homme_du_match_id: string | null;
    compo_publique: boolean;
    notes: string | null;
    team1: Team;
    team2: Team;
    playerMatches: PlayerMatch[];
}

interface Props {
    match: Match;
    success?: string;
}

export default function MatchDetail({ match, success }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'compo' | 'resultat'>('info');
    const [compositions, setCompositions] = useState<PlayerMatch[]>(
        (match.playerMatches || []).map((pm) => ({
            ...pm,
            player: pm.player || undefined,
        }))
    );

    const team1Players = match.team1?.players || [];
    const team2Players = match.team2?.players || [];

    const { data, setData, put, post, processing, errors } = useForm({
        team_1_id: match.team_1_id.toString(),
        team_2_id: match.team_2_id.toString(),
        date_match: match.date_match.split('T')[0],
        time: match.date_match.split('T')[1]?.substring(0, 5) || '12:00',
        lieu: match.lieu ?? '',
        statut: match.statut,
        score_team_1: match.score_team_1?.toString() ?? '',
        score_team_2: match.score_team_2?.toString() ?? '',
        homme_du_match_id: match.homme_du_match_id ?? '',
        compo_publique: match.compo_publique,
        notes: match.notes ?? '',
    });

    const handleSaveMatch = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/matches/${match.id}`, {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const handleDeleteMatch = () => {
        router.delete(`/admin/matches/${match.id}`);
        setDeleteDialogOpen(false);
    };

    const handleSaveComposition = () => {
        // Mapper les compositions vers le format attendu par le backend
        const allCompositions = compositions.map((c) => ({
            player_id: c.player_id,
            poste: c.poste,
            titulaire: c.titulaire,
            minutes: c.minutes,
        }));
        
        post(`/admin/matches/${match.id}/composition`, {
            data: {
                compositions: allCompositions,
            },
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const handleToggleCompoPublique = () => {
        setData('compo_publique', !data.compo_publique);
    };

    return (
        <AdminLayout
            title="Détail du Match"
            description={`${match.team1.nom} vs ${match.team2.nom}`}
        >
            <Head title="Détail du Match" />

            {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
                </div>
            )}

            <div className="mb-6">
                <Link href="/admin/matches">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'info'
                            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Informations
                </button>
                <button
                    onClick={() => setActiveTab('compo')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'compo'
                            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Compositions
                </button>
                <button
                    onClick={() => setActiveTab('resultat')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'resultat'
                            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Résultat
                </button>
            </div>

            {/* Tab: Informations */}
            {activeTab === 'info' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du match</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveMatch} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="team1">Équipe 1</Label>
                                        <Select
                                            value={data.team_1_id}
                                            onValueChange={(v) => setData('team_1_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={match.team1.id.toString()}>
                                                    {match.team1.nom}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="team2">Équipe 2</Label>
                                        <Select
                                            value={data.team_2_id}
                                            onValueChange={(v) => setData('team_2_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={match.team2.id.toString()}>
                                                    {match.team2.nom}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date_match">Date</Label>
                                        <Input
                                            id="date_match"
                                            type="date"
                                            value={data.date_match}
                                            onChange={(e) => setData('date_match', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Heure</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={data.time}
                                            onChange={(e) => setData('time', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lieu">Lieu</Label>
                                    <Input
                                        id="lieu"
                                        value={data.lieu}
                                        onChange={(e) => setData('lieu', e.target.value)}
                                        placeholder="Stade..."
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="statut">Statut</Label>
                                    <Select
                                        value={data.statut}
                                        onValueChange={(v) => setData('statut', v as typeof data.statut)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="planifie">Planifié</SelectItem>
                                            <SelectItem value="en_cours">En cours</SelectItem>
                                            <SelectItem value="termine">Terminé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="compo_publique"
                                        checked={data.compo_publique}
                                        onChange={(e) => setData('compo_publique', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="compo_publique" className="cursor-pointer">
                                        Composition publique
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleToggleCompoPublique}
                                    >
                                        {data.compo_publique ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full min-h-[100px] p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                        placeholder="Notes optionnelles..."
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Enregistrer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => setDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tab: Compositions */}
            {activeTab === 'compo' && (
                <div className="space-y-6">
                    {/* Équipe 1 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-lg">{match.team1.nom}</span>
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                    Domicile
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DragDropComposition
                                teamId={match.team1.id}
                                teamName={match.team1.nom}
                                teamPlayers={team1Players}
                                initialCompositions={compositions.filter((c) =>
                                    team1Players.some((p) => p.id === c.player_id)
                                )}
                                teamColor="home"
                                onSave={(newCompositions) => {
                                    const otherTeamCompositions = compositions.filter((c) =>
                                        !team1Players.some((p) => p.id === c.player_id)
                                    );
                                    setCompositions([...otherTeamCompositions, ...newCompositions]);
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Équipe 2 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-lg">{match.team2.nom}</span>
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                    Extérieur
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DragDropComposition
                                teamId={match.team2.id}
                                teamName={match.team2.nom}
                                teamPlayers={team2Players}
                                initialCompositions={compositions.filter((c) =>
                                    team2Players.some((p) => p.id === c.player_id)
                                )}
                                teamColor="away"
                                onSave={(newCompositions) => {
                                    const otherTeamCompositions = compositions.filter((c) =>
                                        !team2Players.some((p) => p.id === c.player_id)
                                    );
                                    setCompositions([...otherTeamCompositions, ...newCompositions]);
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Button onClick={handleSaveComposition} disabled={processing} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les compositions des deux équipes
                    </Button>
                </div>
            )}

            {/* Tab: Résultat */}
            {activeTab === 'resultat' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Résultat du match</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveMatch} className="space-y-4">
                                <div className="flex items-center justify-center gap-4 py-6">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold mb-2">{match.team1.nom}</p>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={data.score_team_1}
                                            onChange={(e) => setData('score_team_1', e.target.value)}
                                            className="w-20 text-center text-2xl font-bold"
                                            placeholder="0"
                                        />
                                    </div>

                                    <span className="text-2xl font-bold text-gray-400">-</span>

                                    <div className="text-center">
                                        <p className="text-lg font-semibold mb-2">{match.team2.nom}</p>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={data.score_team_2}
                                            onChange={(e) => setData('score_team_2', e.target.value)}
                                            className="w-20 text-center text-2xl font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="homme_du_match">Homme du match</Label>
                                    <Select
                                        value={data.homme_du_match_id}
                                        onValueChange={(v) => setData('homme_du_match_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un joueur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(match.statut === 'termine' ? [...team1Players, ...team2Players] : []).map((player) => (
                                                <SelectItem key={player.id} value={player.id.toString()}>
                                                    {player.prenom} {player.nom} ({player.numero})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.homme_du_match_id && (
                                        <p className="text-sm text-red-500">{errors.homme_du_match_id}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Enregistrer le résultat
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteMatch}
                title="Supprimer le match"
                description="Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </AdminLayout>
    );
}
