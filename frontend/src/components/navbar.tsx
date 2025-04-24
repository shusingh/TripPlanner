// components/navbar.tsx
import React, { useState } from 'react';
import { Link } from '@heroui/link';
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { GithubIcon, LinkedInIcon, DeveloperIcon } from '@/components/icons';

//–– your social / theme icons block
const NavActions: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <Link
      isExternal
      aria-label="Visit our GitHub repository"
      href={siteConfig.links.github}
    >
      <GithubIcon className="text-default-500" />
    </Link>
    <Link
      isExternal
      aria-label="Visit our LinkedIn page"
      href={siteConfig.links.linkedin}
    >
      <LinkedInIcon className="text-default-500" />
    </Link>
    <Link
      isExternal
      aria-label="Visit my portfolio"
      href={siteConfig.links.portfolio}
    >
      <DeveloperIcon className="text-default-500" />
    </Link>
    <ThemeSwitch />
  </div>
);

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* mobile: toggle + title */}
      <NavbarContent className="pl-4 sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        <h1 className="ml-4 text-xl font-semibold">AI Trip Planner</h1>
      </NavbarContent>

      {/* desktop: title left */}
      <NavbarContent className="hidden sm:flex" justify="start">
        <h1 className="text-xl font-semibold">AI Trip Planner</h1>
      </NavbarContent>

      {/* desktop: actions right */}
      <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem>
          <NavActions />
        </NavbarItem>
      </NavbarContent>

      {/* mobile: slide-down menu */}
      <NavbarMenu className="sm:hidden">
        <NavbarMenuItem>
          <NavActions className="flex flex-col gap-4 p-4" />
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
