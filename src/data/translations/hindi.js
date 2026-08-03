/**
 * HINDI TRANSLATIONS DICTIONARY (100% Hindi Coverage)
 */

export const hindiTranslations = {
  botName: "विमल आई असिस्टेंट",
  onlineStatus: "ऑनलाइन • रिसेप्शनिस्ट",
  welcome: "नमस्ते! 👋 विमल आई हॉस्पिटल, लातूर में आपका स्वागत है। आज मैं आपकी क्या सहायता कर सकता हूँ?",
  inputPlaceholder: "संदेश लिखें या प्रश्न पूछें...",
  send: "भेजें",
  typingText: "AI उत्तर लिख रहा है...",
  quickActionTitle: "त्वरित विकल्प",
  
  // Appointment Flow Prompts
  stepNamePrompt: "📅 **अपॉइंटमेंट बुकिंग**\n\nकृपया अपना **पूरा नाम** दर्ज करें:",
  stepPhonePrompt: "धन्यवाद **{name}**! कृपया अपना **10-अंकों का मोबाइल नंबर** दर्ज करें:",
  stepAgePrompt: "कृपया अपनी **आयु (Age)** चुनें या लिखें:",
  stepGenderPrompt: "कृपया अपना **लिंग (Gender)** चुनें:",
  stepTreatmentPrompt: "आपको किस **इलाज / ओपीडी विशेषज्ञता** की आवश्यकता है?",
  stepDatePrompt: "अपनी **पसंदीदा तिथि (Date)** चुनें:",
  stepTimePrompt: "चुनी गई तिथि: **{date}**\n\nकृपया अपना **पसंदीदा समय (Time Slot)** चुनें:",
  stepConfirmPrompt: "📋 **कृपया अपने अपॉइंटमेंट विवरण की पुष्टि करें:**\n\n• **नाम**: {name}\n• **मोबाइल**: +91 {phone}\n• **आयु**: {age}\n• **लिंग**: {gender}\n• **इलाज**: {treatment}\n• **तिथि**: {date}\n• **समय**: {time}",
  
  // Validation Messages
  valNameErr: "कृपया केवल अक्षरों वाला वैध नाम दर्ज करें (संख्याएं नहीं)।",
  valPhoneErr: "कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होने वाला)।",
  valAgeErr: "कृपया सही आयु दर्ज करें।",
  valDateErr: "कृपया आने वाली वैध तिथि चुनें।",

  // Confirmation Action Buttons
  btnConfirm: "✅ अपॉइंटमेंट पक्का करें",
  btnEdit: "✏ विवरण बदलें",
  btnCancel: "❌ रद्द करें",

  // Success & Error Responses
  appointmentSuccess: "🎉 **अपॉइंटमेंट अनुरोध सफलतापूर्वक सबमिट हो गया है!**\n\nहमारा ओपीडी रिसेप्शन डेस्क जल्द ही आपके मोबाइल नंबर **+91 {phone}** पर संपर्क करके टोकन की पुष्टि करेगा।",
  enquirySuccess: "📩 **पूछताछ सफलतापूर्वक सबमिट हो गई है!**\n\nधन्यवाद! हमारी टीम जल्द ही आपसे संपर्क करेगी।",
  submitError: "अभी अनुरोध सबमिट करने में असमर्थ। कृपया पुनः प्रयास करें या +91 98765 43210 पर कॉल करें।",
  missingInfoFallback: "मेरे पास अभी यह विशेष जानकारी उपलब्ध नहीं है। कृपया अस्पताल हेल्पलाइन +91 98765 43210 पर संपर्क करें।",
  
  // Buttons
  btnRetry: "पुनः प्रयास करें",
  btnCallUs: "अस्पताल को कॉल करें",
  btnClose: "बंद करें",

  // Gender Labels
  genderMale: "पुरुष (Male)",
  genderFemale: "महिला (Female)",
  genderOther: "अन्य (Other)",

  // Treatments
  treatmentCat: "🔬 माइक्रो-फेको मोतियाबिंद सर्जरी",
  treatmentLasik: "👁 100% ब्लेड-फ्री लेसिक लेजर",
  treatmentRetina: "👁 रेटिना एवं विट्रेओरेटल इलाज",
  treatmentGlaucoma: "🧿 काला मोतिया (ग्लूकोमा) केयर",
  treatmentPediatric: "👶 बाल नेत्र रोग (Pediatric)",
  treatmentOpd: "🩺 सामान्य आंख ओपीडी जांच",

  // Quick Action Labels
  qaBook: "अपॉइंटमेंट बुक करें",
  qaDoctors: "हमारे डॉक्टर्स",
  qaTreatments: "इलाज और सर्जरी",
  qaFees: "ओपीडी फीस",
  qaLocation: "अस्पताल का पता",
  qaTimings: "ओपीडी समय",
  qaReviews: "रोगी समीक्षाएं",
  qaGallery: "फोटो गैलरी",
  qaTour: "360° वर्चुअल टूर",
  qaContact: "संपर्क करें",
  qaEnquiry: "पूछताछ भेजें",
};
