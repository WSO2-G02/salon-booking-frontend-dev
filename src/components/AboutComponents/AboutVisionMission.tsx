"use client";
import Image from "next/image";
import visionMissionImg from "../../images/team.png";

export default function AboutVisionMission() {
  return (
    <section className="py-20 bg-black text-white">

      {/* Gold Accent */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-center mb-12 tracking-wide">
        Our Vision & Mission
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-5">

        {/* Image */}
        <div className="relative w-full h-72 md:h-80 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={visionMissionImg}
            alt="Aurora Salon Sri Lankan Team"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div>
          <p className="mb-6 leading-relaxed text-lg text-gray-300">
            <b className="text-yellow-400">Our Vision</b> is to redefine beauty and wellness in Sri Lanka by
            blending modern expertise with heartfelt Sri Lankan hospitality.
            We strive to create a space where elegance, care, and innovation meet.
          </p>

          <p className="leading-relaxed text-lg text-gray-300">
            <b className="text-yellow-400">Our Mission</b> is to deliver exceptional beauty services that
            uplift natural beauty, build confidence, and create memorable experiences—
            ensuring every client feels valued, pampered, and beautifully transformed.
          </p>
        </div>

      </div>
    </section>
  );
}
