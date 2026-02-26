import TeamForm from './TeamForm';

interface Team {
    id: number;
    nom: string;
    code: string;
    logo?: string | null;
    description?: string | null;
    priorite: number;
}

interface Props {
    team: Team;
}

export default function TeamEdit({ team }: Props) {
    return <TeamForm team={team} />;
}
