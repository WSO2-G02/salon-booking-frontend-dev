"use client";

import { useState, useEffect } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      text: "Hi AURORA Team, today is my first experience with you... I highly recommend the AURORA team to you all.",
      name: "Shalika Prasadi",
      stars: 5,
    },
    {
      text: "Amazing service! Staff were incredibly friendly and professional. I felt truly pampered from start to finish.",
      name: "Dilini Perera",
      stars: 5,
    },
    {
      text: "Best salon experience I’ve ever had. The atmosphere is luxurious and the styling is top-notch.",
      name: "Maleesha Fernando",
      stars: 5,
    },
    {
      text: "AURORA never disappoints! My haircut and color came out even better than I expected.",
      name: "Tharushi Madushani",
      stars: 5,
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4500); // slide every 4.5s
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">

      {/* Decorative gold accent line */}
      <div className="flex justify-center mb-4">
        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Title */}
      <h2 className="text-center text-4xl font-bold text-gray-800 tracking-wide">
        What Our Clients Say
      </h2>

      {/* Intro line */}
      <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
        At AURORA, we take pride in delivering a premium beauty experience.  
        Here’s what our wonderful clients share about their time with us.
      </p>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-gray-50 to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-gray-50 to-transparent"></div>

      {/* Testimonial content */}
      <div className="max-w-4xl mx-auto text-center px-6 mt-12 transition-all duration-700 ease-in-out">
        <blockquote className="text-2xl italic text-gray-700 leading-relaxed">
          “{current.text}”
        </blockquote>

        <p className="mt-6 font-semibold text-xl text-gray-800">
          {current.name}
        </p>

        <p className="text-yellow-500 text-2xl mt-2">
          {"★".repeat(current.stars)}
        </p>
      </div>
    </section>
  );
}
