import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { Save, ArrowLeft, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Player {
    id: number;
    prenom: string;
    nom: string;
    numero: string;
    poste?: string;
}

interface Team {
    id: number;
    nom: string;
    players: Player[];
}

interface Composition {
    id: number;
    player_id: number;
    poste: string;
    titulaire: boolean;
    minutes?: number;
}

interface Match {
    id: number;
    team_1_id: number;
    team_2_id: number;
    team1: Team;
    team2: Team;
    date_match: string;
    compo_publique: boolean;
    compositions?: Composition[];
}

interface Props {
    match: Match;
}

export default function MatchComposition({ match }: Props) {
    const [compositions, setCompositions] = useState<
        (Composition & { player?: Player })[]
    >(match.compositions || []);
    const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2'>(
        'team1'
    );
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [selectedPoste, setSelectedPoste] = useState('');
    const [titulaire, setTitulaire] = useState(false);

    const currentTeam = selectedTeam === 'team1' ? match.team1 : match.team2;
    const { post, processing } = useForm();

    const addComposition = () => {
        if (selectedPlayer && selectedPoste) {
            const player = currentTeam.players.find(
                (p) => p.id.toString() === selectedPlayer
            );
            if (player) {
                const newCompo: Composition & { player?: Player } = {
                    id: Math.random(), // temporary
                    player_id: player.id,
                    poste: selectedPoste,
                    titulaire: titulaire,
                    player: player,
                };
                setCompositions([...compositions, newCompo]);
                setSelectedPlayer('');
                setSelectedPoste('');
                setTitulaire(false);
            }
        }
    };

    const removeComposition = (id: number | string) => {
        setCompositions(
            compositions.filter((c) => c.id !== id)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            match_id: match.id,
            compositions: compositions.map((c) => ({
                player_id: c.player_id,
                poste: c.poste,
                titulaire: c.titulaire,
                minutes: c.minutes,
            })),
        };
        post('/admin/matches/composition', { data });
    };

    return (
        <AdminLayout
            title="Composition du match"
            description={`${match.team1.nom} vs ${match.team2.nom}`}
        >
            <Head title="Match Composition" />

            <div className="max-w-4xl">
                <Link href={`/admin/matches/${match.id}/edit`}>
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(['team1', 'team2'] as const).map((teamKey) => {
                            const team =
                                teamKey === 'team1' ? match.team1 : match.team2;
                            const teamCompos = compositions.filter((c) => {
                                const player = team.players.find(
                                    (p) => p.id === c.player_id
                                );
                                return !!player;
                            });

                            return (
                                <div
                                    key={teamKey}
                                    className="border rounded-lg p-4"
                                >
                                    <h3 className="font-semibold mb-4">
                                        {team.nom}
                                    </h3>

                                    <div className="space-y-3 mb-4">
                                        {teamCompos.map((compo) => (
                                            <div
                                                key={compo.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {
                                                            team.players.find(
                                                                (p) =>
                                                                    p.id ===
                                                                    compo.player_id
                                                            )?.prenom
                                                        }{' '}
                                                        {
                                                            team.players.find(
                                                                (p) =>
                                                                    p.id ===
                                                                    compo.player_id
                                                            )?.nom
                                                        }
                                                        ({compo.poste})
                                                    </p>
                                                    {compo.titulaire && (
                                                        <p className="text-xs text-blue-600">
                                                            Titulaire
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeComposition(
                                                            compo.id
                                                        )
                                                    }
                                                >
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedTeam === teamKey && (
                                        <div className="border-t pt-4 space-y-3">
                                            <p className="text-sm font-medium">
                                                Ajouter un joueur
                                            </p>
                                            <div className="space-y-2">
                                                <Select
                                                    value={selectedPlayer}
                                                    onValueChange={
                                                        setSelectedPlayer
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un joueur" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {team.players
                                                            .filter(
                                                                (p) =>
                                                                    !teamCompos.find(
                                                                        (c) =>
                                                                            c.player_id ===
                                                                            p.id
                                                                    )
                                                            )
                                                            .map((player) => (
                                                                <SelectItem
                                                                    key={
                                                                        player.id
                                                                    }
                                                                    value={player.id.toString()}
                                                                >
                                                                    {
                                                                        player.prenom
                                                                    }{' '}
                                                                    {
                                                                        player.nom
                                                                    }
                                                                    (
                                                                    {
                                                                        player.numero
                                                                    }
                                                                    )
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={selectedPoste}
                                                    onValueChange={
                                                        setSelectedPoste
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un poste" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="gardien">
                                                            Gardien
                                                        </SelectItem>
                                                        <SelectItem value="defenseur">
                                                            Défenseur
                                                        </SelectItem>
                                                        <SelectItem value="milieu">
                                                            Milieu
                                                        </SelectItem>
                                                        <SelectItem value="attaquant">
                                                            Attaquant
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={titulaire}
                                                        onChange={(e) =>
                                                            setTitulaire(
                                                                e.target
                                                                    .checked
                                                            )
                                                        }
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">
                                                        Titulaire
                                                    </span>
                                                </label>

                                                <Button
                                                    type="button"
                                                    onClick={addComposition}
                                                    className="w-full"
                                                    disabled={
                                                        !selectedPlayer ||
                                                        !selectedPoste
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Ajouter
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTeam !== teamKey && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() =>
                                                setSelectedTeam(teamKey)
                                            }
                                        >
                                            Sélectionner cette équipe
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer la composition
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
