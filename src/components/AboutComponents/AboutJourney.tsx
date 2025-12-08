"use client";
import Image from "next/image";

import journey1 from "../../images/image01.jpg";
import journey2 from "../../images/image02.jpg";

export default function AboutJourney() {
  return (
    <section className="py-20 bg-white">

      {/* Gold Accent */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Our Journey
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-5">

        {/* Images */}
        <div className="flex gap-4">
          <div className="relative w-1/2 h-56 md:h-64">
            <Image
              src={journey1}
              alt="AURORA Salon history"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>

          <div className="relative w-1/2 h-56 md:h-64">
            <Image
              src={journey2}
              alt="AURORA Salon interior"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-lg leading-relaxed text-gray-700">
            AURORA Salon was founded on <b>September 15, 2009</b> by Supun Siriwardhana at Highlevel Road, Wijerama, with a vision to provide
            exceptional beauty services. <br /><br />
            In 2012, as our clientele expanded, we moved to a larger and more
            sophisticated location in Jambugasmulla, Nugegoda. This expansion
            allowed us to broaden our services and elevate the overall client
            experience, strengthening our reputation as a leader in Sri Lanka’s
            beauty industry.
          </p>
        </div>

      </div>
    </section>
  );
}
