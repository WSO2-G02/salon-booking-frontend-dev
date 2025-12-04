import Image from 'next/image'

export default function Products() {
  return (
    <section className="py-20 px-10 bg-gray-50 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-4xl font-bold mb-4">Our Products</h2>
        <p>Discover the finest selection of beauty products carefully curated to ensure you achieve salon-quality results at home.</p>
      </div>
      <Image
        src="https://www.salonliyo.com/assets/images/our-product.jpg"
        alt="Products"
        width={500}
        height={400}
        className="rounded-lg"
      />
    </section>
  )
}
