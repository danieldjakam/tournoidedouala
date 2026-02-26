export default function DashboardHeader({ currentUser }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold">
        Bonjour,{" "}
        <span className="text-primary-blue">
          {currentUser.firstname}
        </span>{" "}
        👋
      </h1>
      <p className="text-gray-500 mt-2">
        Gérez vos pronostics et suivez votre progression
      </p>
    </div>
  );
}
