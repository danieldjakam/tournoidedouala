import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-blue border-b border-primary-blue/50 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white transition-all bg-white">
              <img 
                src="https://horizons-cdn.hostinger.com/23c36ec2-f68d-4677-9abf-bf991573bfeb/edccfcbd0e00956b7f7f3cedf6f38e87.jpg" 
                alt="Logo Tournoi" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg md:text-xl font-bold leading-tight hidden xs:block">
              Tournoi de<br/><span className="text-gray-200 text-sm md:text-base font-normal">Douala 2026</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden md:block">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-primary-blue/50">
                    Tableau de bord
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    className="text-white hover:text-accent-red hover:bg-white/10 rounded-full"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-white text-primary-blue hover:bg-gray-100 font-semibold">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;