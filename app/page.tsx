import Link from "next/link";
import { getSiteConfig, getGameModes, getLatestUpdate } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const site = getSiteConfig();
  const modes = getGameModes();
  const latestUpdate = getLatestUpdate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
      <section className="space-y-6 max-w-3xl">
        <div className="inline-block px-3 py-1 rounded-full bg-hsr-purple/20 text-hsr-purple text-sm font-medium border border-hsr-purple/30">
          Updated for v{site.currentVersion}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Honkai: Star Rail <br /> Tier List
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {site.description}
          <br />
          Data-driven rankings for MoC, Pure Fiction, and Apocalyptic Shadow.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/tier-list" className="bg-hsr-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-hsr-purple/90 transition-all flex items-center gap-2">
            View Overall Rankings <ArrowRight size={18} />
          </Link>
          <Link href="/characters" className="bg-hsr-card border border-hsr-border text-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-all">
            Character Index
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {modes.slice(1).map((mode) => (
          <Link key={mode.id} href={`/tier-list/${mode.slug}`} className="group relative overflow-hidden rounded-xl border border-hsr-border bg-hsr-card hover:border-hsr-purple/50 transition-colors p-6 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-hsr-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold mb-2 group-hover:text-hsr-purple transition-colors">{mode.name}</h3>
            <p className="text-sm text-gray-500">{mode.description}</p>
          </Link>
        ))}
      </section>

      <section className="w-full max-w-2xl border-t border-hsr-border pt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Latest Update <span className="text-xs bg-hsr-border px-2 py-0.5 rounded text-gray-400">v{latestUpdate.version}</span>
          </h2>
          <Link href={`/updates/${latestUpdate.version}`} className="text-sm text-hsr-purple hover:underline">
            Read Patch Notes
          </Link>
        </div>
        <div className="bg-hsr-card rounded-lg p-4 text-left border border-hsr-border">
          <p className="text-gray-300 mb-2">{latestUpdate.summary}</p>
          <ul className="text-sm text-gray-400 space-y-1">
            {latestUpdate.changes.slice(0, 3).map((change, i) => (
              <li key={i}>
                <span className="text-white font-medium">{change.character}</span>: {change.from} → {change.to} ({change.mode})
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
