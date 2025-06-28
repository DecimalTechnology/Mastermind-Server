export const generateEmailHtml =(name:string,password:string)=>{
    return    `
    <h3>Your Login Password - Master Mind</h3>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your password for logging in to <strong>Master Mind</strong> is:</p>
    <p style="font-size: 18px; font-weight: bold; color: #4B164C;">🔐 ${password}</p>
    <p>Please keep this password secure and do not share it with anyone.</p>
    <p>You can reset your password later if needed.</p>
    <p>If you did not request this email, please ignore it.</p>
    <br/>
    <p>Best regards,<br />The Master Mind Team</p>
  `

}


export const generateOtpEmailHtml = (name: string, otp: string) => {
  return `
    <h3>Your One-Time Password (OTP) - Master Mind</h3>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your OTP for verifying your identity on <strong>Master Mind</strong> is:</p>
    <p style="font-size: 22px; font-weight: bold; color: #1E88E5;">🔐 ${otp}</p>
    <p>This OTP is valid for a limited time and can only be used once.</p>
    <p>Please do not share this code with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br/>
    <p>Best regards,<br />The Master Mind Team</p>
  `;
};

export const sendOtpHtml = (otp: string) => {
  return `
    <h3>Your One-Time Password (OTP) - Master Mind</h3>
    <p>Hello,</p>
    <p>Your OTP for verifying your identity on <strong>Master Mind</strong> is:</p>
    <p style="font-size: 22px; font-weight: bold; color: #1E88E5;">🔐 ${otp}</p>
    <p>This OTP is valid for a limited time and can only be used once.</p>
    <p>Please do not share this code with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br/>
    <p>Best regards,<br />The Master Mind Team</p>
  `;
};



export const registrationRejectedHtml = (userName: string, reason: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #d32f2f;">Registration Request Rejected - Master Mind</h2>
      <p>Hi ${userName},</p>

      <p>Thank you for your interest in joining <strong>Master Mind</strong>.</p>

      <p>We have reviewed your registration request, and unfortunately, it has been <strong>rejected</strong>.</p>

      <p><strong>Reason:</strong> ${reason}</p>

      <p>If you believe this was a mistake or if you have any questions, feel free to reach out to our support team.</p>

      <br/>
      <p>Best regards,<br/>The Master Mind Team</p>
    </div>
  `;
};


