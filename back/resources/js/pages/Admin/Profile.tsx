import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Save, Lock, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface User {
    id: number;
    prenom: string;
    nom: string;
    email: string;
}

interface Props {
    user: User;
}

export default function ProfilePage({ user }: Props) {
    const { appearance, setAppearance } = useTheme();
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const profileForm = useForm({
        prenom: user.prenom,
        nom: user.nom,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(`/admin/profile/update`, {
            onSuccess: () => {
                profileForm.reset();
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(`/admin/profile/password`, {
            onSuccess: () => {
                passwordForm.reset();
                setShowPasswordForm(false);
            },
        });
    };

    const themeOptions = [
        { value: 'light', label: 'Clair', icon: Sun },
        { value: 'dark', label: 'Sombre', icon: Moon },
        { value: 'system', label: 'Système', icon: Monitor },
    ] as const;

    return (
        <AdminLayout title="Mon Profil" description="Gérez vos informations personnelles">
            <Head title="Profil" />

            <div className="max-w-2xl">
                {/* Theme Section */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-6">Apparence</h2>
                    
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choisissez le thème de l'application
                        </p>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {themeOptions.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => setAppearance(value)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                        appearance === value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 ${
                                        appearance === value
                                            ? 'text-blue-500'
                                            : 'text-gray-500'
                                    }`} />
                                    <span className={`text-sm font-medium ${
                                        appearance === value
                                            ? 'text-blue-700 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-6">Informations Personnelles</h2>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="prenom">Prénom</Label>
                                <Input
                                    id="prenom"
                                    value={profileForm.data.prenom}
                                    onChange={(e) =>
                                        profileForm.setData('prenom', e.target.value)
                                    }
                                    className={profileForm.errors.prenom ? 'border-red-500' : ''}
                                />
                                {profileForm.errors.prenom && (
                                    <p className="text-sm text-red-500">
                                        {profileForm.errors.prenom}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nom">Nom</Label>
                                <Input
                                    id="nom"
                                    value={profileForm.data.nom}
                                    onChange={(e) =>
                                        profileForm.setData('nom', e.target.value)
                                    }
                                    className={profileForm.errors.nom ? 'border-red-500' : ''}
                                />
                                {profileForm.errors.nom && (
                                    <p className="text-sm text-red-500">
                                        {profileForm.errors.nom}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input
                                value={user.email}
                                disabled
                                className="bg-gray-100 dark:bg-gray-800"
                            />
                            <p className="text-xs text-gray-500">
                                L'email ne peut pas être modifié
                            </p>
                        </div>

                        <Button type="submit" disabled={profileForm.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les modifications
                        </Button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-6">Sécurité</h2>

                    {!showPasswordForm ? (
                        <Button
                            variant="outline"
                            onClick={() => setShowPasswordForm(true)}
                        >
                            <Lock className="mr-2 h-4 w-4" />
                            Changer le mot de passe
                        </Button>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    Mot de passe actuel
                                </Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            'current_password',
                                            e.target.value
                                        )
                                    }
                                    className={
                                        passwordForm.errors.current_password
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.errors.current_password}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Nouveau mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) =>
                                        passwordForm.setData('password', e.target.value)
                                    }
                                    className={
                                        passwordForm.errors.password
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmer le mot de passe
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            'password_confirmation',
                                            e.target.value
                                        )
                                    }
                                    className={
                                        passwordForm.errors.password_confirmation
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {passwordForm.errors.password_confirmation && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Changer le mot de passe
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        passwordForm.reset();
                                    }}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
