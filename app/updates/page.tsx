import { getAllUpdates, getSiteConfig } from "@/lib/api";
import { Metadata } from "next";
import Link from 'next/link';
import { History } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const site = getSiteConfig();
    return {
        title: `Patch Notes & Updates - HSR Tier List (v${site.currentVersion})`,
        description: `History of tier list updates and changes for Honkai: Star Rail.`,
    };
}

export default function UpdatesIndexPage() {
    const updates = getAllUpdates();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                <History className="text-hsr-purple" /> Tier List Updates
            </h1>

            <div className="space-y-6">
                {updates.map((update) => (
                    <Link href={`/updates/${update.version}`} key={update.version} className="block bg-hsr-card border border-hsr-border rounded-xl p-6 hover:border-hsr-purple transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-bold">Version {update.version}</h2>
                            <span className="text-sm text-gray-400">{update.date}</span>
                        </div>
                        <p className="text-gray-300 mb-4">{update.summary}</p>
                        <div className="text-sm text-hsr-purple font-medium">Read full changes →</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
