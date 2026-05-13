"use client";

import { useState } from "react";
import { LeadStarLogo } from "./LeadStarLogo";

export function ApiKeyGate({ onSubmit }: { onSubmit: (key: string) => void }) {
  const [value, setValue] = useState("");
  const [showing, setShowing] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#231f20]">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        <LeadStarLogo size="md" showPowered />
        <div className="w-full flex flex-col gap-3 mt-4">
          <label className="text-[0.625rem] tracking-[0.22em] uppercase text-white/55 font-medium text-center">
            EnrollHere API Key
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = value.trim();
              if (trimmed) onSubmit(trimmed);
            }}
            className="flex flex-col gap-3"
          >
            <div className="relative">
              <input
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                type={showing ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Paste your API key"
                className="w-full bg-white/[0.04] border border-[#eeb54e]/35 focus:border-[#eeb54e] focus:bg-white/[0.07] outline-none rounded px-4 py-3 text-white placeholder-white/30 text-sm tracking-[0.04em] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowing((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.625rem] tracking-[0.18em] uppercase text-white/45 hover:text-[#eeb54e] transition-colors"
              >
                {showing ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#eeb54e] hover:bg-[#f2c574] text-[#231f20] uppercase tracking-[0.18em] text-xs font-bold py-3 rounded transition-colors"
            >
              Continue
            </button>
          </form>
          <p className="text-[0.6875rem] text-white/40 text-center mt-2 leading-relaxed">
            Stored in your browser only. Never sent to DeCourcy.com servers except in transit
            to forward each request to EnrollHere.
          </p>
        </div>
      </div>
    </div>
  );
}
