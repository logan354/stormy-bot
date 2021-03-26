const { Message, MessageEmbed } = require("discord.js")

module.exports = (client) => {

    client.on('message', (message) => {
        const region = 'Waikato region'

        try {

            if (message.channel.id === '801396269360480256') {
                if (message.author.id !== '785437491510771752') {

                    if (message.embeds[0].description.includes('WKATO')) {
                        client.channels.cache.get('801396269360480256').send(`:warning: @everyone MetService had issued a warning/watch for the ${region}\n${message.content}`)
                    }

                    if (message.embeds[0].description.includes('Severe Thunderstorm')) {
                        client.channels.cache.get('801396269360480256').send(`:warning: @everyone MetService had issued a ${client.emotes.thunder} Severe Thunderstorm warning/watch for part of New Zealand\n${message.content}`)
                    }

                } else return
            } else return

        } catch {

        }

    })
}
