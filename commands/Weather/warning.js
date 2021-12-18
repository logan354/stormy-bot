const { getWarnings, Exception } = require("../../structures/api")

module.exports = {
    name: "warning",
    aliases: ["warn"],
    category: "Weather",
    description: "Displays the current Metservice issued warnings for a specified location in New Zealand.",
    utilisation: "{prefix}warning <location>",
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
        
        const data = await getWarnings(city);

        if (!data.warning) {
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