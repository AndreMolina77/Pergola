import { config } from './config.js'

// Función principal para enviar emails con Brevo API
const sendBrevoEmail = async (emailData) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": config.BREVO.API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: emailData.senderName || "Soporte Pérgola",
          email: emailData.senderEmail || config.APPUSER.USER
        },
        to: [{ 
          email: emailData.to, 
          name: emailData.toName || "Usuario" 
        }],
        subject: emailData.subject,
        htmlContent: emailData.html || emailData.htmlContent,
        textContent: emailData.text || emailData.textContent,
        // Tags para seguimiento (opcional)
        tags: emailData.tags || [],
        // Headers personalizados (opcional)
        headers: emailData.headers || {}
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Brevo API Error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("Email enviado exitosamente:", data)
    return data
  } catch (error) {
    console.error("Error enviando email con Brevo API:", error)
    throw error
  }
}
export { sendBrevoEmail }