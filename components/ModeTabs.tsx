import Link from 'next/link';
import { GameMode } from '@/lib/types';
import clsx from 'clsx';

interface ModeTabsProps {
    modes: GameMode[];
    currentMode: string;
}

export function ModeTabs({ modes, currentMode }: ModeTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {modes.map((mode) => (
                <Link
                    key={mode.id}
                    href={mode.slug === 'tier-list' ? '/tier-list' : `/tier-list/${mode.slug}`}
                    className={clsx(
                        "px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base",
                        currentMode === mode.slug
                            ? "bg-hsr-purple text-white"
                            : "bg-hsr-card text-gray-400 hover:text-white border border-hsr-border hover:border-hsr-purple/50"
                    )}
                >
                    {mode.name}
                </Link>
            ))}
        </div>
    );
}
