const nodemailer = require("nodemailer");

module.exports = {
  sendMail: async function (maildata) {
    console.log("maildata===", maildata);
    try {
      //   const transporter = nodemailer.createTransport({
      //     host: "mail.dev14.ivantechnology.in",
      //     //   service: process.env.SERVICE,
      //     port: 587,
      //     secure: false,
      //     auth: {
      //       user: "voterscope.smtp@dev14.ivantechnology.in",
      //       pass: "5eKghTix7jG4",
      //     },
      //     tls: {
      //       rejectUnauthorized: false,
      //     },
      //   });
      //   let transporter = nodemailer.createTransport({
      //     host: String("mail.dev14.ivantechnology.in"),
      //     port: 587,
      //     secure: false, // secure:true for port 465, secure:false for port 587
      //     //transportMethod: "SMTP",
      //     auth: {
      //       user: String("voterscope.smtp@dev14.ivantechnology.in"),
      //       pass: String("5eKghTix7jG4"),
      //     },
      //   });
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "mail.dev14.ivantechnology.in",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "voterscope.smtp@dev14.ivantechnology.in", // generated ethereal user
          pass: "5eKghTix7jG4", // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bappa@yopmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      console.log("info====", info);

      return { status: "success", message: "Success", data: info };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  },
};
