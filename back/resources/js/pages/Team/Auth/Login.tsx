import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Link } from '@inertiajs/react';

function Login() {
    const { data, setData, post, processing, errors } = useForm({
        telephone: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/team/login');
    };

    return (
        <>
            <Head title="Connexion Équipe" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Espace Équipe</CardTitle>
                        <CardDescription>
                            Connectez-vous pour gérer votre équipe
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input
                                    id="telephone"
                                    type="tel"
                                    placeholder="+237 600 000 000"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    disabled={processing}
                                    autoComplete="tel"
                                />
                                {errors.telephone && (
                                    <p className="text-sm text-red-500">{errors.telephone}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    autoComplete="current-password"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Connexion...' : 'Se connecter'}
                            </Button>
                            <p className="text-sm text-center text-gray-500">
                                Vous n'avez pas de compte équipe ?{' '}
                                <Link href="/admin/login" className="text-blue-600 hover:underline">
                                    Espace administrateur
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}

export default React.memo(Login);
