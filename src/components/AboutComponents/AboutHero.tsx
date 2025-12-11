import hero from '../../images/aboutHero.png';

export default function AboutHero() {
  return (
    <section
      className="relative h-[70vh] bg-cover bg-center flex items-center px-10 text-white"
      style={{ backgroundImage: `url(${hero.src})` }}
    >
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">About AURORA Salon</h1>
        <p className="text-lg leading-relaxed">
          Discover our journey of excellence and commitment to transforming beauty in Sri Lanka.
        </p>
      </div>
    </section>
  );
}
