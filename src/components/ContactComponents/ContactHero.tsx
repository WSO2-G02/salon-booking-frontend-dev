'use client'

export default function ContactHero() {
  return (
    <section
      className="relative h-[70vh] bg-cover bg-center flex items-center justify-start text-white px-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Contact</h1>
        <p className="text-lg drop-shadow-md">
          Premier destination for professional care and beauty — delivering
          excellence and personalized treatments since 2009.
        </p>
      </div>
    </section>
  )
}
