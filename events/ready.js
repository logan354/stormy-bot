const fs = require("fs");
const { Client } = require("discord.js");
const { guildId } = require("../src/guildSystems/utils/constants");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);

    client.user.setPresence({
        activities: [
            {
                name: "🌧️ MetService",
                type: "WATCHING"
            }
        ],
        status: "online"
    });

    /**
     * Loading all guild systems
     */
    if (client.startGuildSystems) {
        console.log("Loading " + client.guilds.cache.get(guildId).name + " guild systems...");

        const systems = fs.readdirSync("./src/guildSystems").filter(file => file.endsWith(".js"));

        for (const file of systems) {
            const system = require(`../src/guildSystems/${file}`);
            console.log(`-> Loaded system ${file.split(".")[0]}`);
            system(client);
        }
    }

    /**
     * Registering all slash commands
     */
    console.log("Registering slash commands...");

    const data = [];
    client.slashCommands.forEach((slashCommand) => data.push(slashCommand));
    client.application.commands.set(data);


    console.log("Successful startup...");
}