import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Trophy, Users, Zap, BarChart3, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

export function AdminSidebar() {
    const { url } = usePage();
    const { theme, toggleTheme } = useTheme();

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

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 text-gray-900 dark:text-white min-h-screen flex flex-col border-r border-gray-200 dark:border-slate-700">
            <div className="border-b border-gray-200 dark:border-slate-700 p-4">
                <h2 className="text-xl font-bold">Admin</h2>
            </div>
            <nav className="flex-1 p-4">
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
                <form method="POST" action="/logout">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        <span>Déconnexion</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
