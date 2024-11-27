const nodemailer = require('nodemailer');
const pug = require('pug');
const smtpTransport = require('nodemailer-smtp-transport');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url = '') {
    this.user = user;
    this.url = url;
    this.from = `ReviseUKMLA <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport(smtpTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    }));
  }

  // Render HTML based on a pug template
  renderTemplate(template, parameters = {}) {
    return pug.renderFile(`${__dirname}/../views/email/${template}.pug`, parameters);
  }

  // Send the actual email
  async send(html, subject, additionalOptions = {}) {
    const mailOptions = {
      from: this.from,
      to: additionalOptions.to || this.user.email,
      subject,
      html,
      text: convert(html),
      replyTo: additionalOptions.replyTo,
      attachments: additionalOptions.attachments
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const html = this.renderTemplate('welcome', {
      firstName: this.user.firstName
    });
    await this.send(html, 'Welcome to the UKMLA Family!');
  }

  async sendContactUs(description, attachments, replyTo) {
    const subject = `New Contact Us Query from ${this.user.firstName} ${this.user.lastName}`;
    const html = this.renderTemplate('contactUs', {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      subject,
      description
    });
    await this.send(html, subject, {
      to: process.env.EMAIL_FROM,
      replyTo: replyTo,
      attachments
    });
  }

  async sendPasswordReset() {
    const subject = 'ReviseUKMLA Password Reset';
    const html = this.renderTemplate('passwordReset', {
      firstName: this.user.firstName,
      url: this.url
    });
    await this.send(html, subject);
  }
};
