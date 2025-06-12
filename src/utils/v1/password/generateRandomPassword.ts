export function generateRandomPassword(): string {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specialChars = "@#$%^&*";
    const allChars = uppercase + digits + specialChars + "abcdefghijklmnopqrstuvwxyz";

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)]; // At least one uppercase letter
    password += digits[Math.floor(Math.random() * digits.length)]; // At least one digit
    password += specialChars[Math.floor(Math.random() * specialChars.length)]; // At least one special character

    // Fill the rest of the password up to 8 characters
    for (let i = 3; i < 8; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to mix characters
    return password.split("").sort(() => Math.random() - 0.5).join("");
}

