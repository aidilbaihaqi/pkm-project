import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

export interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, type = "success", isVisible, onClose }: ToastProps) {
    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
    };

    const colors = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    const Icon = icons[type];

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white min-w-[280px] max-w-[90vw]",
                colors[type]
            )}>
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{message}</span>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// Hook for easy toast management
export function useToast() {
    const [toast, setToast] = React.useState<{
        message: string;
        type: "success" | "error" | "info";
        isVisible: boolean;
    }>({
        message: "",
        type: "success",
        isVisible: false,
    });

    const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "success") => {
        setToast({ message, type, isVisible: true });
    }, []);

    const hideToast = React.useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    return { toast, showToast, hideToast };
}
