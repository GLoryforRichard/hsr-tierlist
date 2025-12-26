import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="border-b border-hsr-border bg-hsr-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-foreground hover:text-hsr-purple transition-colors">
                    HSR Tier List
                </Link>
                <div className="flex gap-6 text-sm font-medium text-gray-400">
                    <Link href="/tier-list" className="hover:text-foreground transition-colors">
                        Tier List
                    </Link>
                    <Link href="/characters" className="hover:text-foreground transition-colors">
                        Characters
                    </Link>
                    <Link href="/updates" className="hover:text-foreground transition-colors hidden sm:block">
                        Updates
                    </Link>
                </div>
            </div>
        </nav>
    );
}
