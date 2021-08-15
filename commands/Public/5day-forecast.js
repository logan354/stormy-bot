const { get5DayForecast } = require("../../structures/API");

module.exports = {
    name: "5dayforecast",
    aliases: ["5df"],
    category: "Weather",
    description: "Displays the 5 day forecast for a specified location in New Zealand.",
    utilisation: "{prefix}5dayforecast",

    execute(client, message, args) {
        get5DayForecast(client, args[0], message.channel.id);
    }
}