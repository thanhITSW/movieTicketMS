const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const { EMAIL_USER, EMAIL_PASS } = process.env;
const PORT = process.env.PORT || 3000;
const LINK_WEB = process.env.LINK_WEB || 'http://localhost:' + PORT;

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

async function sendMail(email, screen, seat, total, date, time, movieName) {
    // Generate QR code
    const qrData = `Screen: ${screen},Movie name: ${movieName} ,Selected seat: ${seat}, Total price: ${total}, Date: ${date}, Time: ${time}`;
    const qrImage = await qrcode.toDataURL(qrData);
    // Prepare email content
    let mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Ticket Information',
        text: 'Your ticket information is attached:',
        html: `
            <p>Your ticket information:</p>
            <p>Movie name: ${movieName}</p>
            <p>Screen: ${screen}</p>
            <p>Selected seat: ${seat}</p>
            <p>Total price: ${total}</p>
            <p>Date: ${date}</p>
            <p>Time: ${time}</p>
            <img src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_1280.png" alt="QR Code" width="200" height="200">
        `
    };

    // Send email with ticket information and QR code
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
}

module.exports = sendMail;