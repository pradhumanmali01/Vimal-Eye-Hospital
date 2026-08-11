/**
 * HOSPITAL NOTIFICATION EMAIL TEMPLATE
 * Sent to: pradhumanmali2@gmail.com
 */

export function generateHospitalEmailSubject() {
  return `📅 New Appointment Request`;
}

export function generateHospitalEmailHTML({ name, phone, email, age, gender, treatment, date, time, message }) {
  const safeMessage = message ? message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'None provided';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Appointment Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F5F5F7; margin: 0; padding: 24px; color: #1D1D1F; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); }
    .header { background: #050811; padding: 32px 28px; text-align: center; color: #FFFFFF; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; color: #0071E3; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .body { padding: 32px 28px; }
    .badge { display: inline-block; background: rgba(0,113,227,0.1); color: #0071E3; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-card { background: #FAFBFD; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #86868B; font-weight: 500; }
    .value { color: #000000; font-weight: 700; text-align: right; }
    .message-box { background: rgba(0,113,227,0.04); border-left: 4px solid #0071E3; padding: 14px 18px; border-radius: 8px; font-size: 14px; color: #333336; line-height: 1.5; margin-top: 16px; }
    .footer { background: #F5F5F7; padding: 20px; text-align: center; font-size: 12px; color: #86868B; border-top: 1px solid rgba(0,0,0,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Vimal Eye Hospital</h1>
      <p>OPD Appointment Desk — Latur</p>
    </div>

    <div class="body">
      <div class="badge">New Booking Received</div>
      <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 20px; color: #000000;">New Appointment Details</h2>

      <div class="detail-card">
        <div class="detail-row">
          <span class="label">👤 Patient Name</span>
          <span class="value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="label">📱 Phone Number</span>
          <span class="value"><a href="tel:+91${phone}" style="color: #0071E3; text-decoration: none;">+91 ${phone}</a></span>
        </div>
        <div class="detail-row">
          <span class="label">📧 Email Address</span>
          <span class="value">${email ? `<a href="mailto:${email}" style="color: #0071E3; text-decoration: none;">${email}</a>` : 'Not provided'}</span>
        </div>
        <div class="detail-row">
          <span class="label">🎂 Patient Age</span>
          <span class="value">${age ? `${age} Years` : 'Not provided'}</span>
        </div>
        <div class="detail-row">
          <span class="label">🚻 Gender</span>
          <span class="value">${gender || 'Not provided'}</span>
        </div>
        <div class="detail-row">
          <span class="label">👁 Treatment Required</span>
          <span class="value" style="color: #0071E3;">${treatment}</span>
        </div>
        <div class="detail-row">
          <span class="label">📅 Preferred Date</span>
          <span class="value">${date}</span>
        </div>
        <div class="detail-row">
          <span class="label">🕒 Preferred Time</span>
          <span class="value">${time}</span>
        </div>
      </div>

      <div style="font-size: 13px; font-weight: 700; color: #1D1D1F; margin-bottom: 6px;">📝 Patient Message / Notes:</div>
      <div class="message-box">${safeMessage}</div>
    </div>

    <div class="footer">
      Submitted from Vimal Eye Hospital Website — Generated Automatically
    </div>
  </div>
</body>
</html>
  `;
}
