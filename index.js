const Discord = require('discord.js')
const scraping = require('./lib/scraping.js')
const client = new Discord.Client()

let editMessage;
let interval;
let timer;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

  // 更新間隔を設定
  interval = 5 * 1000
})

client.on('message', async msg => {

  if (msg.content === '!server') {
    const message = await getServerList()
    msg.channel.send(message, { code: true })
  }

  if (msg.content === '!loop') {

    timer = setInterval(async () => {
      const message = await getServerList()

      // 更新処理
      if (editMessage != undefined) {
        editMessage.edit(message, { code: true })
      } else {
        editMessage = await msg.channel.send(message, { code: true })
      }

      // 更新間隔を変更
      interval = 20 * 60 * 1000
      clearInterval(timer)

      // 再登録
      timer = setInterval(async () => {
        const message = await getServerList()

        if (editMessage != undefined) {
          editMessage.edit(message, { code: true })
        } else {
          editMessage = await msg.channel.send(message, { code: true })
        }
      }, interval)

    }, interval)
  }

  // 更新処理の停止
  if (msg.content === '!stop') {
    if (timer != undefined) {
      clearInterval(timer)
      interval = 5 * 1000
    }
  }
});

const getServerList = async () => {
  const message = [];
  const servers = await scraping()

  for (server of servers) {
    message.push(`${server.info} | ${server.name} | ${server.address}`)
  }

  // 合計サーバー数
  message.unshift(`合計サーバー数: ${servers.length}`)

  // 更新日時
  const now = new Date()
  const time = [
    now.toLocaleDateString('ja-jp'),
    now.toLocaleTimeString('ja-jp')
  ].join(' / ')
  message.unshift(`更新日時: ${time}`)

  // 合計参加人数
  // -> 面倒臭いからパス

  return message.join('\n')
}

client.login('Token')