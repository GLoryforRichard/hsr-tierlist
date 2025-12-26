import { getAllCharacters, getSiteConfig } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const site = getSiteConfig();
    return {
        title: `Character Index - HSR Tier List (v${site.currentVersion})`,
        description: `List of all Honkai: Star Rail characters with tier ratings and builds.`,
    };
}

export default function CharacterIndexPage() {
    const characters = getAllCharacters();

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Character Index</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {characters.map((char) => (
                    <Link href={`/characters/${char.slug}`} key={char.id} className="group bg-hsr-card border border-hsr-border rounded-lg p-4 flex flex-col items-center hover:bg-white/5 transition-colors">
                        <div className="relative w-20 h-20 rounded-full bg-gray-800 border-2 border-transparent group-hover:border-hsr-purple transition-all mb-3 overflow-hidden">
                            {char.gameId ? (
                                <Image
                                    src={`/assets/icon/character/${char.gameId}.png`}
                                    alt={char.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">{char.name[0]}</div>
                            )}
                        </div>
                        <h3 className="font-semibold text-center group-hover:text-hsr-purple transition-colors">{char.name}</h3>
                        <div className="text-xs text-gray-500 uppercase mt-1 flex gap-1">
                            <span>{char.element}</span> • <span>{char.path}</span>
                        </div>
                        <div className="mt-2 text-xs font-bold bg-hsr-purple/20 text-hsr-purple px-2 py-0.5 rounded">
                            Tier {char.tiers.overall || 'N/A'}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
