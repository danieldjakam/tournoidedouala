import React from 'react';
import { Trophy } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-blue border-t border-accent-red mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-6 h-6 text-white" />
            <span className="text-lg font-bold">Tournoi de Douala 2026</span>
          </div>
          
          <p className="text-gray-200 text-sm text-center">
            Douala, Cameroun - Timezone: Africa/Douala (UTC+1)
          </p>
          
          <p className="text-gray-300 text-xs">
            © 2026 Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;