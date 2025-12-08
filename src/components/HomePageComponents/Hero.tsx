export default function Hero() {
  return (
    <section className="relative h-[100vh] flex items-center justify-start text-white px-10 overflow-hidden">
      
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-top"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/1205.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text content */}
      <div className="relative z-10 max-w-lg">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Experience the Elegance of AURORA Salon
        </h1>
        <p className="text-lg drop-shadow-md">
          Where expert care meets luxurious services for a transformative beauty experience in Sri Lanka.
        </p>
      </div>

    </section>
  )
}
