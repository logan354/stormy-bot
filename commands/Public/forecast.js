const { getDailyForecast } = require("../../structures/API");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the daily forecast for a specified location in New Zealand.",
    utilisation: "{prefix}forecast",

    execute(client, message, args) {
        getDailyForecast(client, args[0], message.channel.id);
    }
}