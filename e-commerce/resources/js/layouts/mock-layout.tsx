import { type ReactNode } from 'react';


interface MockLayoutProps {
    children: ReactNode;
    breadcrumbs?: any[];
}

export default function MockLayout({ children }: MockLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            {/* Simple Header */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-teal-600">
                        <span>📦</span>
                        <span>Seller Dashboard (Mock)</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Development Mode
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1">
                {children}
            </main>


        </div>
    );
}
