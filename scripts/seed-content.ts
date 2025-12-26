import fs from 'fs';
import path from 'path';

const CHARACTERS_DB_PATH = path.join(process.cwd(), 'data', 'characters.json');

// Helper to seed logic
const SEED_DATA: Record<string, any> = {
    "acheron": {
        "tiers": { "overall": "S", "memory-of-chaos": "S", "pure-fiction": "S", "apocalyptic-shadow": "S" },
        "oneLiner": "The definition of brute force; ignores weakness types to obliterate everything.",
        "why": {
            "overall": "Acheron sits at the pinnacle of DPS due to her unique Ultimate mechanic that bypasses weakness types.",
            "memory-of-chaos": "S-Tier. Consistent 0-cycle potential regardless of enemy lineup.",
            "pure-fiction": "S-Tier. Her Ultimate hits all enemies, making her surprisingly effective even in AoE modes.",
            "apocalyptic-shadow": "S-Tier. Massive toughness damage helps break boss bars quickly."
        },
        "bestTeams": [
            { "name": "Premium Nihility", "core": ["Acheron", "Jiaoqiu", "Pela", "Aventurine"], "note": "Jiaoqiu stacks debuffs faster than any other unity, doubling Acheron's Ultimate frequency." }
        ],
        "alternatives": ["kafka", "jingliu"]
    },
    "firefly": {
        "tiers": { "overall": "S", "memory-of-chaos": "S", "pure-fiction": "A", "apocalyptic-shadow": "S" },
        "oneLiner": "Super Break enabler who turns the toughness bar into a health bar deletion button.",
        "why": {
            "overall": "Transforms the Break meta. If an enemy has a toughness bar, Firefly can delete them.",
            "memory-of-chaos": "S-Tier. Relentless speed and weakness implant make her universal.",
            "pure-fiction": "A-Tier. Strong, but sometimes lacks the screen-wipe frequency of pure Erudition units.",
            "apocalyptic-shadow": "S-Tier. The best boss killer in the game currently."
        },
        "bestTeams": [
            { "name": "Super Break Core", "core": ["Firefly", "Harmony Trailblazer", "Ruan Mei", "Gallagher"], "note": "The standard Super Break team. HTB and Ruan Mei are non-negotiable." }
        ],
        "alternatives": ["boothill", "xueyi"]
    },
    "ruan-mei": {
        "tiers": { "overall": "S+", "memory-of-chaos": "S+", "pure-fiction": "S+", "apocalyptic-shadow": "S+" },
        "oneLiner": "The most universal support in the game. Speed, Break Efficiency, and PEN for everyone.",
        "why": {
            "overall": "If you have a team, Ruan Mei probably makes it better. Currently the #1 support.",
            "memory-of-chaos": "S-Tier. Enables 0-cycles by delaying enemy recovery.",
            "pure-fiction": "S-Tier. Break efficiency helps clear waves faster.",
            "apocalyptic-shadow": "S-Tier. Essential for breaking tanky bosses."
        },
        "bestTeams": [
            { "name": "Universal Buffer", "core": ["Ruan Mei", "Any DPS", "Any Sustain"], "note": "Fits anywhere." }
        ],
        "alternatives": ["robin", "sparkle"]
    },
    "aventurine": {
        "tiers": { "overall": "S", "memory-of-chaos": "S", "pure-fiction": "S", "apocalyptic-shadow": "S" },
        "oneLiner": "Invincible shielder who deals damage and buffs crit. The gold standard for sustain.",
        "why": {
            "overall": "Provides unturnable shields while contributing significant team damage.",
            "memory-of-chaos": "S-Tier. Keeps the team alive against heavy hitters while debuffing for Acheron/Ratio.",
            "pure-fiction": "S-Tier. His follow-up attacks trigger frequently in AoE scenarios.",
            "apocalyptic-shadow": "S-Tier. Reliable sustain against aggressive bosses."
        },
        "bestTeams": [
            { "name": "FUA Sustain", "core": ["Aventurine", "Dr. Ratio", "Topaz", "Robin"], "note": "Fuels the Follow-Up Attack engine." }
        ],
        "alternatives": ["fu-xuan", "luocha"]
    }
};

async function main() {
    const chars = JSON.parse(fs.readFileSync(CHARACTERS_DB_PATH, 'utf8'));
    let updatedCount = 0;

    const updatedChars = chars.map((c: any) => {
        // Check if we have seed data for this slug
        const seed = SEED_DATA[c.slug];
        if (seed) {
            console.log(`Seeding content for ${c.name}...`);
            updatedCount++;
            return { ...c, ...seed };
        }
        return c;
    });

    fs.writeFileSync(CHARACTERS_DB_PATH, JSON.stringify(updatedChars, null, 2));
    console.log(`Updated ${updatedCount} characters with rich content.`);
}

main();
