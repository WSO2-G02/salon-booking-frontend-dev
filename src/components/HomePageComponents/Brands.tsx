"use client";

import Image from "next/image";

export default function Brands() {
  const brands = [
    "https://www.salonliyo.com/assets/images/sub-logo-3.png",
    "https://www.salonliyo.com/assets/images/sub-logo-7.png",
    "https://www.salonliyo.com/assets/images/sub-logo-5.png",
    "https://www.salonliyo.com/assets/images/sub-logo-6.png",
    "https://www.salonliyo.com/assets/images/sub-logo-3.png",
    "https://www.salonliyo.com/assets/images/sub-logo-7.png",
    "https://www.salonliyo.com/assets/images/sub-logo-5.png",
    "https://www.salonliyo.com/assets/images/sub-logo-6.png",
  ];

  const loopBrands = [...brands, ...brands];

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">

      {/* Gold accent line */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Title */}
      <h2 className="text-center text-4xl font-bold text-gray-800 tracking-wide">
        Our Trusted Brands
      </h2>

      {/* Intro line */}
      <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
        At AURORA, we proudly collaborate with globally recognized beauty and
        styling brands to ensure unmatched quality in every service we deliver.
      </p>

      {/* Slider container */}
      <div className="relative w-full overflow-hidden mt-12">
        <div className="flex animate-slide gap-14 hover:pause-animation">
          {loopBrands.map((src, i) => (
            <div key={i} className="flex-shrink-0">
              <Image
                src={src}
                alt="brand"
                width={120}
                height={120}
                className="w-auto h-20 grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slider animation styles */}
      <style jsx>{`
        .animate-slide {
          animation: slide 20s linear infinite;
        }
        .pause-animation:hover {
          animation-play-state: paused;
        }
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
