import { Link } from '@heroui/link';

import { Navbar } from '@/components/navbar';
import { siteConfig } from '@/config/site';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">
        {children}
      </main>
      <footer className="flex w-full items-center justify-center py-3">
        <span className="text-default-600">
          Made with ❤️ by{' '}
          <Link
            isExternal
            className="text-primary hover:opacity-80"
            href={siteConfig.links.linkedin}
          >
            Shubham Singh
          </Link>
        </span>
      </footer>
    </div>
  );
}
