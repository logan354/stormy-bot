const { getForecast } = require("../../structures/API");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the forecast for a specified location in New Zealand.",
    utilisation: "{prefix}forecast <location> <length>",

    execute(client, message, args) {
        let city = args[0];
        let forecastLength = args[1];

        if (!city) message.channel.send(client.emotes.error + " **Invalid usage:** `" + this.utilisation.replace("{prefix}", client.config.discord.prefix) + "`");

        if (!forecastLength) forecastLength = 1; 

        getForecast(client, city, forecastLength, message.channel.id)
    }
}