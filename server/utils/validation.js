/**
 * VIMAL EYE HOSPITAL — SERVER-SIDE VALIDATION UTILITY
 */

export function validateAppointmentData(data) {
  const errors = {};

  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim().replace(/\s+/g, '').replace(/-/g, '');
  const email = (data.email || '').trim();
  const treatment = (data.treatment || '').trim();
  const date = (data.date || '').trim();
  const time = (data.time || '').trim();

  // 1. Full Name Validation
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2 || name.length > 80) {
    errors.name = 'Name must be between 2 and 80 characters.';
  } else if (/\d/.test(name)) {
    errors.name = 'Name cannot contain numbers.';
  } else if (/[^A-Za-z\s'\-]/.test(name)) {
    errors.name = 'Name contains invalid special characters.';
  }

  // 2. Phone Number Validation (10-digit Indian Mobile)
  let cleanPhone = phone;
  if (cleanPhone.startsWith('+91')) cleanPhone = cleanPhone.slice(3);
  else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
  else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

  if (!cleanPhone) {
    errors.phone = 'Phone number is required.';
  } else if (/[^0-9]/.test(cleanPhone)) {
    errors.phone = 'Phone number must contain digits only.';
  } else if (cleanPhone.length !== 10) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  } else if (!/^[6-9]/.test(cleanPhone)) {
    errors.phone = 'Indian mobile number must start with 6, 7, 8, or 9.';
  }

  // 3. Email Validation (Optional field)
  if (email) {
    if (email.length > 254) {
      errors.email = 'Email address is too long.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address.';
      }
    }
  }

  // 4. Age Validation (Required: integer 1 - 120)
  const ageStr = (data.age || '').toString().trim();
  if (!ageStr) {
    errors.age = 'Please enter your age.';
  } else if (!/^\d+$/.test(ageStr)) {
    errors.age = 'Please enter a valid age between 1 and 120.';
  } else {
    const ageNum = Number(ageStr);
    if (ageNum < 1 || ageNum > 120) {
      errors.age = 'Please enter a valid age between 1 and 120.';
    }
  }

  // 5. Gender Validation (Required: allowlist)
  const genderStr = (data.gender || '').toString().trim();
  const ALLOWED_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
  if (!genderStr) {
    errors.gender = 'Please select your gender.';
  } else if (!ALLOWED_GENDERS.includes(genderStr)) {
    errors.gender = 'Please select a valid gender option.';
  }

  // 6. Treatment Validation (required, max 200 chars)
  if (!treatment) {
    errors.treatment = 'Treatment selection is required.';
  } else if (treatment.length > 200) {
    errors.treatment = 'Treatment description is too long (max 200 characters).';
  }

  // 7. Preferred Date Validation (required, must not be in the past)
  if (!date) {
    errors.date = 'Preferred date is required.';
  } else if (date.length > 30) {
    errors.date = 'Invalid date format.';
  } else {
    // Reject past dates — compare against midnight UTC today
    const submittedDate = new Date(date);
    const todayMidnight = new Date();
    todayMidnight.setUTCHours(0, 0, 0, 0);
    if (isNaN(submittedDate.getTime())) {
      errors.date = 'Please enter a valid date.';
    } else if (submittedDate < todayMidnight) {
      errors.date = 'Appointment date cannot be in the past. Please select a future date.';
    }
  }

  // 8. Preferred Time Validation (required, max 30 chars)
  if (!time) {
    errors.time = 'Preferred time slot is required.';
  } else if (time.length > 30) {
    errors.time = 'Invalid time format.';
  }

  const isValid = Object.keys(errors).length === 0;

  // Free-text fields: sanitize and enforce max length
  const rawMessage = (data.message || '').trim();
  const rawNotes = (data.additionalNotes || '').toString().trim();

  return {
    isValid,
    errors,
    sanitized: {
      name,
      phone: cleanPhone,
      email,
      treatment,
      date,
      time,
      age: ageStr,
      gender: genderStr,
      additionalNotes: rawNotes.slice(0, 2000),
      appointmentId: (data.appointmentId || '').toString().trim().slice(0, 100),
      message: rawMessage.slice(0, 2000),
    },
  };
}
