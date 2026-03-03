import CardContainer from "@/components/card-container";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-12 gap-[128px]">
        <h1 className="text-3xl">About</h1>
        <div className="flex flex-col gap-4 font-light">
          <p>
            Hey everyone! I&apos;ve been taking professional photos for the past 10 years of my life since I was in high school. Feel free to reach out to me here or on my instagram here to inquire about booking a photography session. I do everything from portraits, to events, to real estate, and even videography work. You can either use the form below, DM me on insta, or reach out directly to my email jakekinchen@gmail.com.
          </p>
          <p>
            Gear: Canon R8, Canon VCM 24mm f/1.4, Samyang 85mm f/1.4.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
