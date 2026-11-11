/**
 * Transactional Email & Notification System (Section 28)
 * Dispatches simulated or SMTP/Resend transactional notifications.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
  // In production, integrate with SendGrid, Resend, or AWS SES.
  // In development, logs transactional output cleanly and audit logs event.
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  console.log(`[TRANSACTIONAL EMAIL] To: ${payload.to} | Subject: "${payload.subject}" | ID: ${messageId}`);
  return { success: true, messageId };
}

// 1. Welcome Email
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #F5F3EE; color: #151515; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2px solid #101010; padding: 30px;">
        <h1 style="font-size: 28px; text-transform: uppercase; margin: 0 0 10px;">WELCOME TO BUILD.</h1>
        <p style="color: #777; font-size: 14px;">WEAR YOUR IDENTITY. NO ORDINARY FITS.</p>
        <p>Hi ${name}, welcome to the underground streetwear archive. You now have priority access to limited numbered drops.</p>
        <p style="background: #E8E5DE; padding: 15px; font-family: monospace; font-weight: bold;">
          Use code <strong>BUILD10</strong> for 10% off your first drop order.
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: "Welcome to BUILD CLOTHING — Drop 008 Access", html });
}

// 2. Order Confirmation Email
export async function sendOrderConfirmationEmail(to: string, orderNumber: string, totalAmount: number, items: any[]) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #EEE;">${item.productTitle} (${item.variantSize})</td>
          <td style="padding: 8px; border-bottom: 1px solid #EEE; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #EEE; text-align: right;">₹${item.total}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; background: #F5F3EE; color: #151515; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2px solid #101010; padding: 30px;">
        <h1 style="font-size: 24px; text-transform: uppercase;">ORDER CONFIRMED — ${orderNumber}</h1>
        <p>Thank you for copping from BUILD CLOTHING. Your heavyweight garments are being prepared for dispatch.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background: #101010; color: #D8FF36;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px;">Qty</th>
              <th style="padding: 8px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size: 16px; font-weight: bold; text-align: right;">Total Paid: ₹${totalAmount}</p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: `Order Confirmed: ${orderNumber} — BUILD CLOTHING`, html });
}

// 3. Shipping / Dispatch Update Email
export async function sendShippingUpdateEmail(to: string, orderNumber: string, courierName: string, trackingNumber: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #F5F3EE; color: #151515; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2px solid #101010; padding: 30px;">
        <h1 style="font-size: 24px; text-transform: uppercase;">YOUR DROP HAS SHIPPED</h1>
        <p>Order <strong>${orderNumber}</strong> has been handed over to <strong>${courierName}</strong>.</p>
        <div style="background: #E8E5DE; padding: 15px; margin: 20px 0; font-family: monospace;">
          <p style="margin: 0;">Courier: ${courierName}</p>
          <p style="margin: 5px 0 0; font-weight: bold;">AWB Tracking: ${trackingNumber}</p>
        </div>
        <p>Expected delivery within 2–4 business days.</p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: `Dispatched: Order ${orderNumber} is on the way!`, html });
}

