/**
 * VIMAL EYE HOSPITAL — CENTRALIZED HOSPITAL CONFIGURATION
 * Single source of truth for AI Assistant & App Data
 */

export const hospitalConfig = {
  name: "Vimal Eye Hospital",
  tagline: "Superspeciality Eye Care & Laser Center",
  subTitle: "Sub-specialty Ophthalmic Surgery & Laser Institute",
  city: "Latur",
  state: "Maharashtra",
  pincode: "413512",
  address: "Opposite Shantai Hotel, Ambejogai Road, Shivaji Chowk, Latur – 413512, Maharashtra",
  landmark: "Opposite Shantai Hotel, Shivaji Chowk",

  contact: {
    phone: "+91 98765 43210",
    phoneRaw: "+919876543210",
    emergency: "+91 98765 43211",
    emergencyRaw: "+919876543211",
    email: "pradhumanmali2@gmail.com",
    instagram: "https://www.instagram.com/vimaleyehospitallatur/?__pwa=1#",
    googleMaps: "https://www.google.com/maps/place/Vimal+Eye+Hospital/@18.4017529,76.5646892,17z/data=!4m16!1m9!3m8!1s0x3bcf85802fe200ef:0xb5c36a10647049c0!2sVimal+Eye+Hospital",
  },

  timings: {
    opdDays: "Monday to Saturday",
    opdHours: "9:00 AM – 8:00 PM",
    emergency: "Available for urgent eye trauma / emergencies",
    sundayStatus: "Sunday by prior appointment for emergencies",
  },

  fees: {
    generalOpd: "₹300 – ₹500",
    specialistConsultation: "₹500 – ₹700",
    followUp: "Free within 10 days of OPD",
    paymentModes: ["Cash", "UPI / GPay / PhonePe", "Credit / Debit Cards", "Medical Insurance / Cashless"],
  },

  doctors: [
    {
      name: "Dr. Vimal Mali",
      title: "Senior Ophthalmic Surgeon & Medical Director",
      degrees: "MBBS, MS (Ophthalmology), FICO (UK)",
      experience: "20+ Years Experience",
      specialties: ["Micro-Phaco Cataract Surgery", "Blade-Free LASIK Laser", "Vitreoretinal Surgery"],
    },
    {
      name: "Dr. Ananya Mali",
      title: "Consultant Cornea & Glaucoma Specialist",
      degrees: "MBBS, DO, DNB (Ophthalmology)",
      experience: "14+ Years Experience",
      specialties: ["Glaucoma Medical & Surgical Care", "Pediatric Ophthalmology", "Dry Eye & Cornea"],
    },
  ],

  treatments: [
    {
      id: "cataract",
      title: "Micro-Phaco Cataract Surgery",
      shortDesc: "Stitchless, painless 10-minute micro-incision cataract removal with premium monofocal, multifocal, & toric IOL lenses.",
      procedure: "Phacoemulsification under topical numbing drops",
      recovery: "Clear vision in 24-48 hours",
      priceRange: "₹15,000 – ₹45,000 per eye (depending on lens choice)",
    },
    {
      id: "lasik",
      title: "100% Blade-Free LASIK Laser",
      shortDesc: "Ultra-precision laser vision correction for permanent freedom from glasses & contact lenses.",
      eligibility: "Age 18+ with stable prescription for >1 year",
      recovery: "Next-day recovery with 20/20 vision potential",
      priceRange: "₹25,000 – ₹55,000 both eyes",
    },
    {
      id: "retina",
      title: "Vitreoretinal & Diabetic Retina Care",
      shortDesc: "Advanced retinal laser, anti-VEGF intravitreal injections, & micro-incision vitrectomy for diabetic retinopathy & retinal detachment.",
      recovery: "Monitored retinal rehab",
    },
    {
      id: "glaucoma",
      title: "Glaucoma Screening & Pressure Care",
      shortDesc: "Early intraocular pressure (IOP) detection, optical coherence tomography (OCT), visual field testing & trabeculectomy laser.",
      recovery: "Long-term vision preservation",
    },
    {
      id: "pediatric",
      title: "Pediatric Ophthalmology & Squint Care",
      shortDesc: "Specialized child eye exams, amblyopia (lazy eye) therapy, congenital cataract & squint correction surgery.",
    },
    {
      id: "cornea",
      title: "Cornea & Dry Eye Specialty Clinic",
      shortDesc: "Advanced tear film analyzer, Pterygium excision with autograft, and corneal infection management.",
    },
  ],

  facilities: [
    "Ultra-Clean Modular Operation Theatres with HEPA Laminar Air Flow",
    "Carl Zeiss & Alcon Micro-Phacoemulsification Platforms",
    "Digital Optical Coherence Tomography (OCT) & Fundus Camera",
    "Automated Computerized Refraction & Tonometry",
    "24-Hour Emergency Ocular Trauma Desk",
    "In-House Optical Shop & Pharmacy",
    "Air-Conditioned Waiting Lounge with Patient Amenities",
  ],

  faqs: [
    {
      q: "What are the OPD timings?",
      a: "Our OPD is open Monday to Saturday from 9:00 AM to 8:00 PM at Shivaji Chowk, Ambejogai Road, Latur.",
    },
    {
      q: "Is cataract surgery painful?",
      a: "No! Micro-phaco cataract surgery is completely painless, stitchless, and performed using anesthetic eye drops without injections in most cases.",
    },
    {
      q: "Am I eligible for LASIK laser?",
      a: "Candidates aged 18+ with a stable glasses prescription for at least 1 year and healthy corneal thickness are eligible. We perform a pre-LASIK corneal topography test to confirm suitability.",
    },
    {
      q: "Do you accept health insurance for cashless cataract surgery?",
      a: "Yes, we support major health insurance policies, TPA cashless approvals, and government health schemes.",
    },
    {
      q: "How to book an appointment?",
      a: "You can book directly through this AI assistant, by clicking 'Book Appointment' on the website, or by calling our helpline at +91 98765 43210.",
    },
  ],
};
