const { getHourlyForecast, getForecast } = require("../../structures/API");
const { reloadTwitter } = require("../../structures/Twitter");

module.exports = (client) => {
    function getTime() {
        let time = new Date().toLocaleTimeString();
        const city = "Hamilton";
        const dailyForecastChannel = "818392239042461719";
        const threeDayForecastChannel = "878486808088940564";
        const fiveDayForecastChannel = "876030637834895420";

        if (time === "5:00:00 PM") {
            //-------"6:00:00 AM NZDT"
            getForecast(client, city, 1, dailyForecastChannel);
            getForecast(client, city, 3, threeDayForecastChannel);
            getForecast(client, city, 5, fiveDayForecastChannel);
        }

        if (time === "2:00:00 PM" || time === "5:00:00 PM" || time === "8:00:00 PM" || time === "11:00:00 PM" || time === "2:00:00 AM" || time === "5:00:00 AM" || time === "8:00:00 AM" || time === "11:00:00 AM") {
            //-------"3:00:00 AM NZDT"--------"6:00:00 AM NZDT"--------"9:00:00 AM NZDT"--------"12:00:00 PM NZDT"--------"3:00:00 PM NZDT"--------"6:00:00 PM NZDT"--------"9:00:00 PM NZDT"--------"12:00:00 AM NZDT"
            getHourlyForecast(client, city, "");
        }
    }

    reloadTwitter(client);

    client.on("message", message => {
        if (message.channel.id) {
            if (message.channel.type === "news") message.crosspost();
        }
    });

    setInterval(getTime, 1000);
}