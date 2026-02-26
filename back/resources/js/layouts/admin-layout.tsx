import type React from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AdminLayout({
    children,
    title,
    description,
}: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {(title || description) && (
                    <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-gray-900">
                        {title && (
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                        )}
                        {description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                )}
                <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-950">{children}</div>
            </div>
        </div>
    );
}
