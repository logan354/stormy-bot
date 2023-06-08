const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseObservation } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions, guildChannels } = require("../../utils/constants");

const locations = ["Hamilton"];

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const channels = []; // [location, channelId]

    for (let i = 0; i < locations.length; i++) {
        let channelExsits = false;

        client.channels.cache.get(guildChannels.OBSERVATION_CHANNEL).threads.cache.forEach((channel) => {
            if (channel.name === locations[i]) {
                channels.push([locations[i], channel.id])
                channelExsits = true;
            }
        });

        if (!channelExsits) {
            client.channels.cache.get(guildChannels.OBSERVATION_CHANNEL).threads.create({
                name: locations[i],
                message: { content: "**Observation for " + locations[i] + "**" }
            })
        }
    }

    async function run() {
        const d = new Date();

        // NZST = UTC+12
        if (d.getMinutes() !== 0) return;

        for (let i = 0; i < channels.length; i++) {
            const location = args.join(" ");

            // Fetch data from MetService API
            try {
                const response = await fetch(apiBaseURL + apiOptions.LOCAL_OBSERVATION + location.replace(" ", "-"));
                var data = await response.json();
            } catch (error) {
                console.error(error);
                return message.channel.send(client.emotes.error + " **Error(Observation System)**");
            }

            const embed = baseObservation(data);

            client.channels.cache.get(guildChannels.OBSERVATION_CHANNEL).threads.cache.get(channels[i]).send({ embeds: [embed] });
        }
    }


    setInterval(run, 60000);
}
