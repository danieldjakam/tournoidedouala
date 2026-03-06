import { Head, useForm } from '@inertiajs/react';
import TeamLayout from '@/layouts/team-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Props {
    team: {
        id: number;
        nom: string;
        code: string;
        logo_url: string;
        description: string | null;
    };
    user: {
        id: number;
        email: string | null;
        telephone: string;
    };
}

export default function Profile({ team, user }: Props) {
    const teamForm = useForm({
        nom: team.nom,
        code: team.code,
        description: team.description || '',
        logo: null as File | null,
        logo_url: '',
    });

    const credentialsForm = useForm({
        email: user.email || '',
        telephone: user.telephone,
        password: '',
        password_confirmation: '',
    });

    const handleTeamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        teamForm.post('/team/profile/update', {
            ...teamForm.data,
            _method: 'PUT',
        } as any);
    };

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        credentialsForm.post('/team/profile/credentials', {
            ...credentialsForm.data,
            _method: 'PUT',
        } as any);
    };

    return (
        <>
            <Head title="Profil" />
            <TeamLayout title="Profil" description="Gérez les informations de votre équipe et compte">
                <Tabs defaultValue="team" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="team">Équipe</TabsTrigger>
                        <TabsTrigger value="account">Compte</TabsTrigger>
                    </TabsList>

                    <TabsContent value="team">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de l'équipe</CardTitle>
                                <CardDescription>
                                    Modifiez les informations de votre équipe
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleTeamSubmit}>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={team.logo_url}
                                            alt={team.nom}
                                            className="w-20 h-20 rounded-full object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor="logo">Logo de l'équipe</Label>
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    teamForm.setData('logo', e.target.files?.[0] || null)
                                                }
                                            />
                                            {teamForm.errors.logo && (
                                                <p className="text-sm text-red-500">{teamForm.errors.logo}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nom">Nom de l'équipe</Label>
                                            <Input
                                                id="nom"
                                                value={teamForm.data.nom}
                                                onChange={(e) =>
                                                    teamForm.setData('nom', e.target.value)
                                                }
                                            />
                                            {teamForm.errors.nom && (
                                                <p className="text-sm text-red-500">{teamForm.errors.nom}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Code équipe</Label>
                                            <Input
                                                id="code"
                                                value={teamForm.data.code}
                                                onChange={(e) =>
                                                    teamForm.setData('code', e.target.value)
                                                }
                                                placeholder="EX: PSG"
                                            />
                                            {teamForm.errors.code && (
                                                <p className="text-sm text-red-500">{teamForm.errors.code}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={teamForm.data.description}
                                            onChange={(e) =>
                                                teamForm.setData('description', e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {teamForm.errors.description && (
                                            <p className="text-sm text-red-500">{teamForm.errors.description}</p>
                                        )}
                                    </div>

                                    <Button type="submit" disabled={teamForm.processing}>
                                        {teamForm.processing ? 'Enregistrement...' : 'Mettre à jour'}
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Identifiants de connexion</CardTitle>
                                <CardDescription>
                                    Modifiez les informations de connexion de votre compte
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleCredentialsSubmit}>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email (optionnel)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={credentialsForm.data.email}
                                                onChange={(e) =>
                                                    credentialsForm.setData('email', e.target.value)
                                                }
                                            />
                                            {credentialsForm.errors.email && (
                                                <p className="text-sm text-red-500">{credentialsForm.errors.email}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telephone">Téléphone</Label>
                                            <Input
                                                id="telephone"
                                                value={credentialsForm.data.telephone}
                                                onChange={(e) =>
                                                    credentialsForm.setData('telephone', e.target.value)
                                                }
                                            />
                                            {credentialsForm.errors.telephone && (
                                                <p className="text-sm text-red-500">{credentialsForm.errors.telephone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Nouveau mot de passe (optionnel)
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={credentialsForm.data.password}
                                                onChange={(e) =>
                                                    credentialsForm.setData('password', e.target.value)
                                                }
                                            />
                                            {credentialsForm.errors.password && (
                                                <p className="text-sm text-red-500">{credentialsForm.errors.password}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirmer le mot de passe
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={credentialsForm.data.password_confirmation}
                                                onChange={(e) =>
                                                    credentialsForm.setData('password_confirmation', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={credentialsForm.processing}>
                                        {credentialsForm.processing ? 'Enregistrement...' : 'Mettre à jour'}
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </TeamLayout>
        </>
    );
}
