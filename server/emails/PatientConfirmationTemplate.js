/**
 * PATIENT CONFIRMATION EMAIL TEMPLATE
 * Sent to: Patient's email (if provided)
 */

export function generatePatientEmailSubject() {
  return `Your Appointment Request Has Been Received — Vimal Eye Hospital`;
}

export function generatePatientEmailHTML({ name, treatment, date, time }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Request Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F5F5F7; margin: 0; padding: 24px; color: #1D1D1F; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); }
    .header { background: #050811; padding: 32px 28px; text-align: center; color: #FFFFFF; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; color: #0071E3; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .body { padding: 32px 28px; }
    .greeting { font-size: 18px; font-weight: 800; color: #000000; margin-bottom: 12px; }
    .intro { font-size: 15px; color: #424245; line-height: 1.6; margin-bottom: 24px; }
    .card { background: #FAFBFD; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; }
    .card-title { font-size: 12px; font-weight: 700; color: #0071E3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
    .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 14px; }
    .item:last-child { border-bottom: none; }
    .label { color: #86868B; }
    .val { font-weight: 700; color: #000000; }
    .notice { background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 16px; font-size: 14px; color: #065F46; line-height: 1.5; margin-bottom: 24px; text-align: center; font-weight: 600; }
    .regards { font-size: 14px; color: #1D1D1F; line-height: 1.6; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 20px; }
    .footer { background: #F5F5F7; padding: 20px; text-align: center; font-size: 12px; color: #86868B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Vimal Eye Hospital</h1>
      <p>Superspeciality Ocular Care — Latur</p>
    </div>

    <div class="body">
      <div class="greeting">Hi ${name},</div>
      <p class="intro">
        Thank you for choosing <strong>Vimal Eye Hospital</strong>. We have successfully received your appointment request.
      </p>

      <div class="card">
        <div class="card-title">Appointment Request Details</div>
        <div class="item">
          <span class="label">👁 Treatment</span>
          <span class="val" style="color: #0071E3;">${treatment}</span>
        </div>
        <div class="item">
          <span class="label">📅 Preferred Date</span>
          <span class="val">${date}</span>
        </div>
        <div class="item">
          <span class="label">🕒 Preferred Time</span>
          <span class="val">${time}</span>
        </div>
      </div>

      <div class="notice">
        📞 Our reception team will contact you shortly to confirm your appointment slot.
      </div>

      <div class="regards">
        <strong>Regards,</strong><br>
        Vimal Eye Hospital Team<br>
        <span style="color: #86868B; font-size: 13px;">Shivaji Chowk, Ambejogai Road, Latur</span>
      </div>
    </div>

    <div class="footer">
      Vimal Eye Hospital, Latur — Premier Ophthalmic Care
    </div>
  </div>
</body>
</html>
  `;
}
