/**
 * MARATHI TRANSLATIONS DICTIONARY (100% Marathi Coverage)
 */

export const marathiTranslations = {
  botName: "विमल आय असिस्टंट",
  onlineStatus: "ऑनलाइन • रिसेप्शनिस्ट",
  welcome: "नमस्कार! 👋 विमल आय हॉस्पिटल, लातूर मध्ये आपले स्वागत आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
  inputPlaceholder: "संदेश लिहा किंवा प्रश्न विचारा...",
  send: "पाठवा",
  typingText: "AI उत्तर लिहीत आहे...",
  quickActionTitle: "जलद पर्याय",
  
  // Appointment Flow Prompts
  stepNamePrompt: "📅 **अपॉइंटमेंट बुकिंग**\n\nकृपया तुमचे **संपूर्ण नाव** लिहा:",
  stepPhonePrompt: "धन्यवाद **{name}**! कृपया तुमचा **10-अंकी मोबाईल नंबर** लिहा:",
  stepAgePrompt: "कृपया तुमचे **वय (Age)** निवडा किंवा लिहा:",
  stepGenderPrompt: "कृपया तुमचे **लिंग (Gender)** निवडा:",
  stepTreatmentPrompt: "तुम्हाला कोणत्या **उपचाराची / ओपीडी तज्ज्ञांची** गरज आहे?",
  stepDatePrompt: "तुमची **पसंतीची तारीख (Date)** निवडा:",
  stepTimePrompt: "निवडलेली तारीख: **{date}**\n\nकृपया तुमची **पसंतीची वेळ (Time Slot)** निवडा:",
  stepConfirmPrompt: "📋 **कृपया तुमच्या अपॉइंटमेंट माहितीची खात्री करा:**\n\n• **नाव**: {name}\n• **मोबाईल**: +91 {phone}\n• **वय**: {age}\n• **लिंग**: {gender}\n• **उपचार**: {treatment}\n• **तारीख**: {date}\n• **वेळ**: {time}",
  
  // Validation Messages
  valNameErr: "कृपया फक्त अक्षरे असलेले वैध नाव लिहा.",
  valPhoneErr: "कृपया 10-अंकी वैध भारतीय मोबाईल नंबर लिहा.",
  valAgeErr: "कृपया योग्य वय लिहा.",
  valDateErr: "कृपया येणारी वैध तारीख निवडा.",

  // Confirmation Action Buttons
  btnConfirm: "✅ अपॉइंटमेंट निश्चित करा",
  btnEdit: "✏ माहिती बदला",
  btnCancel: "❌ रद्द करा",

  // Success & Error Responses
  appointmentSuccess: "🎉 **तुमचा अपॉइंटमेंट अर्ज यशस्वीरीत्या सबमिट झाला आहे!**\n\nआमचे ओपीडी रिसेप्शन डेस्क लवकरच तुमच्या **+91 {phone}** नंबरवर संपर्क साधून टोकनची खात्री करेल.",
  enquirySuccess: "📩 **तुमची चौकशी यशस्वीरीत्या पाठवली गेली आहे!**\n\nधन्यवाद! आमची टीम लवकरच तुमच्याशी संपर्क साधेल.",
  submitError: "सध्या अर्ज सबमिट करता आला नाही. कृपया पुन्हा प्रयत्न करा किंवा +91 98765 43210 वर कॉल करा.",
  missingInfoFallback: "माझ्याकडे सध्या ही माहिती उपलब्ध नाही. कृपया रुग्णालय हेल्पलाइन +91 98765 43210 वर संपर्क साधा.",
  
  // Buttons
  btnRetry: "पुन्हा प्रयत्न करा",
  btnCallUs: "रुग्णालयाला कॉल करा",
  btnClose: "बंद करा",

  // Gender Labels
  genderMale: "पुरुष (Male)",
  genderFemale: "स्त्री (Female)",
  genderOther: "इतर (Other)",

  // Treatments
  treatmentCat: "🔬 मायक्रो-फेको मोतीबिंदू शस्त्रक्रिया",
  treatmentLasik: "👁 100% ब्लेड-फ्री लेझर चष्मा मुक्ती",
  treatmentRetina: "👁 रेटीना व डोळ्यांचे आजार",
  treatmentGlaucoma: "🧿 काचबिंदू (ग्लॉकोमा) तपासणी",
  treatmentPediatric: "👶 बालनेत्र रोग तज्ज्ञ",
  treatmentOpd: "🩺 सर्वसाधारण डोळे ओपीडी तपासणी",

  // Quick Action Labels
  qaBook: "अपॉइंटमेंट बुक करा",
  qaDoctors: "आमचे डॉक्टर",
  qaTreatments: "उपचार व शस्त्रक्रिया",
  qaFees: "ओपीडी फी",
  qaLocation: "रुग्णालयाचा पत्ता",
  qaTimings: "ओपीडी वेळ",
  qaReviews: "रुग्णांचे अभिप्राय",
  qaGallery: "फोटो गॅलरी",
  qaTour: "360° व्हर्च्युअल टूर",
  qaContact: "संपर्क साधा",
  qaEnquiry: "चौकशी पाठवा",
};
