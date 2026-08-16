import { Resend } from 'resend'
import { Load } from '@/types'

let resendClient: Resend | null = null

function getResend() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not defined. Skipping email sending.')
      return null
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

/**
 * Every value below is submitter-controlled and interpolated into an HTML
 * email, so it has to be escaped — otherwise a name like `<img onerror=...>`
 * is delivered as live markup to whoever opens the message.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendLoadEmail(load: Load) {
  const load_number = escapeHtml(load.load_number)
  const submitter_name = escapeHtml(load.submitter_name)
  const submitter_email = load.submitter_email
  const pickup_address = escapeHtml(load.pickup_address).replace(/\r?\n/g, '<br/>')
  const delivery_address = escapeHtml(load.delivery_address).replace(/\r?\n/g, '<br/>')
  const product_name = escapeHtml(load.product_name)
  const weight = escapeHtml(load.weight)
  const weight_unit = escapeHtml(load.weight_unit)
  const quantity = escapeHtml(load.quantity)
  const pickup_date = escapeHtml(load.pickup_date)
  const pickup_time = escapeHtml(load.pickup_time)

  if (!submitter_email || typeof submitter_email !== 'string') {
    return { success: false, error: 'Missing recipient email address' }
  }

  try {
    const resend = getResend()
    if (!resend || !process.env.RESEND_FROM_EMAIL) {
      return { success: false, error: 'Email configuration missing' }
    }

    const { data, error } = await resend.emails.send({
      from: `LoadDesk <${process.env.RESEND_FROM_EMAIL}>`,
      to: [submitter_email],
      subject: `Your Load Has Been Created — [${load_number}]`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h1 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Load Confirmation</h1>
          <p>Hello ${submitter_name},</p>
          <p>Your shipment has been successfully registered in our system. Please find the details below:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; margin: 0; color: #3b82f6;">${load_number}</p>
            <p style="font-size: 14px; color: #64748b; margin-top: 5px;">Reference your load number for any future communication.</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Product</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${product_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Quantity</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${quantity}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Weight</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${weight} ${weight_unit}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Pickup Date</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${pickup_date} at ${pickup_time}</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <p><strong>Pickup Address:</strong><br/>${pickup_address}</p>
            <p><strong>Delivery Address:</strong><br/>${delivery_address}</p>
          </div>


          <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
            Thank you for using LoadDesk.
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}
