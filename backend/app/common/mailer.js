const nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var fs = require("fs");

module.exports = {
  sendMail: async function (maildata) {
    try {
      let transporter = nodemailer.createTransport({
        host: String(global.CONFIG.mail.hostname),
        port: parseInt(global.CONFIG.mail.port),
        secure: Boolean(global.CONFIG.mail.secure),
        auth: {
          user: String(global.CONFIG.mail.username),
          pass: String(global.CONFIG.mail.password),
        },
      });

      var send_mail_document = {
        from: `"${global.CONFIG.mail.from.name}" <${global.CONFIG.mail.from.address}>`,
        to: maildata.to,
        subject: maildata.subject,
      };

      const APP_LOGO =
        "http://drive.google.com/uc?export=view&id=1TbN9TiCc7AK66aWXd9ns-YDigsGyjnPM";

      switch (maildata.type) {
        case "member-registration-link":
          await _read_html_file(
            global.CONFIG.DIR_PATH +
              "/views/mails/member-registration-link.html"
          )
            .then(function (html) {
              var template = handlebars.compile(html);

              var replacements = {
                app_name: global.CONFIG.app.name,
                app_url: global.CONFIG.app.fronted_url,
                app_logo: APP_LOGO,
                user_name: maildata.data.user_name,
                registration_link:
                  global.CONFIG.app.frontend_url +
                  "/register?token=" +
                  maildata.data.registration_token,
              };

              send_mail_document.html = template(replacements);
            })
            .catch(function (error) {
              throw error;
            });
          break;

        case "member-account-verification":
          await _read_html_file(
            global.CONFIG.DIR_PATH +
              "/views/mails/member-account-verification.html"
          )
            .then(function (html) {
              var template = handlebars.compile(html);

              var replacements = {
                app_name: global.CONFIG.app.name,
                app_url: global.CONFIG.app.fronted_url,
                app_logo: APP_LOGO,
                user_name: maildata.data.user_name,
                verification_link:
                  global.CONFIG.app.frontend_url +
                  "/verify-email?email=" +
                  maildata.data.user_email +
                  "&token=" +
                  maildata.data.verification_token,
              };

              send_mail_document.html = template(replacements);
            })
            .catch(function (error) {
              throw error;
            });
          break;

        default:
          send_mail_document.text = maildata.text;
          send_mail_document.html = maildata.html;
          break;
      }

      let info = await transporter.sendMail(send_mail_document);

      return { status: "success", message: "Success", data: info };
    } catch (e) {
      return { status: "error", message: e.message };
    }
  },
};

async function _read_html_file(path, callback) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
}
