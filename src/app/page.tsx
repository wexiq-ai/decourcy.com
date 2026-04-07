import MeshCanvas from "./components/MeshCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071a0e]">
      <MeshCanvas />
      <div className="relative z-10 text-center animate-fade-in">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-green-200 via-emerald-400 to-green-600 drop-shadow-lg select-none">
          DeCourcy.com
        </h1>
      </div>
    </div>
  );
}
