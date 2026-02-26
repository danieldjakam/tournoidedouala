import MatchCard from "@/components/MatchCard";
import * as matchService from "@/api/matchService";
import * as pronosticService from "@/api/pronosticService";

export default function MatchesSection({ matches, currentUser }) {
  return (
    <div className="space-y-6">

      {matches.length === 0 ? (
        <div className="bg-white p-10 rounded-lg text-center shadow-sm border">
          Aucun match disponible
        </div>
      ) : (
        <div className="grid gap-6">
          {matches.map((match) => {
            const isLocked =
              matchService.isMatchPronosticLocked(match);
            const score =
              matchService.getMatchScore(match.id);
            const userPronostic =
              pronosticService.getUserMatchPronostic(
                currentUser.id,
                match.id
              );

            return (
              <MatchCard
                key={match.id}
                match={match}
                isLocked={isLocked}
                score={score}
                userPronostic={userPronostic}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
