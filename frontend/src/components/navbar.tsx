import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, LinkedInIcon, DeveloperIcon } from "@/components/icons";

interface NavActionsProps {
  className?: string;
}

const NavActions: React.FC<NavActionsProps> = ({ className }) => (
  <div className={`flex gap-4 items-center ${className}`}>
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
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <h1 className="text-xl font-semibold">AI Trip Planner</h1>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <NavActions />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavActions className="flex gap-2" />
        <NavbarMenuToggle aria-label="Toggle navigation menu" />
      </NavbarContent>
    </HeroUINavbar>
  );
};
