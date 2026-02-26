import PlayerForm from './PlayerForm';

interface Team {
    id: number;
    nom: string;
}

interface Props {
    teams: Team[];
}

export default function PlayerCreate({ teams }: Props) {
    return <PlayerForm teams={teams} />;
}
