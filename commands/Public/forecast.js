const { getForecast } = require("../../structures/API");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the forecast for a specified location in New Zealand.",
    utilisation: "{prefix}forecast <outlook> <location>",

    execute(client, message, args) {
        let city = args[1];
        let outlook = args[0];

        if (!city || !outlook) return message.channel.send(client.emotes.error + " **Invalid usage:** `" + this.utilisation.replace("{prefix}", client.config.discord.prefix) + "`");

        if (args.length > 2) {
            for (let i = 2; i < args.length; i++) {
                city += "-" + args[i];
            }
        }

        getForecast(client, city, outlook, message.channel.id)
    }
}