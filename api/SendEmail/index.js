const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    // CORS headers
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle preflight
    if (req.method === "OPTIONS") {
        context.res = { status: 204, headers };
        return;
    }

    try {
        const body = req.body;

        if (!body || !body.email || !body.name) {
            context.res = {
                status: 400,
                headers,
                body: { success: false, error: "Les champs nom et email sont requis." }
            };
            return;
        }

        const connectionString = process.env.ACS_CONNECTION_STRING;
        const senderEmail = process.env.SENDER_EMAIL;
        const recipientEmail = process.env.RECIPIENT_EMAIL;

        const emailClient = new EmailClient(connectionString);

        // Build email subject and body based on form type
        let subject;
        let htmlContent;

        if (body.formType === "quote") {
            subject = `Demande de Devis – ${body.company || body.name}`;
            htmlContent = `
                <h2 style="color:#152a4a;">Nouvelle Demande de Devis</h2>
                <hr style="border:1px solid #e51414;">
                <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;">
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Société</td><td style="padding:8px;">${escapeHtml(body.company || '-')}</td></tr>
                    <tr style="background:#f4f6f9;"><td style="padding:8px;font-weight:bold;color:#152a4a;">Nom</td><td style="padding:8px;">${escapeHtml(body.name)}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
                    <tr style="background:#f4f6f9;"><td style="padding:8px;font-weight:bold;color:#152a4a;">Téléphone</td><td style="padding:8px;">${escapeHtml(body.phone || '-')}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Service</td><td style="padding:8px;">${escapeHtml(body.service || '-')}</td></tr>
                    <tr style="background:#f4f6f9;"><td style="padding:8px;font-weight:bold;color:#152a4a;">Départ</td><td style="padding:8px;">${escapeHtml(body.origin || '-')}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Arrivée</td><td style="padding:8px;">${escapeHtml(body.destination || '-')}</td></tr>
                    <tr style="background:#f4f6f9;"><td style="padding:8px;font-weight:bold;color:#152a4a;">Poids</td><td style="padding:8px;">${escapeHtml(body.weight || '-')}</td></tr>
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Date souhaitée</td><td style="padding:8px;">${escapeHtml(body.date || '-')}</td></tr>
                </table>
                <h3 style="color:#152a4a;margin-top:20px;">Détails complémentaires</h3>
                <p style="background:#f4f6f9;padding:16px;border-radius:6px;">${escapeHtml(body.details || '-')}</p>
                <hr style="border:1px solid #dce1e8;margin-top:24px;">
                <p style="color:#8c95a4;font-size:12px;">Envoyé depuis le formulaire de devis sur ecs75.fr</p>
            `;
        } else {
            subject = body.subject ? `Contact – ${body.subject}` : `Message depuis le site ECS75 – ${body.name}`;
            htmlContent = `
                <h2 style="color:#152a4a;">Nouveau Message de Contact</h2>
                <hr style="border:1px solid #e51414;">
                <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;">
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Nom</td><td style="padding:8px;">${escapeHtml(body.name)}</td></tr>
                    <tr style="background:#f4f6f9;"><td style="padding:8px;font-weight:bold;color:#152a4a;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
                    <tr><td style="padding:8px;font-weight:bold;color:#152a4a;">Téléphone</td><td style="padding:8px;">${escapeHtml(body.phone || '-')}</td></tr>
                    <tr style="background:#f4f6f9;"><td style="padding:8px;font-weight:bold;color:#152a4a;">Objet</td><td style="padding:8px;">${escapeHtml(body.subject || '-')}</td></tr>
                </table>
                <h3 style="color:#152a4a;margin-top:20px;">Message</h3>
                <p style="background:#f4f6f9;padding:16px;border-radius:6px;">${escapeHtml(body.message || '-')}</p>
                <hr style="border:1px solid #dce1e8;margin-top:24px;">
                <p style="color:#8c95a4;font-size:12px;">Envoyé depuis le formulaire de contact sur ecs75.fr</p>
            `;
        }

        const emailMessage = {
            senderAddress: senderEmail,
            content: {
                subject: subject,
                html: htmlContent
            },
            recipients: {
                to: [{ address: recipientEmail }]
            },
            replyTo: [{ address: body.email, displayName: body.name }]
        };

        const poller = await emailClient.beginSend(emailMessage);
        await poller.pollUntilDone();

        context.res = {
            status: 200,
            headers,
            body: { success: true, message: "Email envoyé avec succès." }
        };

    } catch (error) {
        context.log.error("Email send error:", error);
        context.res = {
            status: 500,
            headers,
            body: { success: false, error: "Erreur lors de l'envoi. Veuillez réessayer ou nous contacter par téléphone." }
        };
    }
};

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, (c) => map[c]);
}
