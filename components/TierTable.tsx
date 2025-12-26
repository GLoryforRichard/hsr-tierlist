import Link from 'next/link';
import Image from 'next/image';
import { Character } from '@/lib/types';
import clsx from 'clsx';

interface TierTableProps {
    characters: Character[];
    mode: string;
}

const TIER_ORDER = ['S', 'A', 'B', 'C', 'D'];
const TIER_COLORS: Record<string, string> = {
    S: 'bg-red-500/20 text-red-500 border-red-500/30',
    A: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    B: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    C: 'bg-green-500/20 text-green-500 border-green-500/30',
    D: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
};

export function TierTable({ characters, mode }: TierTableProps) {
    // Group characters by tier
    const grouped = characters.reduce((acc, char) => {
        const tier = char.tiers[mode as keyof typeof char.tiers] || 'D';
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(char);
        return acc;
    }, {} as Record<string, Character[]>);

    // Sort tiers
    const activeTiers = TIER_ORDER.filter(t => grouped[t]?.length > 0);

    return (
        <div className="space-y-4">
            {activeTiers.map((tier) => (
                <div key={tier} className="flex flex-col md:flex-row gap-4 bg-hsr-card border border-hsr-border rounded-xl overflow-hidden">
                    {/* Tier Label */}
                    <div className={clsx(
                        "flex items-center justify-center p-4 md:w-24 shrink-0 font-bold text-3xl border-b md:border-b-0 md:border-r border-hsr-border",
                        TIER_COLORS[tier] || TIER_COLORS.D
                    )}>
                        {tier}
                    </div>

                    {/* Character Grid */}
                    <div className="flex-grow p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {grouped[tier].map((char) => (
                            <Link href={`/characters/${char.slug}`} key={char.id} className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-hsr-purple transition-all bg-gray-800">
                                    {char.gameId ? (
                                        <Image
                                            src={`/assets/icon/character/${char.gameId}.png`}
                                            alt={char.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 bg-black/40">
                                            {char.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-gray-200 group-hover:text-hsr-purple transition-colors truncate w-full max-w-[100px]">{char.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">{char.element}/{char.path}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
