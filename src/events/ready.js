const { Events, Client, ActivityType } = require("discord.js");
const Bot = require("../structures/Bot");

module.exports = {
    name: Events.ClientReady,
    once: true,

    /**
     * @param {Bot} bot
     * @param {Client} client 
     */
    execute(bot, client) {
        console.log(`Logged into the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);

        client.user.setPresence({
            activities: [
                {
                    name: "MetService",
                    type: ActivityType.Watching
                }
            ],
            status: "online"
        });
    }
}