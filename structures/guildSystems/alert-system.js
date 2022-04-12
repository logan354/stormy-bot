const { Client } = require("discord.js");
const { localForecast, localObservation, warnings } = require("../formats");
const { LoadType } = require("../../utils/constants");

// Location
const location = "Hamilton";

// Guild id
const guildId = "795129011168477205";

// Guild channel ids
const warningChannelId = "878486900686606366";
const dailyForecastChannelId = "818392239042461719";
const threeDayForecastChannelId = "878486808088940564";
const fiveDayForecastChannelId = "876030637834895420";
const hourlyObservationChannelId = "795144435851067392";
const serverLogsChannelId = "795173942293692447";

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    let previousWarning = null;

    async function auto_forecast() {
        const time = new Date().toLocaleTimeString();

        if (time === "6:00:00 PM") {
            //-------"6:00:00 AM NZDT"

            const forecastChannels = [dailyForecastChannelId, threeDayForecastChannelId, fiveDayForecastChannelId];
            let k = 0;

            for (let i = 1; i <= 5; i += 2) {
                const res = await localForecast(location, i);
                if (res.loadType === LoadType.LOADED_DATA) {
                    for (let j = 0; j < res.data.length; j++) {
                        client.channels.cache.get(forecastChannels[k]).send(res.data[j]);
                    }
                } else {
                    if (res.loadType === LoadType.NO_DATA) client.channels.cache.get(serverLogsChannelId).send(client.emotes.error + " **" + res.exception + "**");
                    else if (res.loadType === LoadType.LOAD_FAILED) client.channels.cache.get(serverLogsChannelId).send(client.emotes.error + " **Error** `" + res.exception + "`");
                }

                k += 1;
            }
        }

        if (time === "3:00:00 PM" || time === "6:00:00 PM" || time === "9:00:00 PM" || time === "12:00:00 AM" || time === "3:00:00 AM" || time === "6:00:00 AM" || time === "9:00:00 AM" || time === "12:00:00 PM") {
            //-------"3:00:00 AM NZDT"--------"6:00:00 AM NZDT"--------"9:00:00 AM NZDT"--------"12:00:00 PM NZDT"--------"3:00:00 PM NZDT"--------"6:00:00 PM NZDT"--------"9:00:00 PM NZDT"--------"12:00:00 AM NZDT"
            const res = await localObservation(location);
            if (res.loadType === LoadType.LOADED_DATA) client.channels.cache.get(hourlyObservationChannelId).send({ embeds: [res.data] });
            else {
                if (res.loadType === LoadType.NO_DATA) client.channels.cache.get(serverLogsChannelId).send(client.emotes.error + " **" + res.exception + "**");
                else if (res.loadType === LoadType.LOAD_FAILED) client.channels.cache.get(serverLogsChannelId).send(client.emotes.error + " **Error** `" + res.exception + "`");
            }
        }
    }

    async function auto_warn() {
        const res = await warnings(location);
        if (res.loadType === LoadType.LOADED_DATA) {
            if (res.data.join() === previousWarning || res.data.join().includes("No warnings for this region")) return;

            for (let i = 0; i < res.data.length; i++) {
                if (i === 0) res[0] = "[ @everyone ]\n" + res[0]
                client.channels.cache.get(warningChannelId).send(res.data[i]);
            }

            previousWarning = res.data.join();
        } else {
            if (res.loadType === LoadType.NO_DATA) client.channels.cache.get(serverLogsChannelId).send(client.emotes.error + " **" + res.exception + "**");
            else if (res.loadType === LoadType.LOAD_FAILED) client.channels.cache.get(serverLogsChannelId).send(client.emotes.error + " **Error** `" + res.exception + "`");
        }
    }

    client.on("messageCreate", (message) => {
        if (message.guild.id === guildId) {
            if (message.channel.type === "GUILD_NEWS") message.crosspost();
        }
    });

    setInterval(auto_forecast, 1000); // 1 second
    setInterval(auto_warn, 60000); // 1 minute
}