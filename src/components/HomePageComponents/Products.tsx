"use client";
import Image from "next/image";

export default function Products() {
  return (
    <section className="py-20 px-10 bg-gray-50">

      {/* Gold Accent */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6 tracking-wide">
        Our Products
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Text */}
        <div>
          <p className="text-lg leading-relaxed text-gray-700">
            Discover a premium selection of beauty and haircare products, carefully curated to provide 
            <span className="font-semibold"> salon-quality results</span> right at home. 
            Each item in our collection is handpicked by our expert stylists, ensuring that you experience the same level of care, 
            nourishment, and transformation that AURORA is known for within our salon.
          </p>

          <p className="text-lg leading-relaxed text-gray-700 mt-4">
            From professional-grade shampoos and conditioners to advanced styling 
            treatments and nourishing serums, every product reflects our commitment to excellence. 
            At AURORA, we choose only trusted and internationally recognized brands — guaranteeing 
            the highest standards of quality, safety, and effectiveness for every client who seeks 
            long-lasting beauty and confidence.
          </p>
        </div>

        {/* Image */}
        <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://www.salonliyo.com/assets/images/our-product.jpg"
            alt="AURORA Salon Products"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}

