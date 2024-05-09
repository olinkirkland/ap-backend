import chalk from 'chalk';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';

const upload = multer();
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*' // Allow any origin
  })
);

// Route to handle form submissions
app.post('/submit-form', upload.none(), async (req: Request, res: Response) => {
  // Receive the name, email and message from the request body as FORM DATA string
  // Example: name=asdf&email=adf%40asdf.com&message=sdfg

  console.log(req.body);

  const { name, email, message } = req.body;

  if (!name || !email) {
    console.log(chalk.red('Form submission error: Missing required fields'));
    return res.status(400).send('Missing required fields');
  }

  console.log(chalk.green('Form submitted'));
  console.table({ name, email, message });

  // Create a Nodemailer transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email username
      pass: process.env.EMAIL_PASSWORD // Your email password
    }
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender email address
    to: process.env.RECIPIENT_EMAIL, // Recipient email address
    subject: 'New Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    // Send the email
    console.log(chalk.blue('Sending email...'));
    await transporter.sendMail(mailOptions);
    console.log(chalk.green('Email sent successfully'));
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.log(chalk.red('Error sending email'));
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/', (req, res) => {
  res.send('Hello World from ap-backend');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
