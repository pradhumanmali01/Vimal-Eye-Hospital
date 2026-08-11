/**
 * CHAT CONTEXT & PROVIDER
 * Manages Chat messages, active flows, interactive step controls, session memory, and streaming state.
 * Enforces strict authorization boundaries for appointment creation.
 */
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { getTranslation } from '../data/translations';
import { chatService } from '../services/chatService';
import { appointmentService } from '../services/appointmentService';
import { contactService } from '../services/contactService';
import { validationService } from '../services/validationService';
import { formatTime } from '../utils/ai/formatters';
import { generateBookingToken } from '../utils/ai/bookingAuth';

const ChatContext = createContext();

export function ChatProvider({ children, onOpenGlobalBooking }) {
  const { lang } = useLanguage();
  const t = getTranslation(lang);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeFlow, setActiveFlow] = useState('CHAT'); // 'CHAT', 'APPOINTMENT_FLOW', 'ENQUIRY_FLOW'
  const [bookingState, setBookingState] = useState('IDLE'); // 'IDLE', 'COLLECTING_PATIENT_INFO', 'READY_FOR_CONFIRMATION', 'SUBMITTING', 'SUBMITTED'
  const [flowStepIndex, setFlowStepIndex] = useState(0);
  const [currentInteractiveStep, setCurrentInteractiveStep] = useState(null); // 'treatment', 'gender', 'date', 'time', 'confirm'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authorization token & timestamp for appointment creation
  const [bookingToken, setBookingToken] = useState(null);
  const [bookingTimestamp, setBookingTimestamp] = useState(null);

  // Session Memory for Patient Data
  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    treatment: 'Micro-Phaco Cataract Surgery',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    message: '',
    subject: 'General OPD Enquiry',
  });

  const chatBodyRef = useRef(null);

  // Initialize Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: t.welcome,
          timestamp: formatTime(),
          type: 'WELCOME',
        },
      ]);
    }
  }, [lang]);

  // Language Switch Updates Initial Welcome Message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].type === 'WELCOME') {
        return [
          {
            id: 'welcome',
            sender: 'bot',
            text: getTranslation(lang).welcome,
            timestamp: formatTime(),
            type: 'WELCOME',
          },
        ];
      }
      return prev;
    });
  }, [lang]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const updatePatientData = (key, value) => {
    setPatientData(prev => ({ ...prev, [key]: value }));
  };

  // Add Message to Chat History
  const addMessage = (msg) => {
    const newMsg = {
      id: Date.now() + Math.random().toString(),
      timestamp: formatTime(),
      ...msg,
    };
    setMessages(prev => [...prev, newMsg]);
    scrollToBottom();
    return newMsg;
  };

  // Handle User Action / Selection (from typing or interactive control button tap)
  const sendMessage = async (userQuery) => {
    if (!userQuery || !userQuery.trim()) return;
    const text = userQuery.trim();

    // Reset interactive control step once user submits option (except on confirm step)
    if (currentInteractiveStep !== 'confirm') {
      setCurrentInteractiveStep(null);
    }

    // 1. Add User Message
    addMessage({ sender: 'user', text });

    // 2. Show Typing Indicator
    setIsTyping(true);

    try {
      if (activeFlow === 'APPOINTMENT_FLOW') {
        await handleAppointmentFlowStep(text);
        setIsTyping(false);
        return;
      }

      if (activeFlow === 'ENQUIRY_FLOW') {
        await handleEnquiryFlowStep(text);
        setIsTyping(false);
        return;
      }

      // Standard AI Query Processing
      const result = await chatService.generateResponse({
        userQuery: text,
        lang,
        memory: patientData,
      });

      if (result.intent === 'START_APPOINTMENT_FLOW') {
        startAppointmentFlow();
      } else if (result.intent === 'START_ENQUIRY_FLOW') {
        startEnquiryFlow();
      } else {
        addMessage({ sender: 'bot', text: result.text });
      }
    } catch (err) {
      console.error('[ChatContext] Process error:', err);
      addMessage({ sender: 'bot', text: getTranslation(lang).missingInfoFallback });
    } finally {
      setIsTyping(false);
    }
  };

  // ─── APPOINTMENT FLOW HANDLER ──────────────────────────────────────────────
  const APPOINTMENT_STEPS = ['name', 'phone', 'age', 'gender', 'treatment', 'date', 'time', 'confirm'];

  const startAppointmentFlow = () => {
    const activeT = getTranslation(lang);
    setActiveFlow('APPOINTMENT_FLOW');
    setBookingState('COLLECTING_PATIENT_INFO');
    setFlowStepIndex(0);
    setCurrentInteractiveStep(null);
    setBookingToken(null);
    setBookingTimestamp(null);

    // If patient name already known in session
    if (patientData.name) {
      if (patientData.phone) {
        setFlowStepIndex(2); // Ask Age
        addMessage({
          sender: 'bot',
          text: `Hi **${patientData.name}**! ${activeT.stepAgePrompt}`,
          step: 'age',
        });
        return;
      }
      setFlowStepIndex(1); // Ask Phone
      addMessage({
        sender: 'bot',
        text: activeT.stepPhonePrompt.replace('{name}', patientData.name),
        step: 'phone',
      });
      return;
    }

    addMessage({
      sender: 'bot',
      text: activeT.stepNamePrompt,
      step: 'name',
    });
  };

  const handleAppointmentFlowStep = async (userText) => {
    const activeT = getTranslation(lang);
    const currentStep = APPOINTMENT_STEPS[flowStepIndex];

    if (currentStep === 'name') {
      const val = validationService.validateName(userText);
      if (!val.valid) {
        addMessage({ sender: 'bot', text: `⚠️ ${activeT.valNameErr}` });
        return;
      }
      updatePatientData('name', val.sanitized);
      setFlowStepIndex(1);
      addMessage({ sender: 'bot', text: activeT.stepPhonePrompt.replace('{name}', val.sanitized) });
      return;
    }

    if (currentStep === 'phone') {
      const val = validationService.validatePhone(userText);
      if (!val.valid) {
        addMessage({ sender: 'bot', text: `⚠️ ${activeT.valPhoneErr}` });
        return;
      }
      updatePatientData('phone', val.sanitized);
      setFlowStepIndex(2);
      addMessage({ sender: 'bot', text: activeT.stepAgePrompt });
      return;
    }

    if (currentStep === 'age') {
      const val = validationService.validateAge(userText);
      if (!val.valid) {
        addMessage({ sender: 'bot', text: `⚠️ ${activeT.valAgeErr}` });
        return;
      }
      updatePatientData('age', val.sanitized);
      setFlowStepIndex(3);
      setCurrentInteractiveStep('gender');
      addMessage({
        sender: 'bot',
        text: activeT.stepGenderPrompt,
        step: 'gender',
      });
      return;
    }

    if (currentStep === 'gender') {
      const ALLOWED_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
      const matchedGender = ALLOWED_GENDERS.find(g => g.toLowerCase() === userText.trim().toLowerCase());
      
      if (!matchedGender) {
        addMessage({
          sender: 'bot',
          text: `⚠️ Please select a valid gender option from the choices below.`,
          step: 'gender',
        });
        setCurrentInteractiveStep('gender');
        return;
      }

      updatePatientData('gender', matchedGender);
      setFlowStepIndex(4);
      setCurrentInteractiveStep('treatment');
      addMessage({
        sender: 'bot',
        text: activeT.stepTreatmentPrompt,
        step: 'treatment',
      });
      return;
    }

    if (currentStep === 'treatment') {
      updatePatientData('treatment', userText);
      setFlowStepIndex(5);
      setCurrentInteractiveStep('date');
      addMessage({
        sender: 'bot',
        text: activeT.stepDatePrompt,
        step: 'date',
      });
      return;
    }

    if (currentStep === 'date') {
      let dStr = userText.toLowerCase().includes('tomorrow')
        ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
        : userText;
      const val = validationService.validateDate(dStr);
      if (!val.valid) {
        addMessage({ sender: 'bot', text: `⚠️ ${activeT.valDateErr}` });
        setCurrentInteractiveStep('date');
        return;
      }
      updatePatientData('date', val.sanitized);
      setFlowStepIndex(6);
      setCurrentInteractiveStep('time');
      addMessage({
        sender: 'bot',
        text: activeT.stepTimePrompt.replace('{date}', val.sanitized),
        step: 'time',
      });
      return;
    }

    if (currentStep === 'time') {
      const updatedData = { ...patientData, time: userText };
      setPatientData(updatedData);

      const timestamp = Date.now();
      const token = generateBookingToken(updatedData, timestamp);

      setBookingToken(token);
      setBookingTimestamp(timestamp);
      setBookingState('READY_FOR_CONFIRMATION');
      setFlowStepIndex(7);
      setCurrentInteractiveStep('confirm');

      addMessage({
        sender: 'bot',
        type: 'APPOINTMENT_SUMMARY',
        text: '📋 **Appointment Summary**\n\nPlease review your details and click the **Confirm Appointment** button below to complete your booking.',
        step: 'confirm',
      });
      return;
    }

    if (currentStep === 'confirm') {
      const inputLower = userText.toLowerCase();

      if (inputLower.includes('edit') || inputLower.includes('बदल')) {
        handleEditAppointment();
        return;
      }

      // Plain text messages in chat NEVER create an appointment!
      addMessage({
        sender: 'bot',
        text: 'ℹ️ Please review your appointment details above and click the **"Confirm Appointment"** button to complete your booking.',
        step: 'confirm',
      });
      setCurrentInteractiveStep('confirm');
    }
  };

  // Explicit Application-Controlled Confirmation Handler (Triggered ONLY via button click)
  const handleConfirmAppointment = async () => {
    if (isSubmitting) return; // Prevent double click / duplicate submission
    if (bookingState !== 'READY_FOR_CONFIRMATION') {
      console.warn('[ChatContext] Confirmation rejected: Session not in READY_FOR_CONFIRMATION state');
      return;
    }

    setIsSubmitting(true);
    setBookingState('SUBMITTING');

    try {
      const activeT = getTranslation(lang);
      let token = bookingToken;
      let timestamp = bookingTimestamp;

      if (!token || !timestamp) {
        timestamp = Date.now();
        token = generateBookingToken(patientData, timestamp);
        setBookingToken(token);
        setBookingTimestamp(timestamp);
      }

      const res = await appointmentService.submitAppointment({
        ...patientData,
        bookingToken: token,
        bookingTimestamp: timestamp,
      });

      if (res.success) {
        setBookingState('SUBMITTED');
        setCurrentInteractiveStep(null);
        setActiveFlow('CHAT');
        addMessage({
          sender: 'bot',
          type: 'SUCCESS_CONFIRMATION',
          text: activeT.appointmentSuccess.replace('{phone}', patientData.phone),
        });
      } else {
        setBookingState('READY_FOR_CONFIRMATION');
        addMessage({
          sender: 'bot',
          type: 'ERROR',
          text: `⚠️ ${res.message || activeT.submitError}`,
        });
      }
    } catch (err) {
      console.error('[ChatContext] Confirm error:', err);
      setBookingState('READY_FOR_CONFIRMATION');
      addMessage({
        sender: 'bot',
        type: 'ERROR',
        text: '⚠️ Unable to complete booking. Please try again or call the hospital.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Appointment Handler
  const handleEditAppointment = () => {
    setBookingState('COLLECTING_PATIENT_INFO');
    setFlowStepIndex(0);
    setCurrentInteractiveStep(null);
    setBookingToken(null);
    setBookingTimestamp(null);
    const activeT = getTranslation(lang);
    addMessage({ sender: 'bot', text: activeT.stepNamePrompt, step: 'name' });
  };

  // ─── ENQUIRY FLOW HANDLER ──────────────────────────────────────────────────
  const startEnquiryFlow = () => {
    setActiveFlow('ENQUIRY_FLOW');
    setFlowStepIndex(0);
    addMessage({
      sender: 'bot',
      text: "📩 **General Enquiry Form**\n\nPlease enter your **Full Name**:",
    });
  };

  const handleEnquiryFlowStep = async (userText) => {
    const activeT = getTranslation(lang);

    if (flowStepIndex === 0) {
      const val = validationService.validateName(userText);
      if (!val.valid) {
        addMessage({ sender: 'bot', text: `⚠️ ${activeT.valNameErr}` });
        return;
      }
      updatePatientData('name', val.sanitized);
      setFlowStepIndex(1);
      addMessage({ sender: 'bot', text: activeT.stepPhonePrompt.replace('{name}', val.sanitized) });
      return;
    }

    if (flowStepIndex === 1) {
      const val = validationService.validatePhone(userText);
      if (!val.valid) {
        addMessage({ sender: 'bot', text: `⚠️ ${activeT.valPhoneErr}` });
        return;
      }
      updatePatientData('phone', val.sanitized);
      setFlowStepIndex(2);
      addMessage({ sender: 'bot', text: "What is your **Question / Message** for our eye care team?" });
      return;
    }

    if (flowStepIndex === 2) {
      updatePatientData('message', userText);
      setIsTyping(true);
      const res = await contactService.submitEnquiry({
        ...patientData,
        message: userText,
      });
      setIsTyping(false);

      if (res.success) {
        addMessage({
          sender: 'bot',
          type: 'SUCCESS_CONFIRMATION',
          text: activeT.enquirySuccess,
        });
      } else {
        addMessage({
          sender: 'bot',
          type: 'ERROR',
          text: `⚠️ ${activeT.submitError}`,
        });
      }
      setActiveFlow('CHAT');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isTyping,
        activeFlow,
        bookingState,
        patientData,
        isSubmitting,
        chatBodyRef,
        currentInteractiveStep,
        setCurrentInteractiveStep,
        sendMessage,
        startAppointmentFlow,
        startEnquiryFlow,
        handleConfirmAppointment,
        handleEditAppointment,
        addMessage,
        onOpenGlobalBooking,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

