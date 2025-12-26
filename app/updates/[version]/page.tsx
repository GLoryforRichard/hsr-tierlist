import { getAllUpdates, getSiteConfig, getGameModes } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    params: { version: string };
}

export async function generateStaticParams() {
    const updates = getAllUpdates();
    return updates.map((u) => ({
        version: u.version,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const updates = getAllUpdates();
    const update = updates.find(u => u.version === params.version);
    const site = getSiteConfig();

    if (!update) return {};

    return {
        title: `Version ${update.version} Update - HSR Tier List`,
        description: `Tier list changes and patch notes for HSR version ${update.version}.`,
    };
}

export default function UpdateDetailPage({ params }: Props) {
    const updates = getAllUpdates();
    const update = updates.find(u => u.version === params.version);

    if (!update) {
        notFound();
    }

    // Helper to get formatted changes table
    const changes = update.changes;

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/updates" className="text-gray-500 hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Updates
            </Link>

            <h1 className="text-4xl font-bold mb-2">Version {update.version} Notes</h1>
            <p className="text-gray-400 mb-8">Released on {update.date}</p>

            <div className="bg-hsr-card border border-hsr-border rounded-xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <p className="text-gray-300 leading-relaxed">{update.summary}</p>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Tier Changes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-hsr-card border border-hsr-border rounded-lg overflow-hidden">
                        <thead className="bg-hsr-dark/50 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Character</th>
                                <th className="p-4">Mode</th>
                                <th className="p-4">Change</th>
                                <th className="p-4">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-hsr-border">
                            {changes.map((change, idx) => (
                                <tr key={idx} className="hover:bg-white/5">
                                    <td className="p-4 font-medium">{change.character}</td>
                                    <td className="p-4 text-sm text-gray-400">{change.mode}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-black/30 font-mono text-sm">
                                            {change.from} <span className="text-gray-500">→</span> <span className={clsx(
                                                tierVal(change.to) > tierVal(change.from) ? "text-green-400" : "text-red-400" // Naive comparison, assuming S>A
                                            )}>{change.to}</span>
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">{change.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function tierVal(tier: string) {
    const map: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };
    return map[tier] || 0;
}
