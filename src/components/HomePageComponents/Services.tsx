export default function Services() {
  const services = [
    { title: "Grooming & Styling", img: "https://www.salonliyo.com/assets/images/our-service.png", desc: "Professional cuts, trims, and styles for every occasion." },
    { title: "Facial & Spa", img: "https://www.salonliyo.com/assets/images/our-product.jpg", desc: "Relax and rejuvenate with premium spa treatments." },
  ]

  return (
    <section className="py-20 px-10 grid md:grid-cols-2 gap-10 items-center bg-white">
      {services.map((s, i) => (
        <div key={i} className="flex gap-6">
          <img src={s.img} className="rounded-lg w-1/2 object-cover" />
          <div>
            <h2 className="text-3xl font-bold mb-2">{s.title}</h2>
            <p>{s.desc}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
