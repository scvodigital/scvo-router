const mailgun = require('mailgun-js')({ apiKey: "key-c5d0622cdf89891bd5d464ac924663c0", domain: 'mg.scvo.org' });

const data = {
  from: 'Test Emailer <no-reply@goodmoves.com>',
  to: 'tonicblue@gmail.com',
  subject: 'Test email with HTML',
  text: 'This is the text version',
  html: '<b>This</b> is the HTML version'
};

mailgun.messages().send(data, function(err, body) {
  if (err) {
    console.error('Failed to send:', err);
  }

  console.log('Response from mailgun:', body);
});
