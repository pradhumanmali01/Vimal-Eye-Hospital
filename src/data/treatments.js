export const treatmentsData = [
  {
    id: "cataract",
    title: "Cataract Surgery",
    category: "Surgical",
    tagline: "Micro-Incision Phacoemulsification & Premium Intraocular Lens Implantation",
    shortDescription: "Precision micro-incision phacoemulsification with customized Intraocular Lens (IOL) options.",
    overview: "Cataract is a clouding of the natural crystalline lens of the eye, causing blurred vision, glare sensitivity, and difficulty seeing at night. At Vimal Eye Hospital, we utilize modern micro-incision phacoemulsification technology and premium foldable intraocular lenses (Monofocal, Multifocal, and Toric IOLs) to restore visual clarity.",
    symptoms: [
      "Cloudy, foggy, or blurred vision",
      "Sensitivity to light glare and halos around headlights",
      "Frequent changes in spectacle prescription",
      "Faded color perception and difficulty reading"
    ],
    causes: [
      "Natural aging process affecting lens clarity",
      "Diabetes or prolonged systemic medication usage",
      "Previous ocular trauma or internal inflammation"
    ],
    process: [
      { step: "1. Diagnostic Evaluation", detail: "Optical biometry and ocular examination to accurately calculate required IOL power." },
      { step: "2. Topical Anesthesia", detail: "Numbing eye drops applied to ensure a comfortable, painless experience." },
      { step: "3. Phacoemulsification", detail: "A micro-incision allows ultrasound energy to gently break down and clear the clouded lens." },
      { step: "4. Lens Implantation", detail: "Insertion of a custom foldable Intraocular Lens (IOL) tailored for near and distance vision." }
    ],
    benefits: [
      "Micro-incision sutureless surgical technique",
      "Foldable IOL options for enhanced visual clarity",
      "Outpatient day-care procedure"
    ],
    faqs: [
      { question: "Is cataract surgery painful?", answer: "Topical numbing drops are applied prior to surgery, ensuring the procedure is painless." },
      { question: "How long does recovery take?", answer: "Most patients notice visual improvement within 24 to 48 hours, with routine activities resumed shortly." }
    ]
  },
  {
    id: "lasik",
    title: "LASIK & Laser Refractive Surgery",
    category: "Laser",
    tagline: "Advanced Laser Vision Correction for Spectacle Removal",
    shortDescription: "Precision laser reshaping of the cornea for myopia, hyperopia, and astigmatism.",
    overview: "LASIK (Laser-Assisted in Situ Keratomileusis) is a precision laser procedure designed to reshape the cornea and correct refractive errors including Myopia, Hyperopia, and Astigmatism. Vimal Eye Hospital offers customized corneal topography mapping to ensure accurate treatment planning.",
    symptoms: [
      "Dependence on glasses or contact lenses for daily activities",
      "Blurry distance or near vision",
      "Eye strain or headache associated with uncorrected refractive error"
    ],
    causes: [
      "Irregularity in corneal curvature or eyeball length preventing light from focusing directly on the retina."
    ],
    process: [
      { step: "1. Pre-LASIK Assessment", detail: "Corneal topography, pachymetry, and comprehensive ocular evaluation." },
      { step: "2. Precision Flap Creation", detail: "Creation of a ultra-smooth protective corneal flap." },
      { step: "3. Excimer Laser Reshaping", detail: "Computer-guided excimer laser gently reshapes the corneal tissue." },
      { step: "4. Natural Adhesion", detail: "Flap is repositioned into place, adhering naturally without sutures." }
    ],
    benefits: [
      "Fast vision correction procedure",
      "Freedom from reliance on glasses or contact lenses",
      "Quick return to routine work"
    ],
    faqs: [
      { question: "Am I eligible for LASIK?", answer: "Eligibility requires being at least 18 years old with stable vision for 1 year and a healthy corneal profile confirmed during Pre-LASIK testing." }
    ]
  },
  {
    id: "glaucoma",
    title: "Glaucoma Care & Management",
    category: "Specialized",
    tagline: "Intraocular Pressure Monitoring & Optic Nerve Preservation",
    shortDescription: "Comprehensive diagnostic screening, medical therapy, and surgical pressure control.",
    overview: "Glaucoma is an ocular condition caused by elevated Intraocular Pressure (IOP) that can damage the optic nerve. Early detection through OCT nerve imaging, visual field testing, and IOP tonometry is critical for preserving peripheral and central vision.",
    symptoms: [
      "Gradual, painless loss of peripheral vision",
      "Rainbow-colored halos around lights",
      "Severe eye pain and sudden redness in acute cases"
    ],
    causes: [
      "Impaired drainage of aqueous fluid raising internal eye pressure",
      "Family history of glaucoma or ocular hypertension"
    ],
    process: [
      { step: "1. Tonometry & Gonioscopy", detail: "Precise measurement of eye pressure and examination of fluid drainage angles." },
      { step: "2. OCT & Visual Field Analysis", detail: "Mapping optic nerve fiber layer integrity and visual field sensitivity." },
      { step: "3. Targeted Pressure Control", detail: "Customized medical eye drops, laser trabeculoplasty, or filtration surgery." }
    ],
    benefits: [
      "Early detection prevents irreversible visual field loss",
      "Customized target pressure management plan",
      "Sub-specialist monitoring"
    ],
    faqs: [
      { question: "Can glaucoma vision loss be restored?", answer: "Vision lost to optic nerve damage cannot be regained; however, timely treatment prevents further progression." }
    ]
  },
  {
    id: "retina",
    title: "Retina Care & Surgery",
    category: "Vitreoretinal",
    tagline: "Diagnostic OCT, Anti-VEGF Therapy & Vitreoretinal Surgery",
    shortDescription: "Specialized care for Diabetic Retinopathy, Macular Degeneration, and Retinal Detachment.",
    overview: "The retina is the light-sensitive neural tissue lining the back of the eye. Retinal conditions such as Diabetic Retinopathy, Age-Related Macular Degeneration (AMD), and Retinal Tears require specialized diagnostic imaging (OCT, Fundus photography) and targeted medical or surgical intervention.",
    symptoms: [
      "Sudden appearance of floaters or flashes of light",
      "Dark curtain or shadow obscuring part of visual field",
      "Distorted or wavy central vision"
    ],
    causes: [
      "Diabetic microvascular changes",
      "Retinal tears or age-related macular changes"
    ],
    process: [
      { step: "1. High-Definition Retinal Imaging", detail: "Spectral-domain OCT and fundus evaluation pinpoint retinal lesions." },
      { step: "2. Intravitreal & Laser Therapy", detail: "Retinal laser photocoagulation or targeted intravitreal anti-VEGF injections." },
      { step: "3. Micro-Incision Vitrectomy", detail: "Precision sutureless microsurgery for complex retinal detachments." }
    ],
    benefits: [
      "Advanced retinal imaging technology",
      "Targeted anti-VEGF therapy for macular edema",
      "Vitreoretinal surgical expertise"
    ],
    faqs: [
      { question: "When should floaters be evaluated immediately?", answer: "A sudden surge in new floaters accompanied by flashes of light warrants an immediate retina examination." }
    ]
  },
  {
    id: "pediatric",
    title: "Pediatric Eye Care",
    category: "Specialized",
    tagline: "Comprehensive Screening, Squint Evaluation & Amblyopia Care",
    shortDescription: "Child-friendly visual evaluation, amblyopia management, and squint correction.",
    overview: "Children require specialized ocular assessments tailored to their development. Vimal Eye Hospital offers visual acuity screening, retinoscopy, amblyopia (lazy eye) patching therapy, and non-surgical or surgical squint management in a supportive environment.",
    symptoms: [
      "Inward or outward misaligned eye position",
      "Frequent eye rubbing or sitting very close to screens",
      "Tilting head or covering one eye to view objects"
    ],
    causes: [
      "Uncorrected refractive error, extraocular muscle imbalance, or congenital factors."
    ],
    process: [
      { step: "1. Pediatric Retinoscopy", detail: "Objective refractive testing designed for infants and young children." },
      { step: "2. Binocular & Squint Assessment", detail: "Evaluation of ocular alignment and depth perception." },
      { step: "3. Tailored Visual Therapy", detail: "Corrective glasses, amblyopia patching, or surgical muscle alignment." }
    ],
    benefits: [
      "Child-friendly examination environment",
      "Early amblyopia therapy prevents permanent visual deficit",
      "Precision alignment for strabismus"
    ],
    faqs: [
      { question: "When should a child get their first eye checkup?", answer: "A screening at 6 months, 3 years, and before starting school is recommended." }
    ]
  },
  {
    id: "cornea",
    title: "Cornea Care & Cross-Linking",
    category: "Corneal",
    tagline: "Keratoconus Collagen Cross-Linking (C3R) & Corneal Management",
    shortDescription: "Diagnostics and therapy for Keratoconus, corneal infections, and dystrophies.",
    overview: "The cornea is the transparent front window of the eye. Conditions like Keratoconus (progressive corneal thinning) or corneal ulcers require specialized corneal topography, Collagen Cross-Linking (C3R), and targeted medical management to preserve structural integrity.",
    symptoms: [
      "Progressive visual blurring not fully corrected by standard glasses",
      "Photophobia (sensitivity to light) and persistent redness",
      "Irregular astigmatism"
    ],
    causes: [
      "Keratoconus structural weakening or corneal infectious keratitis."
    ],
    process: [
      { step: "1. Corneal Topography", detail: "Mapping corneal elevation and curvature profiles." },
      { step: "2. Collagen Cross-Linking (C3R)", detail: "Riboflavin and UV-light treatment to strengthen corneal collagen." },
      { step: "3. Specialized Lens Fitting", detail: "Fitting rigid gas-permeable or scleral lenses for irregular corneas." }
    ],
    benefits: [
      "Stops Keratoconus progression with C3R",
      "Advanced corneal mapping diagnostics",
      "Specialty contact lens options"
    ],
    faqs: [
      { question: "What is C3R?", answer: "C3R is a non-invasive procedure using UV light and riboflavin eye drops to strengthen the corneal structure and halt Keratoconus." }
    ]
  },
  {
    id: "dryeye",
    title: "Dry Eye Care Clinic",
    category: "Therapeutic",
    tagline: "Diagnostic Tear Evaluation & Meibomian Gland Therapy",
    shortDescription: "Tear film stability analysis and specialized treatment for chronic dry eye strain.",
    overview: "Prolonged screen exposure, environmental factors, and Meibomian Gland Dysfunction (MGD) can lead to tear film instability. Our dry eye clinic provides diagnostic tear assessment, Meibography, tear breakup evaluation, and targeted eyelid therapy.",
    symptoms: [
      "Burning, stinging, or gritty sensation in the eyes",
      "Watery eyes resulting from reflex tearing",
      "Eye fatigue during digital screen usage"
    ],
    causes: [
      "Meibomian gland blockage leading to rapid tear evaporation.",
      "Prolonged computer or smartphone screen time."
    ],
    process: [
      { step: "1. Tear Film Diagnostics", detail: "Evaluation of tear quantity, evaporation rate, and oil gland health." },
      { step: "2. Lubricating Therapy", detail: "Prescribing tailored tear supplements and protective gels." },
      { step: "3. In-Office Thermal Therapy", detail: "Expression and warming of blocked Meibomian glands for lasting comfort." }
    ],
    benefits: [
      "Targeted relief from chronic eye burning and fatigue",
      "Diagnostic tear breakup testing",
      "Customized screen care advice"
    ],
    faqs: [
      { question: "Why do dry eyes tear excessively?", answer: "Irritation on the corneal surface triggers reflex lacrimal tearing, but these tears lack essential lipids and evaporate quickly." }
    ]
  },
  {
    id: "diabetic",
    title: "Diabetic Eye Care",
    category: "Preventative",
    tagline: "Annual Retinal Screening & Diabetic Retinopathy Management",
    shortDescription: "Proactive annual diabetic eye screening, retinal laser, and macular swelling control.",
    overview: "Diabetes can silently affect microvascular vessels in the retina, leading to Diabetic Retinopathy or Macular Edema. Regular dilated retinal checkups, optical coherence tomography (OCT), and timely laser therapy preserve clear vision.",
    symptoms: [
      "Fluctuating visual sharpness",
      "Blurred central vision or dark patches in visual field",
      "Often zero symptoms in early treatable stages"
    ],
    causes: [
      "Elevated blood glucose levels causing vascular wall fragility in the retina."
    ],
    process: [
      { step: "1. Dilated Retinal Screening", detail: "High-resolution fundus inspection to detect micro-aneurysms early." },
      { step: "2. OCT Angiography", detail: "Assessing retinal thickness and macular swelling." },
      { step: "3. Retinal Stabilization", detail: "Targeted laser photocoagulation or anti-VEGF therapy when indicated." }
    ],
    benefits: [
      "Early detection prevents severe diabetes-related visual impairment",
      "Non-invasive screening protocol",
      "Coordination with your physician's diabetes reports"
    ],
    faqs: [
      { question: "How often should diabetic individuals get an eye exam?", answer: "An annual dilated retinal examination is recommended for all individuals with diabetes." }
    ]
  },
  {
    id: "general",
    title: "General Eye Checkup",
    category: "Wellness",
    tagline: "Comprehensive Visual Acuity & Ocular Health Screening",
    shortDescription: "Computerized vision evaluation, spectacle refraction, and slit-lamp eye testing.",
    overview: "Routine eye checkups are essential for detecting silent conditions early and maintaining sharp visual performance. Our general evaluation includes computerized auto-refraction, visual acuity testing, slit-lamp microscope check, and eye pressure measurement.",
    symptoms: [
      "Blurry distance or reading vision",
      "Digital eye strain or tension headaches",
      "Routine annual ocular health maintenance"
    ],
    causes: [
      "Refractive error changes or age-related vision shifts."
    ],
    process: [
      { step: "1. Computerized Refraction", detail: "Measuring prescription for distance and reading spectacles." },
      { step: "2. Slit-Lamp Examination", detail: "Microscopic evaluation of eyelids, cornea, and crystalline lens." },
      { step: "3. Eye Pressure Check", detail: "Tonometry measurement for routine glaucoma screening." }
    ],
    benefits: [
      "Accurate spectacle prescription update",
      "Early detection of silent ocular conditions",
      "Professional advice on screen ergonomics"
    ],
    faqs: [
      { question: "How long does a general checkup take?", answer: "A thorough checkup usually takes 30 to 45 minutes." }
    ]
  },
  {
    id: "emergency",
    title: "Emergency Eye Care",
    category: "Urgent",
    tagline: "Priority Response for Ocular Trauma, Foreign Objects & Chemical Injuries",
    shortDescription: "Urgent medical response for acute eye injuries, chemical exposure, and sudden vision loss.",
    overview: "Ocular emergencies require immediate clinical intervention to prevent vision impairment. Vimal Eye Hospital provides prompt triage for chemical splashes, foreign body impaction, blunt eye trauma, and acute painful red eye conditions.",
    symptoms: [
      "Sudden loss of vision in one or both eyes",
      "Chemical splashed into the eye",
      "Foreign object or dust particle trapped on corneal surface",
      "Severe eye pain, traumatic impact, or bleeding"
    ],
    causes: [
      "Industrial accidents, household chemical splashes, or acute ocular trauma."
    ],
    process: [
      { step: "1. Priority Triage", detail: "Immediate clinical assessment without delay." },
      { step: "2. Decontamination / Object Removal", detail: "Continuous sterile lavage for chemical exposure or microscopic foreign body removal." },
      { step: "3. Urgent Stabilization", detail: "Immediate medical or surgical intervention to protect the eye structure." }
    ],
    benefits: [
      "Priority triage without waiting queue",
      "Sterile emergency irrigation facilities",
      "Immediate vision-saving interventions"
    ],
    faqs: [
      { question: "What is the first step for a chemical splash?", answer: "Flush the eye continuously with clean water for 15 minutes without rubbing, then visit the emergency department immediately." }
    ]
  }
];
