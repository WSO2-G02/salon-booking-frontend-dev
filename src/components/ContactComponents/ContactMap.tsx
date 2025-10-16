'use client'

export default function ContactMap() {
  return (
    <section className="w-full h-[600px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.195460657798!2d79.88830887499606!3d6.865390920963288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25af63b27c5f7%3A0x8ef7cbd1998!2sSalon%20LIYO!5e0!3m2!1sen!2slk!4v1711437123705!5m2!1sen!2slk"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  )
}
