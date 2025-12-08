"use client";
import Image from "next/image";
import founderImg from "../../images/founder.png";

export default function AboutFounder() {
  return (
    <section className="py-20 bg-gray-50">

      {/* Gold Accent */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Meet Our Founder
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-5">

        {/* Founder Text */}
        <div>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Welcome to AURORA Salon Private Limited — your destination for luxury,
            beauty, and personalized care. Since our founding on 
            <b> September 15, 2009</b>, our mission has been to enhance natural beauty
            while empowering confidence in every client.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Our remarkable journey from Highlevel Road, Wijerama, to our elegant
            new space at Pagoda Road, Nugegoda, reflects our passion for
            excellence. With every step, we continue to embrace modern
            techniques, premium products, and an unwavering commitment to quality.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            I am proud of how far we’ve come and deeply grateful for the loyalty
            and trust of our clients. Together, we look forward to shaping the
            next chapter of beauty innovation and unforgettable experiences.
          </p>

          <h3 className="text-2xl font-bold text-gray-900">Supun Siriwardhana</h3>
          <p className="font-semibold text-gray-600">
            Founder, AURORA Salon (Pvt) Ltd
          </p>
        </div>

        {/* Founder Image */}
        <div className="relative w-full h-160 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={founderImg}
            alt="Founder of AURORA Salon"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
