/**
 * VIMAL EYE HOSPITAL — 360° VIRTUAL TOUR DATA REGISTRY
 * Maps all 17 equirectangular panorama images from /360/ directory.
 */

export const virtualTourRooms = [
  {
    id: 'main-reception',
    title: 'Main Reception & Entrance Suite',
    category: 'Reception & Lobby',
    image: '/360/main Street View 360.jpg',
    description: 'Premier reception lounge at Shivaji Chowk, Latur with 360° patient assistance desk.',
    featured: true,
    hotspots: [
      { id: 'hs-1', title: 'Walk to OPD Desk', targetId: 'opd-reception', pitch: -5, yaw: 45 },
      { id: 'hs-2', title: 'Optical & Spectacle Shop', targetId: 'optical-shop', pitch: -2, yaw: 135 },
      { id: 'hs-3', title: 'Executive Waiting Lounge', targetId: 'waiting-1', pitch: 0, yaw: -90 },
    ],
  },
  {
    id: 'opd-reception',
    title: 'OPD Assistance & Registration Desk',
    category: 'Reception & Lobby',
    image: '/360/5Street View 360.jpg',
    description: 'Dedicated patient registration and outpatient record management desk.',
    hotspots: [
      { id: 'hs-4', title: 'Main Entrance', targetId: 'main-reception', pitch: 0, yaw: 180 },
      { id: 'hs-5', title: 'Doctor Consultation Room', targetId: 'doctor-consultation', pitch: 0, yaw: 60 },
    ],
  },
  {
    id: 'optical-shop',
    title: 'Optical Store & Spectacle Suite',
    category: 'Reception & Lobby',
    image: '/360/Googalsshop 360.jpg',
    description: 'Complete range of anti-glare lenses, designer frames, and post-laser eyewear.',
    hotspots: [
      { id: 'hs-6', title: 'Main Reception', targetId: 'main-reception', pitch: 0, yaw: -120 },
    ],
  },
  {
    id: 'doctor-consultation',
    title: 'Senior Ophthalmologist Suite',
    category: 'Doctor & Diagnostics',
    image: '/360/doctor room eye checkup360.jpg',
    description: 'State-of-the-art consultation suite equipped with slit lamp and biomicroscopy.',
    hotspots: [
      { id: 'hs-7', title: 'Ophthalmic Exam Room', targetId: 'eye-checkup', pitch: 0, yaw: 90 },
      { id: 'hs-8', title: 'OPD Reception', targetId: 'opd-reception', pitch: 0, yaw: -90 },
    ],
  },
  {
    id: 'eye-checkup',
    title: 'Ophthalmic Examination Chamber',
    category: 'Doctor & Diagnostics',
    image: '/360/eye checkup360.jpg',
    description: 'Advanced diagnostic equipment for corneal biometry and intraocular pressure checks.',
    hotspots: [
      { id: 'hs-9', title: 'Optometry Diagnostic Suite', targetId: 'eye-test', pitch: 0, yaw: 45 },
      { id: 'hs-10', title: 'Doctor Suite', targetId: 'doctor-consultation', pitch: 0, yaw: -135 },
    ],
  },
  {
    id: 'eye-test',
    title: 'Optometry & Refraction Diagnostic Suite',
    category: 'Doctor & Diagnostics',
    image: '/360/eye test360.jpg',
    description: 'Digital visual acuity chart projectors and computerized auto-refractometers.',
    hotspots: [
      { id: 'hs-11', title: 'Exam Chamber', targetId: 'eye-checkup', pitch: 0, yaw: -45 },
    ],
  },
  {
    id: 'waiting-1',
    title: 'Executive Patient Waiting Lounge 1',
    category: 'Waiting Lounges',
    image: '/360/Waiting Area (1)360.jpg',
    description: 'Air-conditioned patient seating area with digital token display system.',
    hotspots: [
      { id: 'hs-12', title: 'Waiting Lounge 2', targetId: 'waiting-2', pitch: 0, yaw: 90 },
      { id: 'hs-13', title: 'Main Reception', targetId: 'main-reception', pitch: 0, yaw: -90 },
    ],
  },
  {
    id: 'waiting-2',
    title: 'Patient Waiting Lounge 2',
    category: 'Waiting Lounges',
    image: '/360/Waiting Area (2)360.jpg',
    description: 'Spacious patient waiting wing located adjacent to diagnostic testing rooms.',
    hotspots: [
      { id: 'hs-14', title: 'Waiting Lounge 3', targetId: 'waiting-3', pitch: 0, yaw: 120 },
    ],
  },
  {
    id: 'waiting-3',
    title: 'Family Waiting Lounge 3',
    category: 'Waiting Lounges',
    image: '/360/Waiting Area(3)360.jpg',
    description: 'Comfortable waiting area for accompanying family members and relatives.',
    hotspots: [
      { id: 'hs-15', title: 'Consultation Corridor', targetId: 'waiting-4', pitch: 0, yaw: 60 },
    ],
  },
  {
    id: 'waiting-4',
    title: 'Consultation Waiting Corridor 4',
    category: 'Waiting Lounges',
    image: '/360/Waiting Area(4)360.jpg',
    description: 'Direct waiting corridor leading to specialized OPD examination rooms.',
    hotspots: [
      { id: 'hs-16', title: 'Senior Doctor Suite', targetId: 'doctor-consultation', pitch: 0, yaw: 30 },
    ],
  },
  {
    id: 'ot-1',
    title: 'Micro-Phaco Cataract OT Suite 1',
    category: 'Surgical & OT',
    image: '/360/Operation Theatre(1)360.jpg',
    description: 'Ultra-sterile surgical suite dedicated to micro-incision cataract surgery (MICS).',
    hotspots: [
      { id: 'hs-17', title: 'LASIK Laser Suite 3', targetId: 'ot-3', pitch: 0, yaw: 90 },
      { id: 'hs-18', title: 'Recovery Ward', targetId: 'recovery-room', pitch: 0, yaw: -120 },
    ],
  },
  {
    id: 'ot-2',
    title: 'Modular Ophthalmic OT Suite 2',
    category: 'Surgical & OT',
    image: '/360/Operation Theatre(2)360.jpg',
    description: 'HEPA-filtered laminar airflow operating room for aseptic ocular procedures.',
    hotspots: [
      { id: 'hs-19', title: 'Cataract OT 1', targetId: 'ot-1', pitch: 0, yaw: -90 },
    ],
  },
  {
    id: 'ot-3',
    title: 'Blade-Free LASIK Laser Suite 3',
    category: 'Surgical & OT',
    image: '/360/Operation Theatre(3)360.jpg',
    description: 'Femtosecond laser platform for 100% blade-free laser vision correction.',
    hotspots: [
      { id: 'hs-20', title: 'Vitreoretinal OT 4', targetId: 'ot-4', pitch: 0, yaw: 60 },
    ],
  },
  {
    id: 'ot-4',
    title: 'Vitreoretinal Surgical OT Suite 4',
    category: 'Surgical & OT',
    image: '/360/Operation Theatre(4)360.jpg',
    description: 'High-end surgical microscope and vitrectomy console for retinal microsurgery.',
    hotspots: [
      { id: 'hs-21', title: 'Diagnostic OT 5', targetId: 'ot-5', pitch: 0, yaw: 90 },
    ],
  },
  {
    id: 'ot-5',
    title: 'Ocular Diagnostic OT Suite 5',
    category: 'Surgical & OT',
    image: '/360/Operation Theatre(5)360.jpg.jpg',
    description: 'Specialized suite for intravitreal injections and minor ophthalmic procedures.',
    hotspots: [
      { id: 'hs-22', title: 'Sterile Prep Room 6', targetId: 'ot-6', pitch: 0, yaw: 45 },
    ],
  },
  {
    id: 'ot-6',
    title: 'Sterile Preparation Suite 6',
    category: 'Surgical & OT',
    image: '/360/Operation Theatre(6)360.jpg',
    description: 'Pre-operative scrubbing and surgical sterilization station.',
    hotspots: [
      { id: 'hs-23', title: 'Recovery Ward', targetId: 'recovery-room', pitch: 0, yaw: -90 },
    ],
  },
  {
    id: 'recovery-room',
    title: 'Post-Operative Recovery Ward',
    category: 'Surgical & OT',
    image: '/360/Recovery Room.jpg',
    description: 'Monitored post-surgery recovery ward with dedicated nursing assistance.',
    hotspots: [
      { id: 'hs-24', title: 'Main OT Suite 1', targetId: 'ot-1', pitch: 0, yaw: 120 },
    ],
  },
];

export const virtualTourCategories = [
  'All',
  'Reception & Lobby',
  'Waiting Lounges',
  'Doctor & Diagnostics',
  'Surgical & OT',
];
