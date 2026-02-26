import PlayerForm from './PlayerForm';

interface Player {
    id: number;
    team_id: number;
    prenom: string;
    nom: string;
    numero: string;
    date_naissance?: string;
    nationalite?: string;
    bio?: string;
    team?: {
        id: number;
        nom: string;
    };
}

interface Team {
    id: number;
    nom: string;
}

interface Props {
    player: Player;
    teams: Team[];
}

export default function PlayerEdit({ player, teams }: Props) {
    return <PlayerForm player={player} teams={teams} />;
}
