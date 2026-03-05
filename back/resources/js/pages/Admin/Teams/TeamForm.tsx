import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { ChangeEvent, useRef } from 'react';

interface TeamFormProps {
    team?: {
        id: number;
        nom: string;
        code: string;
        logo?: string | null;
        logo_url?: string;
        description?: string | null;
        priorite: number;
    };
}

export default function TeamForm({ team }: TeamFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, put, processing, errors } = useForm({
        nom: team?.nom ?? '',
        code: team?.code ?? '',
        logo: null as File | null,
        logo_url: team?.logo_url || team?.logo || '',
        description: team?.description ?? '',
        priorite: (team?.priorite ?? 0).toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (team) {
            // For update with file upload, use POST with explicit route
            if (data.logo) {
                const formData = new FormData();
                formData.append('nom', data.nom);
                formData.append('code', data.code);
                formData.append('description', data.description);
                formData.append('priorite', data.priorite);
                formData.append('logo', data.logo);
                // Don't send logo_url when there's a file upload

                // Use the specific POST route for updates with files
                post(`/admin/teams/${team.id}`, formData, {
                    onSuccess: () => {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }
                });
            } else {
                // No file, use regular PUT with JSON
                put(`/admin/teams/${team.id}`, {
                    nom: data.nom,
                    code: data.code,
                    description: data.description,
                    priorite: data.priorite,
                    logo_url: data.logo_url,
                });
            }
        } else {
            // For create, use FormData
            const formData = new FormData();
            formData.append('nom', data.nom);
            formData.append('code', data.code);
            formData.append('description', data.description);
            formData.append('priorite', data.priorite);

            if (data.logo) {
                formData.append('logo', data.logo);
            }
            if (data.logo_url && !data.logo) {
                formData.append('logo_url', data.logo_url);
            }

            post('/admin/teams', formData, {
                onSuccess: () => {
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            });
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                errors.logo = 'Le fichier ne doit pas dépasser 2 Mo';
                return;
            }
            if (!file.type.startsWith('image/')) {
                errors.logo = 'Le fichier doit être une image';
                return;
            }
            setData('logo', file);
            setData('logo_url', ''); // Clear URL when file is selected
        }
    };

    const handleRemoveFile = () => {
        setData('logo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getPreviewUrl = () => {
        if (data.logo) {
            return URL.createObjectURL(data.logo);
        }
        return data.logo_url;
    };

    return (
        <AdminLayout
            title={team ? 'Modifier l\'équipe' : 'Ajouter une équipe'}
            description={team ? 'Modifier les informations de l\'équipe' : 'Créer une nouvelle équipe'}
        >
            <Head title={team ? 'Modifier l\'équipe' : 'Nouvelle équipe'} />

            <div className="max-w-2xl">
                <Link href="/admin/teams">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                        {data.nom ? data.nom.charAt(0).toUpperCase() : '?'}
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
                                        className={errors.logo ? 'border-red-500' : ''}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Téléchargez le logo depuis votre appareil (JPEG, PNG, GIF, SVG - max 2 Mo)
                                </p>
                                {errors.logo && (
                                    <p className="text-sm text-red-500">{errors.logo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="nom">Nom de l'équipe</Label>
                        <Input
                            id="nom"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            placeholder="ex: Paris Saint-Germain"
                            className={errors.nom ? 'border-red-500' : ''}
                        />
                        {errors.nom && (
                            <p className="text-sm text-red-500">{errors.nom}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="ex: PSG"
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">
                            Code court pour identifier l'équipe (max 10 caractères)
                        </p>
                        {errors.code && (
                            <p className="text-sm text-red-500">{errors.code}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="priorite">Priorité</Label>
                        <Input
                            id="priorite"
                            type="number"
                            value={data.priorite}
                            onChange={(e) => setData('priorite', e.target.value)}
                            min="0"
                            max="10"
                            className={errors.priorite ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">
                            De 0 (moins prioritaire) à 10 (plus prioritaire)
                        </p>
                        {errors.priorite && (
                            <p className="text-sm text-red-500">{errors.priorite}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Description optionnelle de l'équipe"
                            rows={4}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {team ? 'Mettre à jour' : 'Créer l\'équipe'}
                        </Button>
                        <Link href="/admin/teams">
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
