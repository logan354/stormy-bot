const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.config = require("./config");
client.emotes = client.config.emojis;

client.commands = new Collection();
client.slashCommands = new Collection();

/**
 * Importing all commands
 */
console.log("Loading commands...");

fs.readdirSync("./commands").forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith(".js"));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`-> Loaded command ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
    }
});

/**
 * Importing all slash commands
 */
console.log("Loading slash commands...");

fs.readdirSync("./slashCommands").forEach(dirs => {
    const slashCommands = fs.readdirSync(`./slashCommands/${dirs}`).filter(files => files.endsWith(".js"));

    for (const file of slashCommands) {
        const slashCommand = require(`./slashCommands/${dirs}/${file}`);
        console.log(`-> Loaded slash command ${slashCommand.name.toLowerCase()}`);
        client.slashCommands.set(slashCommand.name.toLowerCase(), slashCommand);
    }
});

/**
 * Listening for all events
 */
console.log("Loading events...");

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> Loaded event ${file.split(".")[0]}`);
    client.on(file.split(".")[0], event.bind(null, client));
}

client.login(process.env.token);