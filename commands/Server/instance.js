const { getHourlyForecast, getForecast } = require("../../structures/API");
const { reloadTwitter } = require("../../structures/Twitter");

module.exports = (client) => {
    function getTime() {
        let time = new Date().toLocaleTimeString();
        let city = "Hamilton";

        if (time === "5:00:00 PM") {
            //-------"6:00:00 AM NZDT"
            getForecast(client, city, 1, "");
            getForecast(client, city, 3, "");
            getForecast(client, city, 5, "");
        }

        if (time === "2:00:00 PM" || time === "5:00:00 PM" || time === "8:00:00 PM" || time === "11:00:00 PM" || time === "2:00:00 AM" || time === "5:00:00 AM" || time === "8:00:00 AM" || time === "11:00:00 AM") {
            //-------"3:00:00 AM NZDT"--------"6:00:00 AM NZDT"--------"9:00:00 AM NZDT"--------"12:00:00 PM NZDT"--------"3:00:00 PM NZDT"--------"6:00:00 PM NZDT"--------"9:00:00 PM NZDT"--------"12:00:00 AM NZDT"
            getHourlyForecast(client, city, "");
        }
    }

    //reloadTwitter(client);

    client.on("message", message => {
        if (message.channel.id) {
            if (message.channel.type === "news") message.crosspost();
        }
    });

    setInterval(getTime, 1000);
}