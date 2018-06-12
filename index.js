const Discord = require('discord.js')
const scraping = require('./lib/scraping.js')
const client = new Discord.Client()

let editMessage;
let interval;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // 更新間隔を設定
  interval = 20 * 60 * 1000
})

client.on('message', async msg => {
  if (msg.content === '!server') {
    const message = [];
    const servers = await scraping()

    for (server of servers) {
      message.push(`${server.info} | ${server.name} | ${server.address}`)
    }

    msg.channel.send(message.join('\n'), { code: true })
  }

  if (msg.content === '!loop') {
    const timer = setInterval(async () => {
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

      // 更新処理

      if (editMessage != undefined) {
        editMessage.edit(message.join('\n'), { code: true })
      } else {
        editMessage = await msg.channel.send(message.join('\n'), { code: true })
      }

    }, interval)
  }
});

client.login('Token')