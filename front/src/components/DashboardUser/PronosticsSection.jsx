import MatchCard from "@/components/MatchCard";
import PronosticForm from "@/components/PronosticForm";
import { Trophy } from "lucide-react";
import * as matchService from "@/api/matchService";

export default function PronosticsSection({
  matches,
  currentUser,
  teams,
  tournamentPronostic,
  isTournamentLocked,
  handleTournamentPronostic,
  loadData,
}) {
  return (
    <div className="lg:space-y-10">

      {/* PRONOSTICS MATCHS */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-primary-blue rounded-full"></span>
          Pronostics de matchs
        </h2>

        <div className="grid gap-8">
          {matches.map((match) => {
            const isLocked =
              matchService.isMatchPronosticLocked(match);
            const score =
              matchService.getMatchScore(match.id);

            return (
              <div
                key={match.id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >
                <MatchCard
                  match={match}
                  isLocked={isLocked}
                  score={score}
                />

                {!score && (
                  <div className="mt-6 pt-6 border-t">
                    <PronosticForm
                      match={match}
                      userId={currentUser.id}
                      isLocked={isLocked}
                      onPronosticSubmit={loadData}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* VAINQUEUR TOURNOI */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-accent-red rounded-full"></span>
          Vainqueur du tournoi
        </h2>

        {isTournamentLocked ? (
          <div className="text-center py-10">
            <Trophy className="mx-auto mb-4 text-gray-400" size={40} />
            Pronostics verrouillés
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() =>
                  handleTournamentPronostic(team.id)
                }
                className={`p-4 rounded-xl border transition ${
                  tournamentPronostic?.team_id === team.id
                    ? "border-primary-blue bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <img
                  src={team.logo_url}
                  alt={team.name}
                  className="w-16 h-16 mx-auto object-contain"
                />
                <p className="mt-2 text-sm font-semibold text-center">
                  {team.name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
