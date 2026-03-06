import type React from 'react';
import { Link, router } from '@inertiajs/react';
import { Trophy, Users, Calendar, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TeamLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

interface TeamUser {
    prenom: string;
    team?: {
        nom: string;
    };
}

interface TeamLayoutData {
    auth?: {
        user?: TeamUser | null;
    };
}

export default function TeamLayout({
    children,
    title,
    description,
}: TeamLayoutProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    // Get auth from props on mount to avoid re-renders
    const [auth, setAuth] = useState<TeamLayoutData['auth'] | null>(null);

    React.useEffect(() => {
        // Only set auth once on mount
        if (!auth) {
            setAuth((window as any).__INERTIA__?.props?.auth || null);
        }
    }, []); // Empty dependency array - only run once

    const handleLogout = () => {
        router.post('/team/logout');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
                {/* Sidebar */}
                <aside className={
                    `fixed lg:static top-0 left-0 h-screen w-64 bg-gray-900 dark:bg-gray-800 text-white flex flex-col border-r border-gray-700 transform transition-transform duration-300 z-50 lg:transform-none lg:z-auto ${
                        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`
                }>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg">Espace Équipe</h1>
                                    <p className="text-xs text-gray-400">Gestion d'équipe</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="lg:hidden p-1 hover:bg-gray-800 rounded"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            <Link
                                href="/team"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Matchs</span>
                            </Link>
                            <Link
                                href="/team/players"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Users className="w-5 h-5" />
                                <span>Joueurs</span>
                            </Link>
                            <Link
                                href="/team/rankings"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Trophy className="w-5 h-5" />
                                <span>Classements</span>
                            </Link>
                            <Link
                                href="/team/profile"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Profil</span>
                            </Link>
                        </nav>

                        {/* Bottom Actions */}
                        <div className="p-4 border-t border-gray-700 space-y-2">
                            {auth?.user && (
                                <div className="flex items-center gap-3 mb-4 px-4">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{auth.user.prenom}</p>
                                        <p className="text-xs text-gray-400 truncate">{auth.user.team?.nom}</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileOpen(false);
                                }}
                                variant="outline"
                                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                                size="sm"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {(title || description) && (
                        <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 bg-white dark:bg-gray-900">
                            {title && (
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                            )}
                            {description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950">{children}</div>
                </div>
            </div>
        </>
    );
}
