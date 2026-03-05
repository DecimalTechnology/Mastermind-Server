import nodemailer from "nodemailer";

// GODADDY_WEBMAIL_HOST = "mail.oxygenmastermind.com"
// GODADDY_WEBMAIL_USERNAME = "support@oxygenmastermind.com"
// GODADDY_WEBMAIL_PASSWORD = "ufBX[t_4t~u+"
// GODADDY_WEBMAIL_FROM ='"Oxygen Mastermind" <support@oxygenmastermind.com>'

export function sendLinkToEmail(email: string, text: string, html: string): Promise<boolean> {
    

    const transporter = nodemailer.createTransport({
        host: `${process.env.GODADDY_WEBMAIL_HOST}`,
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.GODADDY_WEBMAIL_USERNAME}`,
            pass: `${process.env.GODADDY_WEBMAIL_PASSWORD}`,
        },
    });

    interface MailOptions {
        from: string;
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }

    const mailOptions: MailOptions = {
        from: `${process.env.GODADDY_WEBMAIL_FROM}`,
        to: email,
        subject: "From Oxygen Mastermind",
        text: text,
        html: html,
    };

    const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
        try {
            await transporter.sendMail(mailOptions);

            console.log("Mail Sent to", mailOptions.to);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    };

    return sendEmail(mailOptions);
}
