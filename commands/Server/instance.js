const fetch = require("node-fetch");
const { METSERVICE_BASE, API_OPTIONS, getIconEmoji } = require("../../structures/Database");
const { getHourlyForecast, getForecast } = require("../../structures/API");
const { reloadTwitter } = require("../../structures/Twitter");

module.exports = async (client) => {
    const city = "Hamilton";
    const warningChannel = "878486900686606366";
    const dailyForecastChannel = "818392239042461719";
    const threeDayForecastChannel = "878486808088940564";
    const fiveDayForecastChannel = "876030637834895420";
    const hourlyForecastChannel = "795144435851067392";
    let savedWarning = "";

    function getTime() {
        let time = new Date().toLocaleTimeString();

        if (time === "6:00:00 PM") {
            //-------"6:00:00 AM NZDT"
            getForecast(client, city, 1, dailyForecastChannel);
            getForecast(client, city, 3, threeDayForecastChannel);
            getForecast(client, city, 5, fiveDayForecastChannel);
        }

        if (time === "3:00:00 PM" || time === "6:00:00 PM" || time === "9:00:00 PM" || time === "12:00:00 AM" || time === "3:00:00 AM" || time === "6:00:00 AM" || time === "9:00:00 AM" || time === "12:00:00 PM") {
            //-------"3:00:00 AM NZDT"--------"6:00:00 AM NZDT"--------"9:00:00 AM NZDT"--------"12:00:00 PM NZDT"--------"3:00:00 PM NZDT"--------"6:00:00 PM NZDT"--------"9:00:00 PM NZDT"--------"12:00:00 AM NZDT"
            getHourlyForecast(client, city, hourlyForecastChannel);
        }
    }

    async function checkWarnings() {
        try {
            await fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + city)
                .then(res => res.json())
                .then(json => {
                    const title = `${getIconEmoji("Warning red")} **Warning(s) for ${json.locationName}** ${getIconEmoji("Warning red")}\nhttps://www.metservice.com/warnings/ @everyone`
                    const body = (i) => { return `\n\n${getIconEmoji("Warning " + json.warnings[i].warnLevel)} **${json.warnings[i].name}** ${getIconEmoji("Warning " + json.warnings[i].warnLevel)}\n\n${json.warnings[i].editions[0].datum.text}`; }
                    let warning = title;
                    let extention = "";

                    for (let i = 0; i < json.warnings.length; i++) {
                        if (warning.length + body(i).length < 2000) warning += body(i);
                        else extention += body(i);
                    }

                    if (warning += extention === savedWarning || warning === title) return;

                    client.channels.cache.get(warningChannel).send(warning);
                    if (extention) client.channels.cache.get(warningChannel).send(extention);
                    savedWarning = warning += extention
                });
        } catch (ex) {
            if (ex.name === "FetchError" && ex.type === "invalid-json") return client.channels.cache.get(warningChannel).send(client.emotes.error + "**Error:** `Invalid location`");
            else {
                console.log(ex);
                return client.channels.cache.get(warningChannel).send(client.emotes.error + "**Unexpected Error**");
            }
        }
    }

    reloadTwitter(client);

    client.on("message", message => {
        if (message.guild.id === "795129011168477205") {
            if (message.channel.type === "news") message.crosspost();
        }
    });

    setInterval(getTime, 1000); //1 second
    setInterval(checkWarnings, 60000); //1 minute
}