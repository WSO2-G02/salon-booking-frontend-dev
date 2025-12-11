'use client'

export default function ContactMap() {
  return (
    <section className="w-full h-[600px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.707829460219!2d79.951678!3d6.968536999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f953f55d51e1%3A0x85e2f65ce42928d7!2sKeells%20Super%20-%20Eldeniya!5e0!3m2!1sen!2slk!4v1711445200000!5m2!1sen!2slk"
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
