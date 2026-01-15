"use client";

export function HeroSection() {
  return (
    <section
      className="
        relative min-h-[90vh] flex items-center justify-center overflow-hidden
        bg-white text-slate-900
        dark:bg-black dark:text-white
      "
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,rgba(255,200,100,0.04)_1px,transparent_1px),
                linear-gradient(to_bottom,rgba(255,200,100,0.04)_1px,transparent_1px)]
            bg-size-[48px_48px]
            dark:bg-[linear-gradient(to_right,rgba(255,200,100,0.05)_1px,transparent_1px),
                     linear-gradient(to_bottom,rgba(255,200,100,0.05)_1px,transparent_1px)]
          "
        />

        {/* Dots */}
        <div
          className="
    absolute inset-0
    bg-[radial-gradient(circle,rgba(255,200,100,0.035)_1px,transparent_1px)]
    bg-size-[24px_24px]
    blur-[0.3px]
    dark:blur-0
    dark:bg-[radial-gradient(circle,rgba(255,200,100,0.1)_1px,transparent_1px)]
  "
        />

        {/* Glow */}
        <div
          className="
            absolute top-1/3 left-1/2 -translate-x-1/2
            h-105 w-105 rounded-full
            bg-orange-500/20 blur-[140px]
            dark:bg-orange-500/25
          "
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
          Real-time messaging
          <br />
          <span className="text-amber-500 dark:text-amber-400">
            built to scale
          </span>
        </h1>

        <p
          className="mt-6 text-lg max-w-2xl mx-auto
                      text-slate-600 dark:text-slate-400"
        >
          A modern messaging platform designed for event-driven systems,
          low-latency delivery, and production-grade reliability.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            className="
              px-6 py-3 rounded-lg font-medium transition
              bg-amber-500 hover:bg-amber-600
              text-black
            "
          >
            Get started
          </button>

          <button
            className="
              px-6 py-3 rounded-lg transition
              border border-slate-300 hover:border-amber-500/60
              text-slate-700
              dark:border-white/15 dark:hover:border-amber-400/60
              dark:text-slate-200
            "
          >
            View architecture
          </button>
        </div>
      </div>
    </section>
  );
}

export function Panel({ icon }: { icon: React.ReactNode }) {
  return (
    <div
      className="
        h-full w-full rounded-xl flex items-center justify-center
        border border-slate-200/60 dark:border-white/10
        bg-linear-to-br
        from-amber-500/20 via-orange-500/10 to-transparent
        dark:from-amber-500/25 dark:via-orange-500/10
      "
    >
      <div className="text-amber-500 dark:text-amber-400 text-3xl">{icon}</div>
    </div>
  );
}
