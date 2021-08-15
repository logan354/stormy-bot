const { getWarnings } = require("../../structures/API")

module.exports = {
    name: "warnings",
    aliases: ["warn"],
    category: "Weather",
    description: "Displays the current Metservice issued warnings for a specified location in New Zealand.",
    utilisation: "{prefix}weather",

    execute(client, message, args) {
        getWarnings(client, args[0], message.channel.id);
    }
}