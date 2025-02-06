declare global {
    interface Window {
        readonly innerWidth: number;
        addEventListener: typeof addEventListener;
        localStorage: {
            getItem(key: string): string | null;
            setItem(key: string, value: string): void;
            removeItem(key: string): void;
        };
    }
}

export {};