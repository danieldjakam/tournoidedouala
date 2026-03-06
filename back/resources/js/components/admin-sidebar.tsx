import { Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, Trophy, Users, Zap, BarChart3, Settings, Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';

export function AdminSidebar() {
    const { url } = usePage();
    const { theme, toggleTheme } = useTheme();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (path: string) => url === path || url.startsWith(path + '/');

    const menuItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
        },
        {
            label: 'Équipes',
            icon: Trophy,
            href: '/admin/teams',
        },
        {
            label: 'Joueurs',
            icon: Users,
            href: '/admin/players',
        },
        {
            label: 'Matchs',
            icon: Zap,
            href: '/admin/matches',
        },
        {
            label: 'Classements',
            icon: BarChart3,
            href: '/admin/rankings',
        },
        {
            label: 'Système de Points',
            icon: Settings,
            href: '/admin/point-system',
        },
    ];

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout', {}, {
            onSuccess: () => {
                window.location.href = '/login';
            }
        });
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-slate-700"
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

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 z-50 lg:transform-none lg:z-auto",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Admin</h2>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4">Menu</p>
                            <ul className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                                                    active
                                                        ? 'bg-blue-100 dark:bg-blue-600 text-blue-900 dark:text-white'
                                                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                )}
                                            >
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </nav>

                    {/* Bottom Actions */}
                    <div className="border-t border-gray-200 dark:border-slate-700 p-4 space-y-2">
                        <Link href="/admin/profile">
                            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                                <Settings className="h-5 w-5 flex-shrink-0" />
                                <span>Mon Profil</span>
                            </button>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                        >
                            {theme === 'light' ? (
                                <>
                                    <Moon className="h-5 w-5 flex-shrink-0" />
                                    <span>Mode Sombre</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="h-5 w-5 flex-shrink-0" />
                                    <span>Mode Clair</span>
                                </>
                            )}
                        </button>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleLogout(e);
                        }}>
                            <button
                                type="submit"
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                            >
                                <LogOut className="h-5 w-5 flex-shrink-0" />
                                <span>Déconnexion</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}
