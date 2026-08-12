/**
 * VIMAL EYE HOSPITAL — TELEGRAM NOTIFICATION SERVICE
 * Handles sending appointment notifications to the official hospital Telegram group.
 */

// In-memory cache for deduplication (TTL: 5 minutes)
const recentNotifications = new Map();
const DUP_TTL_MS = 5 * 60 * 1000;

function cleanupCache() {
  const now = Date.now();
  for (const [key, timestamp] of recentNotifications.entries()) {
    if (now - timestamp > DUP_TTL_MS) {
      recentNotifications.delete(key);
    }
  }
}

/**
 * Formats appointment data into a clean, professional Telegram message.
 */
export function formatTelegramMessage(appointment) {
  const { name, phone, email, age, gender, treatment, date, time, message, additionalNotes, appointmentId } = appointment;

  const formattedPhone = phone
    ? (phone.startsWith('+') ? phone : `+91 ${phone}`)
    : 'N/A';

  const emailStr = (email && String(email).trim().length > 0) ? String(email).trim() : 'Not provided';

  let patientDetailsStr = `Name: ${name || 'N/A'}\nPhone: ${formattedPhone}\nEmail: ${emailStr}\nAge: ${age || 'N/A'}\nGender: ${gender || 'N/A'}`;

  const notes = additionalNotes || message;
  const showNotes = notes && notes.trim().length > 0 && !notes.includes('Booking request from Vimal Eye Hospital website modal') && !notes.includes('Booked via AI Assistant');

  let msg = `🏥 NEW APPOINTMENT\n━━━━━━━━━━━━━━━━━━━━\n\n👤 PATIENT DETAILS\n\n${patientDetailsStr}\n\n👁️ TREATMENT\n\n${treatment || 'General OPD Enquiry'}\n\n📅 APPOINTMENT\n\nDate: ${date || 'N/A'}\nTime: ${time || 'N/A'}`;

  if (showNotes) {
    msg += `\n\n📝 ADDITIONAL NOTES\n\n${notes.trim()}`;
  }

  if (appointmentId) {
    msg += `\n\n🆔 Appointment ID: ${appointmentId}`;
  }

  msg += `\n\n━━━━━━━━━━━━━━━━━━━━\n✅ Status: New Appointment\n🌐 Source: Vimal Eye Hospital Website`;

  return msg;
}

/**
 * Sends a Telegram appointment notification to the hospital group.
 * Does NOT throw errors — failures are logged on server and ignored to preserve appointment flow.
 */
export async function sendTelegramAppointmentNotification(appointmentData) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Environment Validation
    if (!token || !chatId) {
      console.error('[TelegramService] Configuration missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in environment.');
      return { success: false, reason: 'Configuration missing' };
    }

    // 2. Deduplication Check
    cleanupCache();
    const fingerprint = appointmentData.appointmentId
      ? `id_${appointmentData.appointmentId}`
      : `fp_${appointmentData.name}_${appointmentData.phone}_${appointmentData.date}_${appointmentData.time}`;

    if (recentNotifications.has(fingerprint)) {
      console.log(`[TelegramService] Duplicate notification suppressed for: ${appointmentData.name} (${fingerprint})`);
      return { success: true, duplicate: true };
    }

    // 3. Format Message
    const text = formatTelegramMessage(appointmentData);

    // 4. Send API Request to Telegram
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const resData = await response.json().catch(() => ({}));

    if (!response.ok || !resData.ok) {
      const errCode = resData.error_code || response.status;
      const errDesc = resData.description || 'Unknown Telegram API error';
      console.error(`[TelegramService] Telegram API error (${errCode}): ${errDesc}`);
      return { success: false, error: errDesc };
    }

    // 5. Mark as sent for deduplication
    recentNotifications.set(fingerprint, Date.now());
    console.log(`[TelegramService] Telegram notification sent successfully to chat ${chatId} for ${appointmentData.name}`);

    return { success: true, messageId: resData.result?.message_id };

  } catch (err) {
    console.error('[TelegramService] Unexpected error sending Telegram notification:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Formats enquiry data into a clean, professional Telegram message.
 */
export function formatTelegramEnquiryMessage(enquiry) {
  const { name, phone, email, subject, message, enquiryId } = enquiry;

  const nameStr = (name || 'N/A').slice(0, 100);

  const formattedPhone = phone
    ? (phone.startsWith('+') ? phone : `+91 ${phone}`)
    : 'N/A';

  const emailStr = (email && String(email).trim().length > 0) ? String(email).trim().slice(0, 100) : 'Not provided';
  const subjectStr = (subject && String(subject).trim().length > 0) ? String(subject).trim().slice(0, 200) : 'General OPD Enquiry';
  const messageStr = (message && String(message).trim().length > 0) ? String(message).trim().slice(0, 2000) : 'No message body';

  let msg = `📩 NEW ENQUIRY\n━━━━━━━━━━━━━━━━━━\n\n👤 NAME\n${nameStr}\n\n📞 PHONE\n${formattedPhone}\n\n📧 EMAIL\n${emailStr}\n\n📌 SUBJECT\n${subjectStr}\n\n📝 MESSAGE\n${messageStr}`;

  if (enquiryId) {
    msg += `\n\n🆔 Enquiry ID: ${enquiryId}`;
  }

  msg += `\n\n━━━━━━━━━━━━━━━━━━\n✅ Status: New Enquiry\n🌐 Source: Vimal Eye Hospital Website`;

  return msg;
}

/**
 * Sends a Telegram enquiry notification to the hospital group.
 * Reuses existing TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.
 * Does NOT throw errors — failures are logged on server and ignored to preserve enquiry flow.
 */
export async function sendTelegramEnquiryNotification(enquiryData) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Environment Validation
    if (!token || !chatId) {
      console.error('[TelegramService] Configuration missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in environment.');
      return { success: false, reason: 'Configuration missing' };
    }

    // 2. Deduplication Check
    cleanupCache();
    const fingerprint = enquiryData.enquiryId
      ? `enq_${enquiryData.enquiryId}`
      : `enq_${enquiryData.name}_${enquiryData.phone}_${enquiryData.subject}_${(enquiryData.message || '').slice(0, 30)}`;

    if (recentNotifications.has(fingerprint)) {
      console.log(`[TelegramService] Duplicate enquiry notification suppressed for: ${enquiryData.name} (${fingerprint})`);
      return { success: true, duplicate: true };
    }

    // 3. Format Message
    const text = formatTelegramEnquiryMessage(enquiryData);

    // 4. Send API Request to Telegram
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const resData = await response.json().catch(() => ({}));

    if (!response.ok || !resData.ok) {
      const errCode = resData.error_code || response.status;
      const errDesc = resData.description || 'Unknown Telegram API error';
      console.error(`[TelegramService] Telegram API error (${errCode}): ${errDesc}`);
      return { success: false, error: errDesc };
    }

    // 5. Mark as sent for deduplication
    recentNotifications.set(fingerprint, Date.now());
    console.log(`[TelegramService] Telegram enquiry notification sent successfully to chat ${chatId} for ${enquiryData.name}`);

    return { success: true, messageId: resData.result?.message_id };

  } catch (err) {
    console.error('[TelegramService] Unexpected error sending Telegram enquiry notification:', err.message);
    return { success: false, error: err.message };
  }
}
