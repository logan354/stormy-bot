const { getHourlyForecast } = require("../../structures/API");

module.exports = {
    name: "weather",
    aliases: ["w"],
    category: "Weather",
    description: "Displays the current weather for a specified location in New Zealand.",
    utilisation: "{prefix}weather",

    execute(client, message, args) {
        getHourlyForecast(client, args[0], message.channel.id);
    }
}