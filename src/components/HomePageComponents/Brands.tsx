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
    "https://www.salonliyo.com/assets/images/sub-logo-3.png",
    "https://www.salonliyo.com/assets/images/sub-logo-7.png",
  ]

  return (
    <section className="py-10 bg-gray-100 flex justify-center gap-10 flex-wrap">
      {brands.map((src, i) => (
        <img key={i} src={src} alt="brand" className="h-20 w-auto grayscale hover:grayscale-0 transition" />
      ))}
    </section>
  )
}
