import fs from 'fs';
import path from 'path';
import { SiteConfig, GameMode, Character, Update } from './types';

const dataDir = path.join(process.cwd(), 'data');

export function getSiteConfig(): SiteConfig {
    const file = fs.readFileSync(path.join(dataDir, 'site.json'), 'utf8');
    return JSON.parse(file);
}

export function getGameModes(): GameMode[] {
    const file = fs.readFileSync(path.join(dataDir, 'modes.json'), 'utf8');
    return JSON.parse(file);
}

export function getAllCharacters(): Character[] {
    const file = fs.readFileSync(path.join(dataDir, 'characters.json'), 'utf8');
    return JSON.parse(file);
}

export function getCharacterBySlug(slug: string): Character | undefined {
    const characters = getAllCharacters();
    return characters.find((c) => c.slug === slug);
}

export function getAllUpdates(): Update[] {
    const file = fs.readFileSync(path.join(dataDir, 'updates.json'), 'utf8');
    return JSON.parse(file);
}

export function getLatestUpdate(): Update {
    const updates = getAllUpdates();
    return updates[0];
}
