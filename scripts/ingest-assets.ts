import fs from 'fs';
import path from 'path';
import https from 'https';
import { Character } from '../lib/types'; // We might need to extend this type

const ASSET_SOURCE_PATH = path.join(process.cwd(), 'data', 'asset_source.json');
const CHARACTERS_DB_PATH = path.join(process.cwd(), 'data', 'characters.json');
const PUBLIC_ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

interface AssetSource {
    project_meta: any;
    asset_rules: {
        base_url: string;
        icon_path_template: string;
        portrait_path_template: string;
    };
    path_mapping: {
        map: Record<string, string>;
    };
    characters: any[];
}

// Ensure directory exists
function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Download file
async function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ensureDir(path.dirname(dest));
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}


const REMOTE_CHARACTERS_URL = "https://vizualabstract.github.io/StarRailStaticAPI/db/en/characters.json";
const ASSETS_BASE_URL = "https://vizualabstract.github.io/StarRailStaticAPI/assets/";

// Reverse Map: Internal -> Display
const PATH_MAP: Record<string, string> = {
    "Warrior": "Destruction",
    "Rogue": "The Hunt",
    "Mage": "Erudition",
    "Shaman": "Harmony",
    "Warlock": "Nihility",
    "Knight": "Preservation",
    "Priest": "Abundance",
    "Memory": "Remembrance"
};

async function fetchRemoteData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        https.get(REMOTE_CHARACTERS_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(Object.values(json));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('Starting Asset Ingestion from Remote API...');

    let remoteChars: any[] = [];
    try {
        remoteChars = await fetchRemoteData();
        console.log(`Fetched ${remoteChars.length} characters from API.`);
    } catch (err) {
        console.error("Failed to fetch remote data:", err);
        process.exit(1);
    }

    // Load existing DB to preserve manual tiers/content
    const currentCharacters: Character[] = fs.existsSync(CHARACTERS_DB_PATH)
        ? JSON.parse(fs.readFileSync(CHARACTERS_DB_PATH, 'utf8'))
        : [];

    const existingMap = new Map(currentCharacters.map(c => [c.gameId || c.slug, c]));

    const updatedCharacters: Character[] = [];

    for (const charSource of remoteChars) {
        // charSource: { id, name, rarity, path, element, icon, portrait, ... }

        // Map Path
        const displayPath = PATH_MAP[charSource.path] || charSource.path;
        const internalPathId = charSource.path;

        // Generate Slug
        // Normalize name: "March 7th" -> "march-7th", "Dan Heng • Imbibitor Lunae" -> "dan-heng-imbibitor-lunae"
        const slug = charSource.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Resolve URLs
        const iconUrlRemote = ASSETS_BASE_URL + charSource.icon;
        const portraitUrlRemote = ASSETS_BASE_URL + charSource.portrait;

        const iconLocalPath = path.join(PUBLIC_ASSETS_DIR, 'icon', 'character', `${charSource.id}.png`);
        const portraitLocalPath = path.join(PUBLIC_ASSETS_DIR, 'image', 'character_portrait', `${charSource.id}.png`);

        // Download Assets (if missing)
        try {
            if (!fs.existsSync(iconLocalPath)) {
                // console.log(`Downloading icon for ${charSource.name}...`); // formatted logger
                await downloadFile(iconUrlRemote, iconLocalPath);
            }
            if (!fs.existsSync(portraitLocalPath)) {
                // console.log(`Downloading portrait for ${charSource.name}...`);
                await downloadFile(portraitUrlRemote, portraitLocalPath);
            }
        } catch (err) {
            // console.error... potentially 404s for new chars
        }

        // Merge Data
        const existing = existingMap.get(charSource.id) || existingMap.get(slug);

        const newEntry: Character = {
            id: slug, // We use slug as ID in our app
            gameId: charSource.id,
            name: charSource.name,
            slug: slug,
            rarity: charSource.rarity,
            path: displayPath,
            internalPathId: internalPathId,
            element: charSource.element,

            // Preservation
            tiers: existing?.tiers || { overall: "N/A" },
            oneLiner: existing?.oneLiner || "Pending analysis.",
            why: existing?.why || { overall: "No analysis available yet." },
            bestTeams: existing?.bestTeams || [],
            alternatives: existing?.alternatives || [],
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        updatedCharacters.push(newEntry);
    }

    // Sort by name or rarity etc? Let's keep source order or sort by Rarity DESC
    updatedCharacters.sort((a, b) => b.rarity - a.rarity);

    // Write back
    fs.writeFileSync(CHARACTERS_DB_PATH, JSON.stringify(updatedCharacters, null, 2));
    console.log(`Successfully updated characters.json with ${updatedCharacters.length} entries.`);
}

main().catch(console.error);
