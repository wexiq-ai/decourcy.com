import MeshCanvas from "./components/MeshCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071a0e]">
      <MeshCanvas />
      <div className="relative z-10 text-center animate-fade-in">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.25em] uppercase select-none"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            color: "#1a4a2e",
            WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.45)",
          }}
        >
          D<span className="text-[0.75em]">E</span>COURCY.<span className="text-[0.75em]">COM</span>
        </h1>
      </div>
    </div>
  );
}
