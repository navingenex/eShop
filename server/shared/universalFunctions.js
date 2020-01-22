const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.twilioKey);

module.exports = {
    sendMail: async function sendMail(payload, callback) {
        sgMail.send(payload, (err, data) => {
            if (err)
                callback(err)
            else
                callback(null, data)
        });
    }
} 