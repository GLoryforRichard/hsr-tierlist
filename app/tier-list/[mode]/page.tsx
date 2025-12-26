import { getAllCharacters, getGameModes, getSiteConfig } from "@/lib/api";
import { TierTable } from "@/components/TierTable";
import { ModeTabs } from "@/components/ModeTabs";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema, generateTierListSchema, generateFAQSchema } from "@/lib/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: { mode: string };
}

export async function generateStaticParams() {
    const modes = getGameModes();
    // Filter out the main 'tier-list' slug if we only want sub-modes here, 
    // but usually we can filter inside or just return all except 'tier-list' 
    // because 'tier-list' is handled by the parent folder page (actually no, parent is index).
    // 'tier-list' slug would conflict with the folder 'tier-list' if not careful? 
    // No, app/tier-list/page.tsx handles /tier-list.
    // app/tier-list/[mode]/page.tsx handles /tier-list/xyz.
    // So 'tier-list' slug from modes.json shouldn't be valid here as a param 'mode' unless we want /tier-list/tier-list (which is weird).
    // So we filter it out.
    return modes
        .filter(m => m.slug !== 'tier-list')
        .map((mode) => ({
            mode: mode.slug,
        }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const modes = getGameModes();
    const modeData = modes.find(m => m.slug === params.mode);
    const site = getSiteConfig();

    if (!modeData) return {};

    return {
        title: `${modeData.name} Tier List (v${site.currentVersion}) - HSR`,
        description: `Best characters for ${modeData.name} in Honkai: Star Rail v${site.currentVersion}. Ranked by endgame performance.`,
    };
}

export default function ModeTierListPage({ params }: Props) {
    const modes = getGameModes();
    const modeData = modes.find(m => m.slug === params.mode);

    if (!modeData) {
        notFound();
    }

    const characters = getAllCharacters();
    const site = getSiteConfig();

    // Map slug to char property key if needed. 
    // 'memory-of-chaos' -> 'memory-of-chaos' etc.
    // But strictly, we used slugs in keys mostly.
    const dataKey = modeData.slug; // Assuming slug matches key in characters.json keys

    const breadcrumb = generateBreadcrumbSchema([
        { name: "Home", item: site.domain },
        { name: "Tier List", item: `${site.domain}/tier-list` },
        { name: modeData.name, item: `${site.domain}/tier-list/${modeData.slug}` },
    ]);

    const itemList = generateTierListSchema(site, modeData.name, dataKey, characters);

    const faq = generateFAQSchema([
        { question: `Who is best for ${modeData.name}?`, answer: `Check the S-Tier rankings above for the current meta in ${modeData.name}.` }
    ]);

    return (
        <div className="max-w-7xl mx-auto">
            <JsonLd data={{ "@graph": [breadcrumb, itemList, faq] }} />
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4">{modeData.name} Tier List</h1>
                <p className="text-gray-400 max-w-3xl">
                    {modeData.description} Updated for version {site.currentVersion}.
                </p>
            </div>

            <ModeTabs modes={modes} currentMode={modeData.slug} />

            <TierTable characters={characters} mode={dataKey} />

            <div className="mt-12 text-sm text-gray-500 bg-hsr-card p-4 rounded-lg border border-hsr-border">
                <h3 className="font-bold mb-2">About {modeData.name} Rankings</h3>
                <p>
                    Specific evaluations for {modeData.name}, taking into account current turbulence/buffs and enemy mechanics.
                </p>
            </div>
        </div>
    );
}
