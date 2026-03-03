import Logo from "./logo";
import FlipLink from "@/components/flip-link";
import { ThemeSwitch } from "@/components/theme-toggle";

const Navbar = () => {
  return (
    <nav>
      <div className="flex items-center gap-5 pb-3 px-4 relative">
        <Logo />
        <div className="hidden lg:flex gap-4">
          <FlipLink href="/gallery/portraits">Portraits</FlipLink>
          <FlipLink href="/gallery/landscapes">Landscapes</FlipLink>
          <FlipLink href="/gallery/events">Events</FlipLink>
          <FlipLink href="/gallery/real-estate">Real Estate</FlipLink>
          <FlipLink href="/about">About</FlipLink>
        </div>
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
