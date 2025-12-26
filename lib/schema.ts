import { Character, SiteConfig } from "./types";

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.item,
        })),
    };
}

export function generateTierListSchema(
    site: SiteConfig,
    modeName: string,
    modeSlug: string,
    characters: Character[]
) {
    // Sort characters by tier for the ItemList (S > A > B > C > D) -> Naive alphabetical works for S, then A, B, C, D? No. S comes after A.
    // Custom sort needed.
    const tierOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, D: 4 };
    const sorted = [...characters].sort((a, b) => {
        const tierA = a.tiers[modeSlug === 'tier-list' ? 'overall' : modeSlug] || 'D';
        const tierB = b.tiers[modeSlug === 'tier-list' ? 'overall' : modeSlug] || 'D';
        return (tierOrder[tierA] ?? 5) - (tierOrder[tierB] ?? 5);
    });

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": sorted.slice(0, 20).map((char, index) => ({ // Limit to top 20 to avoid massive HTML
            "@type": "ListItem",
            "position": index + 1,
            "url": `${site.domain}/characters/${char.slug}`,
            "name": `${char.name} (${char.tiers[modeSlug === 'tier-list' ? 'overall' : modeSlug] || 'N/A'} Tier)`,
        })),
        "name": `${modeName} Tier List Rankings`,
        "description": `Rankings for ${modeName} in Honkai: Star Rail v${site.currentVersion}`,
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer,
            },
        })),
    };
}

export function generateCharacterSchema(site: SiteConfig, char: Character) {
    return {
        "@context": "https://schema.org",
        "@type": "Person", // or "VideoGameChara" if we want to be specific but Person is standard for rich snippets sometimes
        "name": char.name,
        "url": `${site.domain}/characters/${char.slug}`,
        "image": `${site.domain}/assets/image/character_portrait/${char.gameId}.png`,
        "description": char.oneLiner,
        "jobTitle": char.path,
        "knowsAbout": char.element,
    };
}
