import Contact from "../components/Contact.jsx";

export default function ContactPage() {
  return (
    <div className="pt-16">
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Contact</p>
            <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Get in touch.
            </h1>
            <p className="mt-4 text-cream/70">
              Fastest route is WhatsApp. Send photos + rough size for a first estimate. Or leave the form and we'll call back.
            </p>
          </div>
        </div>
      </section>
      <Contact />
    </div>
  );
}
