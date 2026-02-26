export default function UpcomingMatch({ team1, time, team2, day }) {
  return (
    <div className="bg-white p-4 rounded-2xl mb-3 flex justify-between border-2 border-[rgb(2,62,120)]">
      <div>
        <p className="font-semibold">{team1}</p>
        <p className="text-sm text-[rgb(2,62,120)] mt-1">
          {day} - {time}
        </p>
      </div>
      <p className="font-semibold">{team2}</p>
    </div>
  );
}
