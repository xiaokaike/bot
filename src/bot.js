const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dateFns = require('date-fns');
const TelegramBot = require('node-telegram-bot-api');

const API = 'https://api.64clouds.com/v1/getServiceInfo?veid=872365&api_key=YOUR_API_KEY_HERE';

let API_KEY_HERE;
let BOT_TOKEN;
let isInit = false;

function byteToG(count) {
  if (count) {
    return count / 1024 / 1024 / 1024;
  }
  return 0;
}

function initConfig() {
  const data = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8');
  if (data) {
    const config = JSON.parse(data);
    isInit = true;
    API_KEY_HERE = config.API_KEY_HERE;
    BOT_TOKEN = config.BOT_TOKEN;
  }
}

async function getBwgInfo() {
  const data = await axios(API.replace('YOUR_API_KEY_HERE', API_KEY_HERE));
  const useData = byteToG(data.data.data_counter).toFixed(2);
  const planData = byteToG(data.data.plan_monthly_data);
  const nextReset = dateFns.format(data.data.data_next_reset * 1000, 'YYYY-MM-DD');
  const chText =`🙋🙋🙋🙋 本月本月使用情况:
    总流量: ${planData}G
    已使用: ${useData}G
    到期时间: ${nextReset}
  `;
  return chText;
}

function startBot() {
  const bot = new TelegramBot(BOT_TOKEN, {polling: true});

  bot.onText(/\/info/, async (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const info = await getBwgInfo();
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, info);
  });

  bot.onText(/\/start/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = `This bot is Don's Helper

      /info - 点击查询科学上网流量
    `;
    bot.sendMessage(chatId, text);
  });


  // Listen for any kind of message. There are different kinds of
  // messages.
  // bot.on('message', (msg) => {
  //  const chatId = msg.chat.id;
  //  console.log(msg)
    // send a message to the chat acknowledging receipt of their message
  //  bot.sendMessage(chatId, 'Received your message');
  // });
}

async function start() {
  await initConfig();
  if (isInit) {
    startBot();
  } else {
    console.log(`require config.json to start bot`);
  }
}

start();