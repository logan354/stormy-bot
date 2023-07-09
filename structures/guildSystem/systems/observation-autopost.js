const { Client } = require("discord.js");
const { locations, guildChannels } = require("../constants");
const { default: fetch } = require("node-fetch");
const { apiBaseURL, apiOptions } = require("../../../utils/constants");
const { baseObservation } = require("../../baseFormats");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const channels = new Map();

    for (let i = 0; i < locations.length; i++) {
        let channelExsits = false;

        client.channels.cache.get(guildChannels.OBSERVATION_CHANNEL).threads.cache.forEach((channel) => {
            if (channel.name === locations[i]) {
                channels.set(locations[i], channel.id);
                channelExsits = true;
            }
        });

        if (!channelExsits) {
            const threadChannel = client.channels.cache.get(guildChannels.OBSERVATION_CHANNEL).threads.create({
                name: locations[i],
            })

            channels.set(locations[i], threadChannel.id);
        }
    }

    const run = async () => {
        for (let i = 0; i < channels.size; i++) {
            const location = locations[i];

            // Fetch data from MetService API
            try {
                const response = await fetch(apiBaseURL + apiOptions.OBSERVATION + location.replace(" ", "-"));
                var data = await response.json();
            } catch (error) {
                console.error(error);
            }

            const embed = baseObservation(data);

            client.channels.cache.get(guildChannels.OBSERVATION_CHANNEL).threads.fetch(channels.get(location))
                .then((thread) => thread.send({ embeds: [embed]}));
        }
    }

    const date = new Date();
    setInterval(run, 3_600_000 - (date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds()); // Runtime set every hour exactly
}