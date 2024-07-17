const { Markup } = require('telegraf');
const { WEB_APP_URL } = require('./config');

const startHandler = async (ctx) => {
  const chatId = ctx.message.chat.id;
  const referralId = ctx.message.text.split('=')[1];

  if (referralId) {
    // Referral ID is present
    ctx.reply(`Welcome to Hodl Swap! You are referred by: ${referralId}`, Markup.inlineKeyboard([
      Markup.button.webApp('Play', `${WEB_APP_URL}/home/${chatId}/${referralId}`)
    ]));
  } else {
    // Referral ID is not present
    ctx.reply('Welcome to Hodl Swap!', Markup.inlineKeyboard([
      Markup.button.webApp('Play', `${WEB_APP_URL}/home/${chatId}`)
    ]));
  }
};

const webAppDataHandler = async (ctx) => {
  // Handle data received from the web app
  console.log('Web App Data:', ctx.webAppData);
};

module.exports = {
  startHandler,
  webAppDataHandler
};