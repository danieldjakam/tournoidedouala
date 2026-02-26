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
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Match {
    id: number;
    team_1_id: number;
    team_2_id: number;
    date_match: string;
    lieu?: string;
    statut: string;
    score_team_1?: number;
    score_team_2?: number;
    compo_publique: boolean;
    notes?: string;
}

interface Props {
    match?: Match;
    teams: Array<{ id: number; nom: string }>;
}

export default function MatchForm({ match, teams }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        team_1_id: match?.team_1_id?.toString() ?? '',
        team_2_id: match?.team_2_id?.toString() ?? '',
        date_match: match?.date_match?.split('T')[0] ?? '',
        lieu: match?.lieu ?? '',
        statut: match?.statut ?? 'planifie',
        score_team_1: match?.score_team_1?.toString() ?? '',
        score_team_2: match?.score_team_2?.toString() ?? '',
        compo_publique: match?.compo_publique ?? false,
        notes: match?.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (match) {
            put(`/admin/matches/${match.id}`);
        } else {
            post('/admin/matches');
        }
    };

    return (
        <AdminLayout
            title={match ? 'Modifier le match' : 'Ajouter un match'}
        >
            <Head title={match ? 'Edit Match' : 'Create Match'} />

            <div className="max-w-2xl">
                <Link href="/admin/matches">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="team_1_id">Équipe 1</Label>
                            <Select
                                value={data.team_1_id}
                                onValueChange={(value) =>
                                    setData('team_1_id', value)
                                }
                            >
                                <SelectTrigger
                                    className={
                                        errors.team_1_id ?
                                            'border-red-500'
                                            : ''
                                    }
                                >
                                    <SelectValue placeholder="Sélectionner" />
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
                            {errors.team_1_id && (
                                <p className="text-sm text-red-500">
                                    {errors.team_1_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="team_2_id">Équipe 2</Label>
                            <Select
                                value={data.team_2_id}
                                onValueChange={(value) =>
                                    setData('team_2_id', value)
                                }
                            >
                                <SelectTrigger
                                    className={
                                        errors.team_2_id ?
                                            'border-red-500'
                                            : ''
                                    }
                                >
                                    <SelectValue placeholder="Sélectionner" />
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
                            {errors.team_2_id && (
                                <p className="text-sm text-red-500">
                                    {errors.team_2_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date_match">Date du match</Label>
                        <Input
                            id="date_match"
                            type="datetime-local"
                            value={data.date_match}
                            onChange={(e) =>
                                setData('date_match', e.target.value)
                            }
                            className={
                                errors.date_match ? 'border-red-500' : ''
                            }
                        />
                        {errors.date_match && (
                            <p className="text-sm text-red-500">
                                {errors.date_match}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="lieu">Lieu</Label>
                        <Input
                            id="lieu"
                            value={data.lieu}
                            onChange={(e) => setData('lieu', e.target.value)}
                            placeholder="Stade Parc des Princes"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="statut">Statut</Label>
                        <Select
                            value={data.statut}
                            onValueChange={(value) =>
                                setData('statut', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planifie">
                                    Planifié
                                </SelectItem>
                                <SelectItem value="en_cours">
                                    En cours
                                </SelectItem>
                                <SelectItem value="termine">Terminé</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {data.statut === 'termine' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="score_team_1">
                                    Score Équipe 1
                                </Label>
                                <Input
                                    id="score_team_1"
                                    type="number"
                                    value={data.score_team_1}
                                    onChange={(e) =>
                                        setData(
                                            'score_team_1',
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="score_team_2">
                                    Score Équipe 2
                                </Label>
                                <Input
                                    id="score_team_2"
                                    type="number"
                                    value={data.score_team_2}
                                    onChange={(e) =>
                                        setData(
                                            'score_team_2',
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Notes optionnelles"
                            rows={3}
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {match ? 'Mettre à jour' : 'Créer le match'}
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
