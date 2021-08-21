const { getHourlyForecast } = require("../../structures/API");

module.exports = {
    name: "weather",
    aliases: ["w"],
    category: "Weather",
    description: "Displays the current weather for a specified location in New Zealand.",
    utilisation: "{prefix}weather <location>",

    execute(client, message, args) {
        let city = args[0];

        if (!city) message.channel.send(client.emotes.error + " **Invalid usage:** `" + this.utilisation.replace("{prefix}", client.config.discord.prefix) + "`");

        if (args.length > 1) {
            for (let i = 1; i < args.length; i++) {
                city += "-" + args[i];
            }
        }
        
        getHourlyForecast(client, city, message.channel.id);
    }
}