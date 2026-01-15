import { LucideIcon } from 'lucide-react';

interface PlaceholderViewProps {
    title: string;
    icon: LucideIcon;
    message: string;
}

export const PlaceholderView = ({ title, icon: Icon, message }: PlaceholderViewProps) => (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
            <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">{message}</p>
    </div>
);
