const Discord = require('discord.js')
const https = require('https')

module.exports = {
  name: 'search',
  description: 'Realiza una búsqueda en MercadoLibre con lo que le pases',
  execute(message, args) {
    if (!args.length) {
      message.reply('Mandame lo que querés que busque en Mercado Libre.')
      return
    }
    const q = args.join(' ')

    const searchURL = `https://api.mercadolibre.com/sites/MLA/search?q=${q}`

    https
      .get(searchURL, (resp) => {
        let data = ''

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          const parsedData = JSON.parse(data)
          const resp = parsedData.results[0]

          const embed = new Discord.MessageEmbed()
          embed.setAuthor('Resultados para "' + parsedData.query + `"`)
          embed.setColor('#F2F50C')
          embed.setTitle(resp.title)
          embed.setThumbnail(
            'https://www.expoknews.com/wp-content/uploads/2020/03/1200px-MercadoLibre.svg-1.png'
          )
          embed.setURL(resp.permalink)
          embed.setImage(resp.thumbnail)

          const n = parseInt(resp.seller.seller_reputation.level_id.charAt(0))
          const stars = ':star:'.repeat(n)

          const description = `:moneybag: ***${resp.price}*** ${
            resp.currency_id
          }\n${
            resp.shipping.free_shipping ? ':white_check_mark:' : ':x:'
          } Envío gratis\n\n:grey_question: ***${resp.condition.toUpperCase()}***\n\n:pickup_truck: ${stars}`

          embed.setDescription(description)

          message.channel.send(embed)
        })
      })
      .on('error', (err) => {
        console.log('Error: ' + err.message)
      })
  },
}
