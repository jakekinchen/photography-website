import FooterNav from "./footer-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Footer = () => {
  return (
    <div className="flex flex-col items-center lg:items-start p-16 pb-12 gap-8 lg:gap-16 rounded-xl font-light relative flex-1 bg-primary text-white dark:text-black">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* AVATAR  */}
        <Avatar className="size-[60px]">
          <AvatarImage src="/avatar.jpg" alt="avatar" sizes="60px" />
          <AvatarFallback>JK</AvatarFallback>
        </Avatar>

        {/* NAME  */}
        <div className="flex flex-col items-center lg:items-start gap-[2px]">
          <h1 className="text-2xl">Jake Kinchen</h1>
          <p className="text-sm opacity-60">Photographer</p>
        </div>
      </div>
      <div className="grid lg:w-full grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-14">
        <FooterNav
          title="Pages"
          links={[
            { title: "Home", href: "/" },
            { title: "About", href: "/about" },
          ]}
        />
        <FooterNav
          title="Categories"
          links={[
            { title: "Portraits", href: "/gallery/portraits" },
            { title: "Landscapes", href: "/gallery/landscapes" },
            { title: "Events", href: "/gallery/events" },
            { title: "Real Estate", href: "/gallery/real-estate" },
          ]}
        />
      </div>

      {/* Attribution */}
      <div className="text-xs md:text-sm text-center md:text-left">
        <p>
          <span className="opacity-60">© {new Date().getFullYear()} </span>
          <a
            href="https://jakekinchen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Jake Kinchen
          </a>
          <span className="opacity-60">. All rights reserved.</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
