'use client'

export default function ContactMap() {
  return (
    <section className="w-full h-[600px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.113474207252!2d79.89085457312048!3d6.877006018958292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a408df7b141%3A0x41bc401ab19973cb!2s6%20Pagoda%20Rd%2C%20Nugegoda!5e0!3m2!1sen!2slk!4v1765522430453!5m2!1sen!2slk" 
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
}
