/**
 * HOSPITAL ENQUIRY NOTIFICATION EMAIL TEMPLATE
 * Sent to hospital when a contact enquiry is submitted.
 *
 * NOTE: All dynamic values are HTML-escaped via esc() to prevent injection.
 */

// HTML escape helper — prevents HTML injection in email body
function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateEnquiryEmailSubject({ name, subject }) {
  const safeName = String(name || 'Unknown').slice(0, 60).replace(/[^\w\s'-]/g, '');
  const safeSubject = String(subject || 'General OPD Enquiry').slice(0, 80).replace(/[^\w\s&\-/.]/g, '');
  return `📩 New Enquiry — ${safeName} | ${safeSubject}`;
}

export function generateEnquiryEmailHTML({ name, phone, email, subject, message }) {
  const safeMessage = message ? esc(message) : '<em style="color:#86868B;">No message provided.</em>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry — Vimal Eye Hospital</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F5F5F7; margin: 0; padding: 24px; color: #1D1D1F; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); }
    .header { background: #050811; padding: 32px 28px; text-align: center; color: #FFFFFF; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; color: #0071E3; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .body { padding: 32px 28px; }
    .badge { display: inline-block; background: rgba(16,185,129,0.1); color: #065F46; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
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
      <p>Contact Enquiry Desk — Latur</p>
    </div>

    <div class="body">
      <div class="badge">New Enquiry Received</div>
      <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 20px; color: #000000;">Patient Enquiry Details</h2>

      <div class="detail-card">
        <div class="detail-row">
          <span class="label">👤 Name</span>
          <span class="value">${esc(name)}</span>
        </div>
        <div class="detail-row">
          <span class="label">📱 Phone</span>
          <span class="value"><a href="tel:+91${esc(phone)}" style="color: #0071E3; text-decoration: none;">+91 ${esc(phone)}</a></span>
        </div>
        <div class="detail-row">
          <span class="label">📧 Email</span>
          <span class="value">${email ? `<a href="mailto:${esc(email)}" style="color: #0071E3; text-decoration: none;">${esc(email)}</a>` : '<em style="color:#86868B;">Not provided</em>'}</span>
        </div>
        <div class="detail-row">
          <span class="label">📋 Subject</span>
          <span class="value" style="color: #0071E3;">${esc(subject)}</span>
        </div>
      </div>

      <div style="font-size: 13px; font-weight: 700; color: #1D1D1F; margin-bottom: 6px;">📝 Patient Message:</div>
      <div class="message-box">${safeMessage}</div>
    </div>

    <div class="footer">
      Submitted from Vimal Eye Hospital Website Contact Section — Generated Automatically
    </div>
  </div>
</body>
</html>
  `;
}
