export default function AboutJourney() {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-10">Our Journey</h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-5">
        <div className="flex gap-4">
          <img src="https://th.bing.com/th/id/OIP.Dyg0mkJB-1o5_Yt_rPC9YwHaEo?w=287&h=180&c=7&r=0&o=7&cb=12&dpr=1.2&pid=1.7&rm=3" alt="Journey1"
            className="rounded-lg shadow-lg w-1/2 object-cover" />
          <img src="https://th.bing.com/th/id/OIP.Dyg0mkJB-1o5_Yt_rPC9YwHaEo?w=287&h=180&c=7&r=0&o=7&cb=12&dpr=1.2&pid=1.7&rm=3" alt="Journey2"
            className="rounded-lg shadow-lg w-1/2 object-cover" />
        </div>

        <div>
          <p className="text-lg leading-relaxed text-gray-700">
            Liyo Salon was founded on <b>September 15 th, 2009</b>, by Dhanushka Chathuranga at Highlevel Road, Wijerama, with a vision to provide exceptional beauty services.
            In 2012, to better serve our growing clientele, we expanded our services and relocated to a
            larger, more sophisticated space at Jambugasmulla, Nugegoda. This move allowed us to offer
            a wider range of services and enhance our client experience — further establishing our
            reputation for excellence in the beauty industry.
          </p>
        </div>
      </div>
    </section>
  )
}
