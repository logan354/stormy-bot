const fs = require("fs");
const dotenv = require("dotenv");
const { Client, Intents, Collection } = require("discord.js");
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

client.config = require("./config");
client.emotes = client.config.emojis;
client.commands = new Collection();

console.log("Loading commands...");

fs.readdirSync("./commands").forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith(".js"));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`-> Loaded command ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
    }
});

console.log("Loading events...");

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> Loaded event ${file.split(".")[0]}`);
    client.on(file.split(".")[0], event.bind(null, client));
}

const init = require("./commands/Server/instance");
init(client);

client.login(process.env.token);