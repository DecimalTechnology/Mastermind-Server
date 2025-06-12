import nodemailer from 'nodemailer'

export function sendLinkToEmail(email: string, text: string): Promise<boolean> {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service provider
        auth: {
            user:'adarshjithu10@gmail.com',
            pass: "ydwt thcd qsds vtmn",
        },
    });
    //interface for mail options
    interface MailOptions {
        from: string;
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }
    const mailOptions = {
        from: "adarshjithu10@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: text,
    };

    const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
        try {
            await transporter.sendMail(mailOptions);

            console.log("Mail Send to ", mailOptions.to);
            //if otp success return true;
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            //if otp fails return false;
            return false;
        }
    };
    return sendEmail(mailOptions);
}