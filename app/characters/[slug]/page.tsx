import { getAllCharacters, getSiteConfig, getGameModes, getCharacterBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema, generateCharacterSchema } from "@/lib/schema";

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    const characters = getAllCharacters();
    return characters.map((char) => ({
        slug: char.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const char = getCharacterBySlug(params.slug);
    const site = getSiteConfig();

    if (!char) return {};

    return {
        title: `${char.name} Tier & Build Guide (v${site.currentVersion}) - HSR`,
        description: `${char.name} build, best teams, and tier ratings for MoC, PF, and AS. ${char.oneLiner}`,
    };
}

export default function CharacterDetailPage({ params }: Props) {
    const char = getCharacterBySlug(params.slug);

    if (!char) {
        notFound();
    }

    const modes = getGameModes();
    const site = getSiteConfig();

    const breadcrumb = generateBreadcrumbSchema([
        { name: "Home", item: site.domain },
        { name: "Characters", item: `${site.domain}/characters` },
        { name: char.name, item: `${site.domain}/characters/${char.slug}` },
    ]);

    const personSchema = generateCharacterSchema(site, char);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <JsonLd data={{ "@graph": [breadcrumb, personSchema] }} />
            {/* Header */}
            <div>
                <Link href="/tier-list" className="text-gray-500 hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Tier List
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-800 border-4 border-hsr-purple shrink-0 overflow-hidden">
                        {char.gameId ? (
                            <Image
                                src={`/assets/icon/character/${char.gameId}.png`}
                                alt={char.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-4xl text-gray-500">{char.name[0]}</div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-5xl font-bold mb-2">{char.name}</h1>
                        <div className="flex flex-wrap gap-3 mb-4 text-sm uppercase tracking-wider font-semibold">
                            <span className={clsx("px-3 py-1 rounded bg-hsr-card border border-hsr-border",
                                char.rarity === 5 ? "text-hsr-gold" : "text-purple-400")}>
                                {char.rarity} ★
                            </span>
                            <span className="px-3 py-1 rounded bg-hsr-card border border-hsr-border text-gray-300">
                                {char.element}
                            </span>
                            <span className="px-3 py-1 rounded bg-hsr-card border border-hsr-border text-gray-300">
                                {char.path}
                            </span>
                        </div>
                        <p className="text-xl text-gray-300 italic">"{char.oneLiner}"</p>
                    </div>
                </div>
            </div>

            {/* Tiers Grid */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Tier Performance</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {modes.map((mode) => {
                        // Mode key mapping: modes.slug matches keys usually, except data might have logic
                        // Assuming data keys match slugs per my previous files
                        // Special handling: 'tier-list' slug -> 'overall' key
                        const key = mode.slug === 'tier-list' ? 'overall' : mode.slug;
                        const rating = char.tiers[key] || 'N/A';

                        return (
                            <div key={mode.id} className="bg-hsr-card border border-hsr-border p-4 rounded-xl text-center">
                                <div className="text-xs text-gray-500 uppercase mb-2 h-8 flex items-center justify-center">{mode.name}</div>
                                <div className="text-4xl font-bold text-white">{rating}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Analysis */}
            <section className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="bg-hsr-card border border-hsr-border rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Why this Tier?</h3>
                    <div className="space-y-4">
                        {Object.entries(char.why).map(([key, reason]) => (
                            <div key={key}>
                                <span className="text-hsr-purple font-bold text-sm uppercase block mb-1">
                                    {key === 'overall' ? 'Overall' : namesFromSlug(key)}
                                </span>
                                <p className="text-gray-300 text-sm leading-relaxed">{reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Teams */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Best Teams</h2>
                <div className="space-y-4">
                    {char.bestTeams.map((team, idx) => (
                        <div key={idx} className="bg-hsr-card border border-hsr-border rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">{team.name}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {team.core.map((member) => (
                                    <div key={member} className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium border border-gray-700">
                                        {member}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">{team.note}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Alternatives */}
            <section>
                <h2 className="text-2xl font-bold mb-4">Alternatives</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {char.alternatives.map((altSlug) => {
                        // In a real app we'd fetch the full alt char object. For now we just link by slug.
                        // Ideally we should lookup the name/icon.
                        // We can use a client component or just do it here if we had the list.
                        // SSG limitation: we need to import getAllCharacters or similar to find the name if we want to show it.
                        // Let's assume we can fetch it.
                        const characters = getAllCharacters();
                        const altChar = characters.find(c => c.slug === altSlug);

                        if (!altChar) return null;

                        return (
                            <Link href={`/characters/${altChar.slug}`} key={altChar.id} className="group bg-hsr-card border border-hsr-border rounded-lg p-3 flex flex-col items-center hover:bg-white/5 transition-colors">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-hsr-purple transition-all mb-2 bg-gray-800">
                                    {altChar.gameId ? (
                                        <Image
                                            src={`/assets/icon/character/${altChar.gameId}.png`}
                                            alt={altChar.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs text-gray-500">{altChar.name[0]}</div>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-center group-hover:text-hsr-purple transition-colors">{altChar.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function namesFromSlug(slug: string) {
    // Simple helper, in real app import from modes.json
    if (slug === 'memory-of-chaos') return 'Memory of Chaos';
    if (slug === 'pure-fiction') return 'Pure Fiction';
    if (slug === 'apocalyptic-shadow') return 'Apocalyptic Shadow';
    return slug;
}
