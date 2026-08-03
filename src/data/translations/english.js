/**
 * ENGLISH TRANSLATIONS DICTIONARY
 */

export const englishTranslations = {
  botName: "Vimal Eye Assistant",
  onlineStatus: "Online • Receptionist",
  welcome: "Hello! 👋 Welcome to Vimal Eye Hospital, Latur. How can I assist your vision care today?",
  inputPlaceholder: "Type a message or ask a question...",
  send: "Send",
  typingText: "AI is typing...",
  quickActionTitle: "Quick Actions",
  
  // Appointment Flow Prompts
  stepNamePrompt: "📅 **Appointment Booking**\n\nPlease enter your **Full Name**:",
  stepPhonePrompt: "Thank you **{name}**! Please enter your **10-digit Mobile Phone Number**:",
  stepAgePrompt: "Please select or type your **Age**:",
  stepGenderPrompt: "Please select your **Gender**:",
  stepTreatmentPrompt: "Select the **Eye Treatment / OPD Specialty** you require:",
  stepDatePrompt: "Select your **Preferred Appointment Date**:",
  stepTimePrompt: "Selected Date: **{date}**\n\nPlease select your **Preferred Time Slot**:",
  stepConfirmPrompt: "📋 **Please Confirm Your Appointment Details:**\n\n• **Name**: {name}\n• **Phone**: +91 {phone}\n• **Age**: {age}\n• **Gender**: {gender}\n• **Treatment**: {treatment}\n• **Date**: {date}\n• **Time Slot**: {time}",
  
  // Validation Messages
  valNameErr: "Please enter a valid name using letters only (no numbers).",
  valPhoneErr: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).",
  valAgeErr: "Please enter a valid positive age.",
  valDateErr: "Please select a valid upcoming date.",

  // Confirmation Action Buttons
  btnConfirm: "✅ Confirm Appointment",
  btnEdit: "✏ Edit Details",
  btnCancel: "❌ Cancel",

  // Success & Error Responses
  appointmentSuccess: "🎉 **Appointment Submitted Successfully!**\n\nOur OPD reception desk will call you at **+91 {phone}** shortly to confirm your token.",
  enquirySuccess: "📩 **Enquiry Submitted Successfully!**\n\nThank you! Our ophthalmic team will contact you shortly.",
  submitError: "Unable to submit request right now. Please try again or call +91 98765 43210.",
  missingInfoFallback: "I don't have that exact detail in my system yet. Please call our hospital desk at +91 98765 43210 for immediate assistance.",
  
  // Buttons
  btnRetry: "Retry",
  btnCallUs: "Call Hospital",
  btnClose: "Close",

  // Gender Labels
  genderMale: "Male",
  genderFemale: "Female",
  genderOther: "Other",

  // Treatments
  treatmentCat: "🔬 Micro-Phaco Cataract Surgery",
  treatmentLasik: "👁 100% Blade-Free LASIK Laser",
  treatmentRetina: "👁 Vitreoretinal & Retina Care",
  treatmentGlaucoma: "🧿 Glaucoma Clinic & Screening",
  treatmentPediatric: "👶 Pediatric Ophthalmology",
  treatmentOpd: "🩺 General Eye OPD Checkup",

  // Quick Action Labels
  qaBook: "Book Appointment",
  qaDoctors: "Our Doctors",
  qaTreatments: "Treatments",
  qaFees: "Consultation Fees",
  qaLocation: "Hospital Location",
  qaTimings: "OPD Timings",
  qaReviews: "Patient Reviews",
  qaGallery: "Gallery",
  qaTour: "360° Virtual Tour",
  qaContact: "Contact Hospital",
  qaEnquiry: "Send Enquiry",
};
