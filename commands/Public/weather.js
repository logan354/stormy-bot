const { getHourlyForecast, Exception } = require("../../src/API");

module.exports = {
    name: "weather",
    aliases: ["w"],
    category: "Weather",
    description: "Displays the current weather for a specified location in New Zealand.",
    utilisation: "{prefix}weather <location>",
    permissions: {
        channel: [],
        member: [],
    },

    async execute(client, message, args) {
        let city = args[0];

        if (!city) return message.channel.send(client.emotes.error + " **Invalid usage:** `" + this.utilisation.replace("{prefix}", client.config.app.prefix) + "`");

        if (args.length > 1) {
            for (let i = 1; i < args.length; i++) {
                city += "-" + args[i];
            }
        }
        
        const data = await getHourlyForecast(city);

        if (!data.forecast) {
            if (data.exception === Exception.INVALID_LOCATION) message.channel.send(client.emotes.error + " **Invalid Location**");
            else if (data.exception === Exception.UNKNOWN_ERROR) message.channel.send(client.emotes.error + " **Unexpected Error**"); 
            else message.channel.send(client.emotes.error + " **Unexpected Error**"); 
        } else message.channel.send({ embeds: [data.forecast] });
    },

    slashCommand: {
        options: [],

        async execute(client, interaction, args) {

        }
    }
}