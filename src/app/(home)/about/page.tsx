// External dependencies
import { type Metadata } from "next";
import Image from "next/image";

// Internal dependencies - UI Components
import Footer from "@/components/footer";
import AboutCard from "../../../modules/home/ui/components/about-card";
import TechMarquee from "@/components/tech-marquee";
import CameraCard from "../../../modules/home/ui/components/camera-card";
import ProfileCard from "../../../modules/home/ui/components/profile-card";
import CardContainer from "@/components/card-container";
import VectorCombined from "@/components/vector-combined";

export const metadata: Metadata = {
  title: "About",
  description: "About page",
};

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
        <div className="w-full h-full relative rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-7 gap-2 h-full w-full bg-muted p-2">
            <div className="relative col-span-1 row-span-3 overflow-hidden rounded-lg">
              <Image
                src="/about/about-1.jpg"
                alt="About gallery image 1"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative col-span-1 row-span-2 overflow-hidden rounded-lg">
              <Image
                src="/about/about-2.jpg"
                alt="About gallery image 2"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative col-span-1 row-span-3 overflow-hidden rounded-lg">
              <Image
                src="/about/about-3.jpg"
                alt="About gallery image 3"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative col-span-1 row-span-4 overflow-hidden rounded-lg">
              <Image
                src="/about/about-4.jpg"
                alt="About gallery image 4"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative col-span-2 row-span-1 overflow-hidden rounded-lg">
              <Image
                src="/about/about-5.jpg"
                alt="About gallery image 5"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="absolute right-0 bottom-0">
            <VectorCombined title="About" position="bottom-right" />
          </div>
        </div>
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* PROFILE CARD  */}
        <ProfileCard />

        {/* ABOUT CARD  */}
        <AboutCard />

        {/* TECH CARD  */}
        <TechMarquee />

        {/* CAMERA CARD  */}
        <CameraCard />

        <CardContainer>
          <div className="flex items-center justify-between p-6">
            <h1 className="text-lg">SONY</h1>
            <p className="text-sm">Alpha 7RⅡ</p>
          </div>
        </CardContainer>

        <CardContainer>
          <div className="flex items-center justify-between p-6">
            <h1 className="text-lg">DJI</h1>
            <p className="text-sm">Air 2S</p>
          </div>
        </CardContainer>

        <CardContainer>
          <div className="flex items-center justify-between p-6">
            <h1 className="text-lg">Tamron</h1>
            <p className="text-sm">50-400mm F/4.5-6.3 Di III VC VXD</p>
          </div>
        </CardContainer>

        <CardContainer>
          <div className="flex items-center justify-between p-6">
            <h1 className="text-lg">Sigma</h1>
            <p className="text-sm">35mm F/1.4 DG HSM</p>
          </div>
        </CardContainer>

        <CardContainer>
          <div className="flex items-center justify-between p-6">
            <h1 className="text-lg">Viltrox</h1>
            <p className="text-sm">AF 40mm F/2.5 FE</p>
          </div>
        </CardContainer>

        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
