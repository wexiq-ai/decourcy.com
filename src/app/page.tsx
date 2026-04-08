import MeshCanvas from "./components/MeshCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071a0e]">
      {/* <MeshCanvas /> */}
      <div className="relative z-10 text-center animate-fade-in">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.25em] uppercase select-none"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#1a4a2e",
            WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.45)",
          }}
        >
          D<span className="text-[0.75em]">E</span>COURCY.<span className="text-[0.75em]">COM</span>
        </h1>
      </div>
      <a
        href="mailto:wedecourcy@gmail.com"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/30 text-[0.8rem] tracking-[0.05em] no-underline"
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          opacity: 0,
          animation: "fadeIn 1.5s ease-out 4.5s forwards",
        }}
      >
        Contact Us
      </a>
    </div>
  );
}
