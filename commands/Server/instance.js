const { getHourlyForecast, getDailyForecast } = require("../../structures/API");
const { reloadTwitter } = require("../../structures/Twitter");

module.exports = (client) => {
    function getTime() {
        let time = new Date().toLocaleTimeString();

        if (time) getHourlyForecast(client);
        if (time) getDailyForecast(client);
        if (time) get5DayForecast(client);
    }

    reloadTwitter();

    client.on("message", message => {
        if (message.channel.id) {
            if (message.channel.type === "news") message.crosspost();
        }
    });

    setInterval(getTime, 1000);
}