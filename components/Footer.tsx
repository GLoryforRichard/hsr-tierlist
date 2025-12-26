import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-hsr-border bg-hsr-card py-12 mt-20">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500">
                <div>
                    <h3 className="text-foreground font-semibold mb-3">HSR Tier List</h3>
                    <p>The opinionated guide for Honkai: Star Rail endgame modes.</p>
                </div>
                <div>
                    <h3 className="text-foreground font-semibold mb-3">Links</h3>
                    <div className="flex flex-col gap-2">
                        <Link href="/tier-list" className="hover:text-foreground transition-colors">Tier List</Link>
                        <Link href="/characters" className="hover:text-foreground transition-colors">All Characters</Link>
                        <Link href="/updates" className="hover:text-foreground transition-colors">Patch Notes</Link>
                    </div>
                </div>
                <div>
                    <h3 className="text-foreground font-semibold mb-3">Legal</h3>
                    <div className="flex flex-col gap-2">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-hsr-border text-center text-xs">
                <p>&copy; {new Date().getFullYear()} HSR Tier List. Not affiliated with HoYoverse.</p>
            </div>
        </footer>
    );
}
