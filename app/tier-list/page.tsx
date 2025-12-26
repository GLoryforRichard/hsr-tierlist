import { getAllCharacters, getGameModes, getSiteConfig } from "@/lib/api";
import { TierTable } from "@/components/TierTable";
import { ModeTabs } from "@/components/ModeTabs";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema, generateTierListSchema, generateFAQSchema } from "@/lib/schema";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const site = getSiteConfig();
    return {
        title: `HSR Tier List (v${site.currentVersion}) - Best Characters Ranked`,
        description: `Overall Honkai: Star Rail Tier List for version ${site.currentVersion}. aggregated rankings for MoC, Pure Fiction, and Apocalyptic Shadow.`,
    };
}

export default function OverallTierListPage() {
    const characters = getAllCharacters();
    const modes = getGameModes();
    const site = getSiteConfig();

    const breadcrumb = generateBreadcrumbSchema([
        { name: "Home", item: site.domain },
        { name: "Tier List", item: `${site.domain}/tier-list` },
    ]);

    const itemList = generateTierListSchema(site, "Overall", "tier-list", characters);

    const faq = generateFAQSchema([
        { question: "What is the best character in HSR?", answer: "Currently, characters like Acheron and Firefly are considered top-tier DPS." },
        { question: "How often is this tier list updated?", answer: "We update within 24 hours of every new patch or major meta shift." }
    ]);

    return (
        <div className="max-w-7xl mx-auto">
            <JsonLd data={{ "@graph": [breadcrumb, itemList, faq] }} />
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4">Honkai: Star Rail Tier List</h1>
                <p className="text-gray-400 max-w-3xl">
                    The best characters ranked for the current meta (v{site.currentVersion}).
                    This overall list aggregates performance across all three endgame modes.
                </p>
            </div>

            <ModeTabs modes={modes} currentMode="tier-list" />

            <TierTable characters={characters} mode="overall" />

            <div className="mt-12 text-sm text-gray-500 bg-hsr-card p-4 rounded-lg border border-hsr-border">
                <h3 className="font-bold mb-2">How it works</h3>
                <p>
                    Rankings are based on average performance in Memory of Chaos, Pure Fiction, and Apocalyptic Shadow at E0S1 (5★) or E6 (4★).
                    S-Tier units are meta-defining. A-Tier are strong pillars. B-Tier are viable alternatives.
                </p>
            </div>
        </div>
    );
}
