// Central content for the pitch demo.
// Anything the client hasn't supplied is flagged with sample: true
// and rendered with a [Sample — to be replaced] tag per spec Section 8.

export const WHATSAPP_NUMBER = "[TODO: client to provide WhatsApp number]";
export const WHATSAPP_NUMBER_LINK = "15551234567"; // placeholder digits, clearly marked in UI
export const waLink = (service = "your services") =>
  `https://wa.me/${WHATSAPP_NUMBER_LINK}?text=${encodeURIComponent(
    `Hi, I saw your new site and I'm interested in ${service}. Please send me a quote.`
  )}`;

const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const SERVICES = [
  {
    id: "custom",
    title: "Custom Furniture Building",
    blurb: "Beds, wardrobes, dining sets & fitted storage — built to your room, not to a catalogue.",
    img: u("photo-1555041469-a586c61ea9bc", 900),
    points: ["Free site measurement", "Solid joinery, honest materials", "Finish matched to your home"],
    sample: true,
  },
  {
    id: "repair",
    title: "Furniture Repair & Restoration",
    blurb: "Wobbles, broken joints, scratches, full refinish — we bring tired pieces back to life.",
    img: u("photo-1538688525198-9b88f6f53126", 900),
    points: ["Antique & modern pieces", "Re-polish, re-upholstery prep", "Before/after photo proof"],
    sample: true,
  },
  {
    id: "doors",
    title: "Aluminum Doors",
    blurb: "Slim, strong, rust-proof aluminum doors with secure locks and clean sightlines.",
    img: u("photo-1600607687939-ce8a6c25118c", 900),
    points: ["Powder-coated finishes", "Tempered / frosted glass", "Sound & dust sealing"],
    sample: true,
  },
  {
    id: "sliding",
    title: "Sliding Aluminum Doors",
    blurb: "Space-saving sliders for balconies, partitions & wardrobes — glide-tested before handover.",
    img: u("photo-1600566753086-00f18fb6b3ea", 900),
    points: ["2 / 3-track options", "Soft-close rollers", "Mosquito-mesh add-on"],
    sample: true,
  },
];

export const STATS = [
  { value: 12, suffix: "+", label: "Years in business", note: "[TODO: client to confirm]" },
  { value: 850, suffix: "+", label: "Projects completed", note: "[TODO: client to confirm]" },
  { value: 320, suffix: "+", label: "Doors installed", note: "[TODO: client to confirm]" },
  { value: 98, suffix: "%", label: "Clients who'd refer us", note: "[TODO: client to confirm]" },
];

// BEFORE/AFTER repair slots.
// To use real client photos: drop files into public/repairs/ and set
//   img: "/repairs/<slot>-after.jpg", beforeImg: "/repairs/<slot>-before.jpg"
// (beforeImg empty = filtered stand-in, demo keeps working until photos arrive).
export const BEFORE_AFTER = [
  {
    id: "table",
    title: "Antique dining table — full refinish",
    img: "/repairs/table-after.jpg",
    beforeImg: "/repairs/table-before.jpg",
    beforeFilter: "",
    sample: false,
  },
  {
    id: "chair",
    title: "Teak armchair — joint repair + re-polish",
    img: "/repairs/chair-after.jpg",
    beforeImg: "/repairs/chair-before.jpg",
    beforeFilter: "",
    sample: false,
  },
  {
    id: "wardrobe",
    title: "Wardrobe — shutter alignment + finish",
    img: "/repairs/wardrobe-after.jpg",
    beforeImg: "/repairs/wardrobe-before.jpg",
    beforeFilter: "",
    sample: false,
  },
  {
    id: "door",
    title: "Balcony slider — roller + seal overhaul",
    img: "/repairs/door-after.jpg",
    beforeImg: "/repairs/door-before.jpg",
    beforeFilter: "",
    sample: false,
  },
];

export const FINISHES = [
  { id: "black", name: "Matte Black", hex: "#1b1b1e", sample: false },
  { id: "bronze", name: "Bronze", hex: "#6b4a2f", sample: false },
  { id: "white", name: "Satin White", hex: "#f1f0ec", sample: false },
  { id: "silver", name: "Brushed Silver", hex: "#C7CBCF", sample: false },
  { id: "wood", name: "Wood-grain Effect", hex: "#A9764E", sample: false },
];

export const GLASS = [
  { id: "clear", name: "Clear", css: "linear-gradient(135deg,#dfeef2 0%,#bcd6dd 50%,#e8f3f5 100%)", color: "#cfe3e8", opacity: 0.22, roughness: 0.05 },
  { id: "frost", name: "Frosted", css: "linear-gradient(135deg,#eef1f2 0%,#d4dadc 100%)", color: "#eef1f1", opacity: 0.85, roughness: 0.6 },
  { id: "bronze-glass", name: "Bronze tint", css: "linear-gradient(135deg,#c9a173 0%,#8a5f36 60%,#d9b98c 100%)", color: "#b3814a", opacity: 0.55, roughness: 0.15 },
];

export const CASE_STUDY = {
  kicker: "Featured project",
  title: "A 3BHK that finally feels finished",
  body: [
    "Custom wardrobes in two bedrooms, a 6-seater dining set, and a 3-track balcony slider — measured once, built off-site, installed in 6 working days.",
    "The family sent us this photo a week after handover. Nothing wobbles, nothing sticks, and the slider glides with one finger.",
  ],
  img: u("photo-1616486338812-3dadae4b4ace", 1400),
  meta: ["Fitted wardrobes ×2", "Dining set ×1", "3-track slider ×1", "6-day install"],
  sample: true,
};

export const PROCESS = [
  { step: "01", title: "Consultation", text: "Call or WhatsApp photos + measurements. We visit for bigger jobs." },
  { step: "02", title: "Design", text: "Sketch, material & finish options with an honest fixed quote." },
  { step: "03", title: "Build / Install", text: "Workshop build + tidy on-site fitting. Floors protected, dust managed." },
  { step: "04", title: "Delivery", text: "Glide-test, polish check & walkthrough. Pay only when you're happy." },
];

export const PORTFOLIO = [
  { id: 1, cat: "Furniture", title: "Walnut dining set", img: u("photo-1519710164239-da123dc03ef4", 800), sample: true },
  { id: 2, cat: "Doors", title: "Balcony slider, bronze tint", img: u("photo-1600585154340-be6161a56a0c", 800), sample: true },
  { id: 3, cat: "Furniture", title: "Reading corner armchair", img: u("photo-1586023492125-27b2c045efd7", 800), sample: true },
  { id: 4, cat: "Doors", title: "Frosted partition slider", img: u("photo-1600607687939-ce8a6c25118c", 800), sample: true },
  { id: 5, cat: "Furniture", title: "Fitted wardrobe wall", img: u("photo-1595428774223-ef52624120d2", 800), sample: true },
  { id: 6, cat: "Furniture", title: "Lounge sofa, refinish", img: u("photo-1555041469-a586c61ea9bc", 800), sample: true },
  { id: 7, cat: "Doors", title: "Slim-frame entry door", img: u("photo-1600566753086-00f18fb6b3ea", 800), sample: true },
  { id: 8, cat: "Furniture", title: "Work-from-home desk", img: u("photo-1524758631624-e2822e304c36", 800), sample: true },
  { id: 9, cat: "Doors", title: "Wardrobe sliders", img: u("photo-1616486338812-3dadae4b4ace", 800), sample: true },
];

export const TESTIMONIALS = [
  { name: "Priya S. [Sample]", text: "They rebuilt our 20-year-old dining table. Guests assume it's brand new. The before/after photos say everything.", job: "Dining set refinish" },
  { name: "Rahim K. [Sample]", text: "Balcony slider installed in one day, no mess left behind. One-finger glide even after a year.", job: "3-track sliding door" },
  { name: "Anita & Vikram [Sample]", text: "Wardrobes fit wall-to-wall with zero gaps. Measurements were exact, price never moved.", job: "Fitted wardrobes" },
];
