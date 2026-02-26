import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardSection({ currentUser }) {
  return (
    <div>
      <Leaderboard currentUserId={currentUser.id} />
    </div>
  );
}
