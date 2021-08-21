const { getWarnings } = require("../../structures/API")

module.exports = {
    name: "warnings",
    aliases: ["warn"],
    category: "Weather",
    description: "Displays the current Metservice issued warnings for a specified location in New Zealand.",
    utilisation: "{prefix}weather <location>",

    execute(client, message, args) {
        let city = args[0];

        if (!city) message.channel.send(client.emotes.error + " **Invalid usage:** `" + this.utilisation.replace("{prefix}", client.config.discord.prefix) + "`");

        if (args.length > 1) {
            for (let i = 1; i < args.length; i++) {
                city += "-" + args[i];
            }
        }
        
        getWarnings(client, city, message.channel.id);
    }
}