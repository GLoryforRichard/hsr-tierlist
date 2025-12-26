import { Metadata, Route } from 'next';
import { getAllCharacters, getGameModes, getSiteConfig, getAllUpdates } from '@/lib/api';

export default function sitemap(): Metadata & { url: string; lastModified?: string | Date; changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority?: number }[] {
    const site = getSiteConfig();
    const domain = site.domain;

    // Static routes
    const routes = [
        '',
        '/tier-list',
        '/characters',
        '/updates',
        '/privacy',
    ].map((route) => ({
        url: `${domain}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Modes
    const modes = getGameModes().map((mode) => ({
        url: `${domain}/tier-list/${mode.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Characters
    const characters = getAllCharacters().map((char) => ({
        url: `${domain}/characters/${char.slug}`,
        lastModified: char.lastUpdated || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Updates
    const updates = getAllUpdates().map((u) => ({
        url: `${domain}/updates/${u.version}`,
        lastModified: u.date,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...modes, ...characters, ...updates];
}
