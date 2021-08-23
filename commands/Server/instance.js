const { getHourlyForecast, getForecast, checkWarnings } = require("../../structures/API");
const { reloadTwitter } = require("../../structures/Twitter");

module.exports = async (client) => {
    const city = "Hamilton";
    const warningChannel = "878486900686606366";
    const dailyForecastChannel = "818392239042461719";
    const threeDayForecastChannel = "878486808088940564";
    const fiveDayForecastChannel = "876030637834895420";
    const hourlyForecastChannel = "795144435851067392";

    function getTime() {
        let time = new Date().toLocaleTimeString();

        if (time === "5:00:00 PM") {
            //-------"6:00:00 AM NZDT"
            getForecast(client, city, 1, dailyForecastChannel);
        }

        if (time === "5:00:20 PM") {
             //-------"6:00:20 AM NZDT"
             getForecast(client, city, 3, threeDayForecastChannel);
        }

        if (time === "5:00:40 PM") {
            //-------"6:00:40 AM NZDT"
            getForecast(client, city, 5, fiveDayForecastChannel);
       }

        if (time === "2:00:00 PM" || time === "5:00:00 PM" || time === "8:00:00 PM" || time === "11:00:00 PM" || time === "2:00:00 AM" || time === "5:00:00 AM" || time === "8:00:00 AM" || time === "11:00:00 AM") {
            //-------"3:00:00 AM NZDT"--------"6:00:00 AM NZDT"--------"9:00:00 AM NZDT"--------"12:00:00 PM NZDT"--------"3:00:00 PM NZDT"--------"6:00:00 PM NZDT"--------"9:00:00 PM NZDT"--------"12:00:00 AM NZDT"
            getHourlyForecast(client, city, hourlyForecastChannel);
        }
    }

    function initWarning() {

    }

    reloadTwitter(client);

    client.on("message", message => {
        if (message.guild.id === "795129011168477205") {
            if (message.channel.type === "news") message.crosspost();
        }
    });

    setInterval(getTime, 1000);
    //setInterval(initWarning, 10000);
}