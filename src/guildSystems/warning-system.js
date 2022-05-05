const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { METSERVICE_BASE, API_OPTIONS } = require("../../utils/constants");
const { base_warning_title, base_warning } = require("../baseFormats");
const { location, guildChannels } = require("./utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    let perviousWarning = null;
    
    async function warningSystem() {
        // Fetch data from MetService API
        try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        for (let i = 0; i < data.warnings.length; i++) {
            if (i === 0) finalData[k] = "[ @everyone ]\n" + base_warning_title(data);

            if (finalData[k].length + base_warning(i, data).length > charLimit) {
                k++
                finalData[k] = base_warning(i, data);
            } else {
                finalData[k] += base_warning(i, data);
            }
        }

        if (!finalData.length || finalData.join() === perviousWarning) return;

        // Iterate through formatted data array
        for (let i of finalData) {
            client.channels.cache.get(guildChannels.WARNING_CHANNEL).send(i);
        }

        perviousWarning = finalData.join();
    }

    setInterval(warningSystem, 60000);
}