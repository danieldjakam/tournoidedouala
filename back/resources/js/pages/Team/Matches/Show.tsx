import { Head, useForm } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Shirt } from 'lucide-react';

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero: number | null;
}

interface MatchPlayer {
    id: number;
    player_id: number;
    poste: string;
    titulaire: boolean;
    minutes: number | null;
    player: Player;
}

interface Match {
    id: number;
    team_1_id: number;
    team_2_id: number;
    date_match: string;
    lieu: string;
    statut: string;
    score_team_1: number | null;
    score_team_2: number | null;
    compo_publique: boolean;
    team1: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
    };
    team2: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
    };
    players: MatchPlayer[];
}

interface Props {
    match: Match;
    team: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
    };
    isTeam1: boolean;
    players: Player[];
}

const POSTES = [
    { value: 'GK', label: 'Gardien (GK)' },
    { value: 'CB', label: 'Défenseur Central (CB)' },
    { value: 'LB', label: 'Arrière Gauche (LB)' },
    { value: 'RB', label: 'Arrière Droit (RB)' },
    { value: 'CDM', label: 'Milieu Défensif (CDM)' },
    { value: 'CM', label: 'Milieu Central (CM)' },
    { value: 'CAM', label: 'Milieu Offensif (CAM)' },
    { value: 'LW', label: 'Ailier Gauche (LW)' },
    { value: 'RW', label: 'Ailier Droit (RW)' },
    { value: 'ST', label: 'Buteur (ST)' },
];

export default function Show({ match, team, isTeam1, players }: Props) {
    const composition = useForm({
        players: match.players.map((p) => ({
            player_id: p.player_id,
            poste: p.poste,
            titulaire: p.titulaire,
            minutes: p.minutes || 90,
        })),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        composition.post(`/team/matches/${match.id}/composition`);
    };

    const updatePlayerPosition = (playerId: number, poste: string) => {
        const updated = composition.data.players.map((p) =>
            p.player_id === playerId ? { ...p, poste } : p
        );
        composition.setData('players', updated as any);
    };

    const toggleTitulaire = (playerId: number) => {
        const updated = composition.data.players.map((p) =>
            p.player_id === playerId ? { ...p, titulaire: !p.titulaire } : p
        );
        composition.setData('players', updated as any);
    };

    const removePlayer = (playerId: number) => {
        const updated = composition.data.players.filter((p) => p.player_id !== playerId);
        composition.setData('players', updated as any);
    };

    const addPlayer = (playerId: number) => {
        const player = players.find((p) => p.id === parseInt(playerId.toString()));
        if (!player) return;

        const exists = composition.data.players.find((p) => p.player_id === parseInt(playerId.toString()));
        if (exists) return;

        composition.setData('players', [
            ...composition.data.players,
            {
                player_id: parseInt(playerId.toString()),
                poste: 'CM',
                titulaire: false,
                minutes: 90,
            },
        ] as any);
    };

    const titulaireCount = composition.data.players.filter((p) => p.titulaire).length;

    return (
        <>
            <Head title="Détail du match" />
            <TeamLayout title="Composition d'équipe" description="Définissez votre composition pour ce match">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Match info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du match</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={isTeam1 ? match.team2.logo_url : match.team1.logo_url}
                                            alt={isTeam1 ? match.team2.nom : match.team1.nom}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {team.nom} vs {isTeam1 ? match.team2.nom : match.team1.nom}
                                            </h3>
                                            <p className="text-gray-500">{match.lieu}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={
                                                match.statut === 'planifie'
                                                    ? 'default'
                                                    : match.statut === 'en_cours'
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                        >
                                            {match.statut === 'planifie'
                                                ? 'À venir'
                                                : match.statut === 'en_cours'
                                                ? 'En cours'
                                                : 'Terminé'}
                                        </Badge>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {format(new Date(match.date_match), 'dd MMM yyyy HH:mm', { locale: fr })}
                                        </p>
                                    </div>
                                </div>

                                {match.statut === 'termine' && (
                                    <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-3xl font-bold">
                                            {match.score_team_1} - {match.score_team_2}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Composition</CardTitle>
                                <CardDescription>
                                    {titulaireCount}/11 titulaires sélectionnés
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {composition.data.players.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Shirt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Aucun joueur sélectionné</p>
                                        <p className="text-sm">Ajoutez des joueurs depuis la liste</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {composition.data.players.map((playerData) => {
                                            const player = players.find(
                                                (p) => p.id === playerData.player_id
                                            );
                                            if (!player) return null;

                                            return (
                                                <div
                                                    key={playerData.player_id}
                                                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                >
                                                    <Checkbox
                                                        checked={playerData.titulaire}
                                                        onCheckedChange={() => toggleTitulaire(playerData.player_id)}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {player.prenom} {player.nom}
                                                            {player.numero && ` (${player.numero})`}
                                                        </p>
                                                    </div>
                                                    <Select
                                                        value={playerData.poste}
                                                        onValueChange={(value) =>
                                                            updatePlayerPosition(playerData.player_id, value)
                                                        }
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {POSTES.map((poste) => (
                                                                <SelectItem key={poste.value} value={poste.value}>
                                                                    {poste.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removePlayer(playerData.player_id)}
                                                    >
                                                        Retirer
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Players list */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Effectif</CardTitle>
                                <CardDescription>
                                    {players.length} joueurs disponibles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {players.map((player) => {
                                        const isInComposition = composition.data.players.find(
                                            (p) => p.player_id === player.id
                                        );

                                        return (
                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {player.prenom} {player.nom}
                                                    </p>
                                                    {player.numero && (
                                                        <p className="text-xs text-gray-500">N°{player.numero}</p>
                                                    )}
                                                </div>
                                                {!isInComposition ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addPlayer(player.id)}
                                                    >
                                                        Ajouter
                                                    </Button>
                                                ) : (
                                                    <Badge variant="secondary">Sélectionné</Badge>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={composition.processing || titulaireCount !== 11}
                                    >
                                        {composition.processing
                                            ? 'Enregistrement...'
                                            : titulaireCount !== 11
                                            ? `Sélectionnez 11 titulaires (${titulaireCount})`
                                            : 'Enregistrer la composition'}
                                    </Button>
                                    {titulaireCount !== 11 && (
                                        <p className="text-xs text-center text-gray-500 mt-2">
                                            Vous devez sélectionner exactement 11 titulaires
                                        </p>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TeamLayout>
        </>
    );
}
