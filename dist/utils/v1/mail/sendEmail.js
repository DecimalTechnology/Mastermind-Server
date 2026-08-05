"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLinkToEmail = sendLinkToEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
// GODADDY_WEBMAIL_HOST = "mail.oxygenmastermind.com"
// GODADDY_WEBMAIL_USERNAME = "support@oxygenmastermind.com"
// GODADDY_WEBMAIL_PASSWORD = "ufBX[t_4t~u+"
// GODADDY_WEBMAIL_FROM ='"Oxygen Mastermind" <support@oxygenmastermind.com>'
function sendLinkToEmail(email, text, html) {
    console.log(process.env.GODADDY_WEBMAIL_HOST, process.env.GODADDY_WEBMAIL_USERNAME, process.env.GODADDY_WEBMAIL_PASSWORD, process.env.GODADDY_WEBMAIL_FROM);
    const transporter = nodemailer_1.default.createTransport({
        host: `${process.env.GODADDY_WEBMAIL_HOST}`,
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.GODADDY_WEBMAIL_USERNAME}`,
            pass: `${process.env.GODADDY_WEBMAIL_PASSWORD}`,
        },
    });
    const mailOptions = {
        from: `${process.env.GODADDY_WEBMAIL_FROM}`,
        to: email,
        subject: "From Oxygen Mastermind",
        text: text,
        html: html,
    };
    const sendEmail = (mailOptions) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield transporter.sendMail(mailOptions);
            console.log("Mail Sent to", mailOptions.to);
            return true;
        }
        catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    });
    return sendEmail(mailOptions);
}
