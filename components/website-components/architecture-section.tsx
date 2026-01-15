"use client";

import {
  MessageSquare,
  Server,
  Zap,
  Boxes,
  Database,
  Send,
} from "lucide-react";

export function ArchitectureSection() {
  const steps = [
    { icon: MessageSquare, label: "Clients" },
    { icon: Server, label: "Gateways" },
    { icon: Zap, label: "Event Stream" },
    { icon: Boxes, label: "Cache Layer" },
    { icon: Database, label: "Persistence" },
    { icon: Send, label: "Delivery" },
  ];

  return (
    <section id="architecture" className="max-w-7xl mx-auto px-6 py-28">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <span
          className="font-mono text-xs uppercase tracking-wider
                         text-amber-500/80 dark:text-amber-400/80"
        >
          Architecture
        </span>

        <h2
          className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight
                       text-slate-900 dark:text-white"
        >
          Event-driven by design
        </h2>

        <p
          className="mt-4 leading-relaxed
                      text-slate-600 dark:text-slate-400"
        >
          Messages move through a predictable, observable pipeline designed for
          scale, ordering, and resilience.
        </p>
      </div>

      {/* Flow */}
      <div className="flex flex-wrap items-center gap-6">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-6">
            {/* Node */}
            <div
              className="
                h-16 w-16 rounded-xl flex items-center justify-center
                border border-slate-200/60 dark:border-white/10
                bg-slate-100 dark:bg-black/40
                text-amber-500 dark:text-amber-400
              "
            >
              <step.icon className="h-6 w-6" />
            </div>

            {/* Label */}
            <span
              className="text-sm
                             text-slate-700 dark:text-slate-300"
            >
              {step.label}
            </span>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className="
                  hidden md:block h-px w-10
                  bg-slate-300/60 dark:bg-white/15
                "
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
