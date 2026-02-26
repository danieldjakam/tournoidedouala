import { Bell, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <header className="bg-white border-b p-6 flex justify-between items-center">
      
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Bienvenue Champion 👋
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Bell className="text-gray-600 cursor-pointer" />
        <Settings className="text-gray-600 cursor-pointer" />
        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
          C
        </div>
      </div>
    </header>
  );
}
