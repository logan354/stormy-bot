const fs = require("node:fs")
const Bot = require("./Bot");
const { default: fetch } = require("node-fetch");
const { apiURL, APIEndpoints } = require("../util/constants");
const { forecastFormat, observationFormat, severeWeatherOutlookFormat } = require("./messagePayloads");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const guildSystemConfig = require("../../guild-system-config.json");

function start(bot) {
    setInterval(() => {
        const date = new Date();

        const dateTimeString = date.toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland"
        });

        const day = Number(date.toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            day: "numeric"
        }));

        const hour = Number(date.toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            hour: "numeric",
            hourCycle: "h24"
        }));

        const minutes = Number(date.toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            minute: "numeric"
        }));

        /**
         * Forecast intervals.
         * Executed every 6 hours.
         * Extra interval to save.
         */
        if (
            hour === 24 && minutes === 0 ||
            hour === 6 && minutes === 0 ||
            hour === 12 && minutes === 0 ||
            hour === 18 && minutes === 0 ||
            hour === 23 && minutes === 59
        ) {
            forecastSystem(bot);
        }

        /**
         * Observation, Severe Weather Outlook, and Thunderstorm Outlook intervals.
         * Executed every 3 hours.
         */
        if (
            minutes === 0 &&
            hour === 24 ||
            hour === 3 ||
            hour === 6 ||
            hour === 9 ||
            hour === 12 ||
            hour === 15 ||
            hour === 18 ||
            hour === 21
        ) {
            observationSystem(bot);
            severeWeatherOutlookSystem(bot);
            thunderstormOutlookSystem(bot);
        }

        /**
         * Warning intervals.
         * Executed every 15 mintues.
         */
        if (minutes === 0 ||
            minutes === 15 ||
            minutes === 30 ||
            minutes === 45
        ) {
            warningSystem(bot);
        }
    }, 60000);

    console.log("Successfully started guild system intervals.");
}

/**
 * The forecast system for the guild.
 * @param {Bot} bot 
 * @param {string} dateTimeString
 */
async function forecastSystem(bot, dateTimeString, day) {
    for (let i = 0; i < forecastChannels.length; i++) {
        let rawData = null;
        try {
            // Fetch json data from MetService API
            const response = await fetch(apiURL + APIEndpoints.FORECAST + forecastChannels[i][1].replace(" ", "-"));
            rawData = await response.json();
        } catch (error) {
            console.error(error);
        }

        if (!rawData) {
            let message = null;
            bot.client.channels.fetch(forecastChannels[i][0])
                .then(async (channel) => {
                    message = await channel.send({ embeds: payload, components: [row] });
                })
                .catch((error) => {
                    console.error(error);
                });

            fs.writeFileSync(`./data/saves/${forecastChannels[i][0]}-save.json`,
                {
                    saved_at: dateTimeString,
                    message_id: message.id,
                    data: null
                }
            );

            return;
        }

        let saveData = null;
        fs.readFileSync(`./data/saves/${forecastChannels[i][0]}-save.json`, (error, data) => {
            if (error) {
                throw error;
            }

            saveData = JSON.parse(data);
        });

        if (rawData !== saveData.data) {
            // Format the raw location string to a title string
            const rawLocationSplit = rawData.locationIPS.toLowerCase().split(" ");
            for (let i = 0; i < rawLocationSplit.length; i++) {
                rawLocationSplit[i] = rawLocationSplit[i].charAt(0).toUpperCase() + rawLocationSplit[i].substring(1);
            }

            const data = [];
            const location = rawLocationSplit.join(" ");
            const outlook = 5;

            for (let i = 0; i < outlook || i < rawData.days.length; i++) {
                data.push(rawData.days[i]);
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Forecasts")
                            .setURL("https://www.metservice.com/national")
                            .setStyle(ButtonStyle.Link),
                    ]
                );

            const payload = forecastFormat(data, location, true);

            bot.client.channels.fetch(forecastChannels[i][0])
                .then(async (channel) => {
                    const message = await channel.send({ embeds: payload, components: [row] });
                })
                .catch((error) => {
                    console.error(error);
                });

            fs.writeFileSync(`./data/saves/${forecastChannels[i][0]}-save.json`,
                {
                    saved_at: dateTimeString,
                    message_id: message.id,
                    data: JSON.stringify(rawData)
                }
            );
        }
    }
}

/**
 * The observation system for the guild.
 * @param {Bot} bot 
 */
async function observationSystem(bot) {
    for (let i = 0; i < guildSystemConfig.observation_channels.length; i++) {
        let rawData = null;
        try {
            // Fetch json data from MetService API
            const response = await fetch(apiURL + APIEndpoints.OBSERVATION + guildSystemConfig.observation_channels[i][1].replace(" ", "-"));
            rawData = await response.json();
        } catch (error) {
            console.error(error);
        }

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Observations")
                        .setURL("https://www.metservice.com/national")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        // Format json data to a Discord message format
        const payload = observationFormat(rawData);

        bot.client.channels.fetch(guildSystemConfig.observation_channels[i][0])
            .then(async (channel) => {
                channel.send({ embeds: payload, components: [row] });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

async function warningSystem(bot) { }

/**
 * The severe weather outlook system for the guild.
 * @param {Bot} bot 
 */
async function severeWeatherOutlookSystem(bot) {
    let rawData = null;
    try {
        // Fetch json data from MetService API
        const response = await fetch(apiURL + APIEndpoints.SEVERE_WEATHER_OUTLOOK);
        rawData = await response.json();
    } catch (error) {
        console.error(error);
    }

    const payload = severeWeatherOutlookFormat(rawData);
}

async function thunderstormOutlookSystem(bot) { }