const { Client } = require("discord.js");

const alert_system = require("../structures/guildSystems/alert-system");
const twitter_system = require("../structures/guildSystems/twitter-system");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);

    client.user.setPresence({
        activities: [
            {
                name: "🌧️ Rain Radar",
                type: "WATCHING"
            }
        ],
        status: "online"
    });

    console.log("Starting guild weather warning and twitter systems...");

    alert_system(client);
    twitter_system(client);

    console.log("Registering slash commands...");

    const data = [];

    client.slashCommands.forEach((slashCommand) => data.push(slashCommand));

    client.application.commands.set(data);

    console.log("Successful startup...");
}