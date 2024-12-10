import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <header className="text-center text-3xl font-extrabold text-white">
        <h1>Welcome to Our Bank !</h1>
      </header>

      <footer className="text-center text-sm text-white">
        <p>&copy; 2024 Bank App</p>
      </footer>
    </div>
  );
}
