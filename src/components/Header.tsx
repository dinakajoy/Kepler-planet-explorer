import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 px-4 shadow-md mb-20">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2">Exoplanet Explorer</h1>
        <p className="text-sm sm:text-base max-w-2xl">
          Discover and analyze exoplanets beyond our solar system. Use
          data-driven insights to explore planetary properties and assess
          habitability conditions.
        </p>
        <nav className="flex flex-col sm:flex-row mt-4 gap-6">
          <Link href="/" className="text-blue-400 hover:underline">
            🏠 Home
          </Link>
          <Link
            href="/exoplanet-explorer"
            className="text-blue-400 hover:underline"
          >
            🌍 Exoplanet Explorer
          </Link>
          <Link
            href="/habitability-checker"
            className="text-blue-400 hover:underline"
          >
            🔎 Habitability Checker
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
