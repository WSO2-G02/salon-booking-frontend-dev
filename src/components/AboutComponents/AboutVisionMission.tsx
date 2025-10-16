export default function AboutVisionMission() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-5">
        <img
          src="https://th.bing.com/th/id/OIP.Jb8V4aalWUFQ_VcGTyHp2AHaEE?w=285&h=180&c=7&r=0&o=7&cb=12&dpr=1.2&pid=1.7&rm=3"
          alt="Our Team"
          className="rounded-lg shadow-lg object-cover w-full"
        />

        <div>
          <h2 className="text-4xl font-bold mb-6">Our Vision and Mission</h2>
          <p className="mb-6 leading-relaxed">
            <b>Our vision</b> is to set the standard for beauty and wellness in Sri Lanka by combining
            cutting-edge techniques with a personalized touch. We’re dedicated to continually
            improving our services and facilities to meet the evolving needs of our clients.
          </p>
          <p className="leading-relaxed">
            <b>Our mission</b> is to provide exceptional beauty services that enhance the natural
            beauty of our clients while creating a welcoming environment where every client feels
            valued and pampered.
          </p>
        </div>
      </div>
    </section>
  )
}
