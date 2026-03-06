import { useForm, Head, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

interface Props {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const { props } = usePage();
    
    const { data, setData, post, processing, error, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Connexion"
            description="Entrez votre email ou téléphone et mot de passe pour vous connecter"
        >
            <Head title="Connexion" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email ou téléphone</Label>
                        <Input
                            id="email"
                            type="text"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            placeholder="email@example.com ou +237 600 000 000"
                        />
                        <InputError message={error} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Mot de passe</Label>
                            {canResetPassword && (
                                <TextLink
                                    href="/forgot-password"
                                    className="ml-auto text-sm"
                                    tabIndex={3}
                                >
                                    Mot de passe oublié ?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Votre mot de passe"
                        />
                        <InputError message={error} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked === true)}
                            tabIndex={4}
                        />
                        <Label htmlFor="remember" className="text-sm">
                            Se souvenir de moi
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={5}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner />}
                        Se connecter
                    </Button>
                </div>

                {canRegister && (
                    <div className="text-center text-sm text-muted-foreground">
                        Pas encore de compte ?{' '}
                        <TextLink href="/register" tabIndex={6}>
                            S'inscrire
                        </TextLink>
                    </div>
                )}
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
                    Types de comptes acceptés :
                </p>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li>• <strong>Administrateurs</strong> - Connectez-vous avec votre email</li>
                    <li>• <strong>Équipes</strong> - Connectez-vous avec votre email ou téléphone</li>
                </ul>
            </div>
        </AuthLayout>
    );
}
