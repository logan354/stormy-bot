const fs = require("fs");
const { Client, ActivityType } = require("discord.js");
const { guildId } = require("../utils/constants");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);

    client.user.setPresence({
        activities: [
            {
                name: "🌧️ MetService",
                type: ActivityType.Watching
            }
        ],
        status: "online"
    });

    /**
     * Loading all guild systems
     */
    if (client.config.app.startGuildSystems) {
        console.log("Loading " + client.guilds.cache.get(guildId).name + " guild systems...");

        const systems = fs.readdirSync("./structures/guildSystems").filter(file => file.endsWith(".js"));

        for (const file of systems) {
            const system = require(`../structures/guildSystems/${file}`);
            console.log(`-> Loaded system ${file.split(".")[0]}`);
            system(client);
        }
    }
}