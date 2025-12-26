export interface SiteConfig {
    siteName: string;
    domain: string;
    language: string;
    currentVersion: string;
    lastUpdated: string;
    description: string;
}

export interface GameMode {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface CharacterTiers {
    overall: string;
    [key: string]: string; // scalable for mode IDs
}

export interface CharacterWhy {
    overall: string;
    [key: string]: string;
}

export interface BestTeam {
    name: string;
    core: string[];
    note: string;
}

export interface Character {
    id: string;
    name: string;
    slug: string;
    rarity: number;
    path: string;
    element: string;
    gameId?: string; // Internal game ID
    internalPathId?: string; // Mapped path ID for API
    tiers: CharacterTiers;
    oneLiner: string;
    why: CharacterWhy;
    bestTeams: BestTeam[];
    alternatives: string[];
    lastUpdated: string;
}

export interface UpdateChange {
    character: string;
    from: string;
    to: string;
    mode: string;
    reason: string;
}

export interface Update {
    version: string;
    date: string;
    summary: string;
    changes: UpdateChange[];
}
