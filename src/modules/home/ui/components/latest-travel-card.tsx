import Link from "next/link";

const categories = [
  { label: "Portraits", href: "/gallery/portraits" },
  { label: "Landscapes", href: "/gallery/landscapes" },
  { label: "Events", href: "/gallery/events" },
  { label: "Real Estate", href: "/gallery/real-estate" },
];

const LatestTravelCard = () => {
  return (
    <div className="p-4 lg:p-5 bg-muted rounded-xl w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-light">Photo Categories</p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="relative text-sm font-light group"
          >
            {category.label}
            <span className="absolute -bottom-[2px] left-0 w-full h-px bg-black dark:bg-white transition-all duration-300 transform ease-in-out group-hover:w-1/3" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestTravelCard;
