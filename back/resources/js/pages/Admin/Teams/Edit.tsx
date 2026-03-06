import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/layouts/admin-layout';
import { Save, ArrowLeft, Upload, X, KeyRound, Trash2, UserCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { ChangeEvent, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface Team {
    id: number;
    nom: string;
    code: string;
    logo?: string | null;
    logo_url?: string;
    description?: string | null;
    priorite: number;
    user?: {
        id: number;
        email: string | null;
        telephone: string;
    } | null;
}

interface Props {
    team: Team;
}

export default function TeamEdit({ team }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

    const teamForm = useForm({
        nom: team.nom,
        code: team.code,
        logo: null as File | null,
        logo_url: team.logo_url || team.logo || '',
        description: team.description || '',
        priorite: team.priorite.toString(),
    });

    const accountForm = useForm({
        email: team.user?.email || '',
        telephone: team.user?.telephone || '',
        password: '',
        password_confirmation: '',
    });

    const handleTeamSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (teamForm.data.logo) {
            const formData = new FormData();
            formData.append('nom', teamForm.data.nom);
            formData.append('code', teamForm.data.code);
            formData.append('description', teamForm.data.description);
            formData.append('priorite', teamForm.data.priorite);
            formData.append('logo', teamForm.data.logo);

            teamForm.post(`/admin/teams/${team.id}`, formData, {
                onSuccess: () => {
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            });
        } else {
            teamForm.put(`/admin/teams/${team.id}`, {
                nom: teamForm.data.nom,
                code: teamForm.data.code,
                description: teamForm.data.description,
                priorite: teamForm.data.priorite,
                logo_url: teamForm.data.logo_url,
            });
        }
    };

    const handleAccountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        accountForm.put(`/admin/teams/${team.id}/account`, {
            onSuccess: () => {
                accountForm.setData('password', '');
                accountForm.setData('password_confirmation', '');
            }
        });
    };

    const handleDeleteAccount = () => {
        router.delete(`/admin/teams/${team.id}/account`);
        setDeleteAccountDialogOpen(false);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                teamForm.errors.logo = 'Le fichier ne doit pas dépasser 2 Mo';
                return;
            }
            if (!file.type.startsWith('image/')) {
                teamForm.errors.logo = 'Le fichier doit être une image';
                return;
            }
            teamForm.setData('logo', file);
            teamForm.setData('logo_url', '');
        }
    };

    const handleRemoveFile = () => {
        teamForm.setData('logo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getPreviewUrl = () => {
        if (teamForm.data.logo) {
            return URL.createObjectURL(teamForm.data.logo);
        }
        return teamForm.data.logo_url;
    };

    return (
        <>
            <Head title="Modifier l'équipe" />
            <AdminLayout
                title="Modifier l'équipe"
                description="Gérez les informations de l'équipe et son compte"
            >
                <Link href="/admin/teams">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <Tabs defaultValue="team" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="team">Équipe</TabsTrigger>
                        <TabsTrigger value="account">
                            <KeyRound className="w-4 h-4 mr-2" />
                            Compte équipe
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="team">
                        <form onSubmit={handleTeamSubmit} className="space-y-6">
                            {/* Logo Upload */}
                            <div className="grid gap-2">
                                <Label>Logo</Label>
                                <div className="flex items-center gap-4">
                                    {getPreviewUrl() ? (
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={getPreviewUrl()}
                                                alt="Logo"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-400">
                                                {teamForm.data.nom ? teamForm.data.nom.charAt(0).toUpperCase() : '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex gap-2">
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className={teamForm.errors.logo ? 'border-red-500' : ''}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Téléchargez le logo depuis votre appareil (JPEG, PNG, GIF, SVG - max 2 Mo)
                                        </p>
                                        {teamForm.errors.logo && (
                                            <p className="text-sm text-red-500">{teamForm.errors.logo}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nom">Nom de l'équipe</Label>
                                <Input
                                    id="nom"
                                    value={teamForm.data.nom}
                                    onChange={(e) => teamForm.setData('nom', e.target.value)}
                                    placeholder="ex: Paris Saint-Germain"
                                    className={teamForm.errors.nom ? 'border-red-500' : ''}
                                />
                                {teamForm.errors.nom && (
                                    <p className="text-sm text-red-500">{teamForm.errors.nom}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    value={teamForm.data.code}
                                    onChange={(e) => teamForm.setData('code', e.target.value)}
                                    placeholder="ex: PSG"
                                    className={teamForm.errors.code ? 'border-red-500' : ''}
                                />
                                <p className="text-xs text-gray-500">
                                    Code court pour identifier l'équipe (max 10 caractères)
                                </p>
                                {teamForm.errors.code && (
                                    <p className="text-sm text-red-500">{teamForm.errors.code}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="priorite">Priorité</Label>
                                <Input
                                    id="priorite"
                                    type="number"
                                    value={teamForm.data.priorite}
                                    onChange={(e) => teamForm.setData('priorite', e.target.value)}
                                    min="0"
                                    max="10"
                                    className={teamForm.errors.priorite ? 'border-red-500' : ''}
                                />
                                <p className="text-xs text-gray-500">
                                    De 0 (moins prioritaire) à 10 (plus prioritaire)
                                </p>
                                {teamForm.errors.priorite && (
                                    <p className="text-sm text-red-500">{teamForm.errors.priorite}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={teamForm.data.description}
                                    onChange={(e) =>
                                        teamForm.setData('description', e.target.value)
                                    }
                                    placeholder="Description optionnelle de l'équipe"
                                    rows={4}
                                    className={teamForm.errors.description ? 'border-red-500' : ''}
                                />
                                {teamForm.errors.description && (
                                    <p className="text-sm text-red-500">{teamForm.errors.description}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={teamForm.processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Mettre à jour l'équipe
                                </Button>
                                <Link href="/admin/teams">
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <KeyRound className="w-5 h-5" />
                                    Informations du compte équipe
                                </CardTitle>
                                <CardDescription>
                                    {team.user ? (
                                        <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            Compte créé et actif
                                        </span>
                                    ) : (
                                        <span className="text-orange-600 dark:text-orange-400">
                                            Aucun compte associé - Cliquez sur le bouton 🔑 dans la liste des équipes pour en créer un
                                        </span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            {team.user && (
                                <form onSubmit={handleAccountSubmit}>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="telephone">Téléphone (identifiant de connexion) *</Label>
                                            <Input
                                                id="telephone"
                                                type="tel"
                                                placeholder="+237 600 000 000"
                                                value={accountForm.data.telephone}
                                                onChange={(e) => accountForm.setData('telephone', e.target.value)}
                                                required
                                            />
                                            <p className="text-xs text-gray-500">
                                                Ce numéro servira d'identifiant pour la connexion équipe
                                            </p>
                                            {accountForm.errors.telephone && (
                                                <p className="text-sm text-red-500">{accountForm.errors.telephone}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email (optionnel)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="equipe@example.com"
                                                value={accountForm.data.email}
                                                onChange={(e) => accountForm.setData('email', e.target.value)}
                                            />
                                            {accountForm.errors.email && (
                                                <p className="text-sm text-red-500">{accountForm.errors.email}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Laisser vide pour conserver le mot de passe actuel"
                                                value={accountForm.data.password}
                                                onChange={(e) => accountForm.setData('password', e.target.value)}
                                                minLength={6}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Minimum 6 caractères - Laisser vide pour ne pas changer
                                            </p>
                                            {accountForm.errors.password && (
                                                <p className="text-sm text-red-500">{accountForm.errors.password}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={accountForm.data.password_confirmation}
                                                onChange={(e) => accountForm.setData('password_confirmation', e.target.value)}
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button type="submit" disabled={accountForm.processing}>
                                                <Save className="mr-2 h-4 w-4" />
                                                {accountForm.processing ? 'Enregistrement...' : 'Mettre à jour le compte'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => setDeleteAccountDialogOpen(true)}
                                                disabled={accountForm.processing}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Supprimer le compte
                                            </Button>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
                                                Informations de connexion actuelles :
                                            </p>
                                            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                                <p><strong>URL de connexion :</strong> <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">/team/login</code></p>
                                                <p><strong>Téléphone :</strong> <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">{team.user.telephone}</code></p>
                                                <p><strong>Email :</strong> <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">{team.user.email || 'Non renseigné'}</code></p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </form>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>

                <ConfirmDialog
                    open={deleteAccountDialogOpen}
                    onOpenChange={setDeleteAccountDialogOpen}
                    onConfirm={handleDeleteAccount}
                    title="Supprimer le compte équipe"
                    description="Êtes-vous sûr de vouloir supprimer ce compte équipe ? L'équipe pourra toujours exister, mais ne pourra plus se connecter. Cette action est irréversible."
                    confirmText="Supprimer"
                    cancelText="Annuler"
                    variant="destructive"
                />
            </AdminLayout>
        </>
    );
}
