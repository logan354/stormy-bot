const { getForecast, Exception } = require("../../structures/api");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the forecast for a specified location in New Zealand.",
    utilisation: "{prefix}forecast <outlook> <location>",
    permissions: {
        channel: [],
        member: [],
    },

    async execute(client, message, args) {
        let city = args[1];
        let outlook = args[0];

        if (!city || !outlook) return message.channel.send(client.emotes.error + " **Invalid usage:** `" + this.utilisation.replace("{prefix}", client.config.app.prefix) + "`");

        if (args.length > 2) {
            for (let i = 2; i < args.length; i++) {
                city += "-" + args[i];
            }
        }

        const data = await getForecast(city, outlook);

        if (!data.forecast) {
            if (data.exception === Exception.INVALID_LOCATION) message.channel.send(client.emotes.error + " **Invalid Location**");
            else if (data.exception === Exception.UNKNOWN_ERROR) message.channel.send(client.emotes.error + " **Unexpected Error**"); 
            else message.channel.send(client.emotes.error + " **Unexpected Error**"); 
        } else { 
            if (data.extention) {
                message.channel.send(data.forecast);
                message.channel.send(data.extention);
            } else message.channel.send(data.forecast);
        }
    }
}