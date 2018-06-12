const client = require('cheerio-httpcli')

module.exports = () => {
  const list = []

  return new Promise(resolve => {
    client.fetch('https://kigen.co/scpsl/browser.php', (err, $, res) => {
      if (err) resolve(null)
  
      $('div.server').each((idx, self) => {
        const info = $(self).find('div.server-info').text().trim().split(" ")[0];
        const name = $(self).find('div.server-name-container').text().trim();
        const address = $(self).find('div.server-address').text().trim();
  
        if (/JP/.test(name)) {
          list.push({
            'info': info,
            'name': name,
            'address': address
          })
        }
      })

      resolve(list)
    })
  })
}