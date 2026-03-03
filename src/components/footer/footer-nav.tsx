import Link from "next/link";

interface Props {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}

const FooterNav = ({ title, links }: Props) => {
  return (
    <div className="flex flex-col gap-8 items-center lg:items-start">
      <h1>{title}</h1>
      <ul className="flex flex-col items-center lg:items-start gap-3 lg:gap-5 text-sm opacity-60">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-text-default dark:text-text-inverse hover:underline underline-offset-2 transition-opacity hover:opacity-100"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNav;
