import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
  var mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "NexusMeet",
      link: "https://vivek.co.in/",
      //logo   optional
    },
  })

  // Generate an HTML email with the provided contents
  const emailHtml = mailGenerator.generate(options.mailgenContent)

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

  // Create a nodemailer transporter instance which is responsible to send a mail
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.MAILTRAP_HOST,
  //     port: process.env.MAILTRAP_PORT,
  //     auth: {
  //       user: process.env.MAILTRAP_USER,
  //       pass: process.env.MAILTRAP_PASS,
  //     },
  //   });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILTRAP_USER, // Your Gmail address
      pass: process.env.MAILTRAP_PASS, // Your App Password
    },
  })

  const mail = {
    from: "mail.taskmanager@example.com", // We can name this anything. The mail will go to your Mailtrap inbox
    to: options.email, // receiver's mail
    subject: options.subject, // mail subject
    text: emailTextual, // mailgen content textual variant
    html: emailHtml, // mailgen content html variant
  }

  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
    )
    console.error("Error: ", error)
  }
}

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to NexusMeet! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#0b803eff", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  }
}

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  }
}

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
}
