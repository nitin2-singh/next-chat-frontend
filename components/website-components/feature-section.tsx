"use client";

import {
  Zap,
  Boxes,
  Database,
  Server,
  Shield,
  Activity,
  Network,
  Cpu,
  Cloud,
  Lock,
  Layers,
} from "lucide-react";

import { TracingBeam } from "@/components/ui/tracing-beam";
import { Panel } from "./hero-section";

export function FeatureSection() {
  return (
    <TracingBeam className="px-6">
      <section id="platform" className="max-w-7xl mx-auto py-28">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-amber-500/80 dark:text-amber-400/80">
            Platform
          </span>

          <h2
            className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight
                         text-slate-900 dark:text-white"
          >
            Live platform surface
          </h2>

          <p
            className="mt-4 leading-relaxed
                        text-slate-600 dark:text-slate-400"
          >
            Each layer of the system is designed to scale independently while
            maintaining predictable latency and operational clarity.
          </p>
        </div>

        {/* Lanes */}
        <div className="space-y-20">
          <Lane
            icon={<Zap />}
            title="Message Flow Engine"
            description="Event ingestion, fan-out, ordering, replay, throttling"
            panelIcon={<Network />}
          />

          <Lane
            icon={<Server />}
            title="WebSocket Fabric"
            description="Horizontally scaled, low-latency delivery mesh"
            panelIcon={<Cloud />}
          />

          <Lane
            icon={<Boxes />}
            title="In-Memory Signals"
            description="Presence, typing indicators, ephemeral session state"
            panelIcon={<Cpu />}
          />

          <Lane
            icon={<Database />}
            title="Durable Timeline"
            description="Persistent message history with replay support"
            panelIcon={<Layers />}
          />

          <Lane
            icon={<Shield />}
            title="Security Layer"
            description="Isolation, auth boundaries, replay protection"
            panelIcon={<Lock />}
          />

          <Lane
            icon={<Activity />}
            title="System Health"
            description="Consumer lag, routing health, delivery guarantees"
            panelIcon={<Activity />}
            accent="emerald"
          />
        </div>
      </section>
    </TracingBeam>
  );
}

function Lane({
  icon,
  title,
  description,
  panelIcon,
  accent = "amber",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  panelIcon: React.ReactNode;
  accent?: "amber" | "emerald";
}) {
  const accentColor =
    accent === "emerald"
      ? "text-emerald-500 dark:text-emerald-400"
      : "text-amber-500 dark:text-amber-400";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 items-center">
      {/* Left content */}
      <div className="flex gap-6">
        <div
          className={`
            h-12 w-12 rounded-xl flex items-center justify-center
            border border-slate-200/60 dark:border-white/10
            bg-slate-100 dark:bg-black/40
            ${accentColor}
          `}
        >
          {icon}
        </div>

        <div>
          <h3
            className="text-xl font-semibold tracking-tight
                         text-slate-900 dark:text-white"
          >
            {title}
          </h3>

          <p
            className="mt-2 leading-relaxed max-w-md
                        text-slate-600 dark:text-slate-400"
          >
            {description}
          </p>
        </div>
      </div>

      {/* Right visual */}
      <div className="relative h-48">
        <Panel
          icon={
            <span
              className={`
                ${accentColor} text-4xl
                transition-transform duration-300
                hover:scale-110
              `}
            >
              {panelIcon}
            </span>
          }
        />
      </div>
    </div>
  );
}
