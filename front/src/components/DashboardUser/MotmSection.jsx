import VotingSection from "@/components/VotingSection";
import * as matchService from "@/api/matchService";

export default function MotmSection({
  matches,
  currentUser,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="w-1 h-8 bg-yellow-400 rounded-full"></span>
        Vote meilleur joueur
      </h2>

      {matches.map((match) => {
        const votingStatus =
          matchService.getMotmVotingStatus(match);

        if (new Date() < new Date(votingStatus.opensAt))
          return null;

        return (
          <VotingSection
            key={match.id}
            match={match}
            userId={currentUser.id}
          />
        );
      })}
    </div>
  );
}
