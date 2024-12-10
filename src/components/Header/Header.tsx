"use client";
import Link from 'next/link';
import { useRouter } from 'next/router';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-center space-x-8">
        <Link href="/">
          <span className={`text-lg ${isActive('/') ? 'text-blue-400' : 'hover:text-gray-400'}`}>
            Home
          </span>
        </Link>
        <Link href="/user">
          <span className={`text-lg ${isActive('/user') ? 'text-blue-400' : 'hover:text-gray-400'}`}>
            User
          </span>
        </Link>
        <Link href="/transaction">
          <span className={`text-lg ${isActive('/transaction') ? 'text-blue-400' : 'hover:text-gray-400'}`}>
            Transaction
          </span>
        </Link>
        <Link href="/users">
          <span className={`text-lg ${isActive('/users') ? 'text-blue-400' : 'hover:text-gray-400'}`}>
            Users
          </span>
        </Link>
      </nav>
    </header>
  );
}
