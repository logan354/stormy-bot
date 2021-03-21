module.exports = async (client) => {
    console.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);

    client.user.setActivity(`${client.emotes.cloud_rain} Rain Radar`, {
        type: "WATCHING",
        url: "https://www.metservice.com/maps-radar/rain/radar?range=300&tab=real-time"
    });
};