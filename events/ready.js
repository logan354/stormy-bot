const { getIconEmoji } = require("../structures/Database");

module.exports = async (client) => {
    console.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);

    client.user.setActivity("🌧️ Rain Radar", {
        type: "WATCHING",
    });
}