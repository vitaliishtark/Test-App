"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();

  const allLinks = [
    { href: "/", label: "Home" },
    { href: "/transaction", label: "Transactions" },
    { href: "/home", label: "Account Statement" },
    { href: "/users", label: "All Users" },
  ]

  return (
    <header className="bg-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-semibold">Banking App</h1>
        <nav className="w-full lg:w-auto mt-2 lg:mt-0">
          <ul className="flex flex-wrap justify-center lg:justify-end space-x-6">
            {allLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`hover:text-gray-300 ${
                    pathName === href ? "text-yellow-300 font-bold" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
