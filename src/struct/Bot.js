const config = require("dotenv").config();
const { join } = require("node:path");
const { readdirSync } = require("node:fs");
const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");


class Bot {
    constructor() {
        /**
         * The discord.js client of this bot
         * @type {Client}
         */
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages
            ]
        });

        /**
         * The commands collection of this bot
         * @type {Collection}
         */
        this.commands = new Collection();

        /**
         * The slash commands collection of this bot
         * @type {Collection}
         */
        this.slashCommands = new Collection();
    }

    start() {
        this.handleCommands();
        this.handleSlashCommands();
        this.handleEvents();
        //this.registerSlashCommands();

        this.client.login(process.env.DISCORD_TOKEN || config.discord_token);
    }

    destroy() {
        this.client.destroy();
    }

    handleCommands() {
        console.log("Loading commands...");

        const path = join(__dirname, "../commands");

        readdirSync(path).forEach(dir => {
            const files = readdirSync(`${path}/${dir}`).filter(file => file.endsWith(".js"));

            for (const file of files) {
                const command = require(`${path}/${dir}/${file}`);
                this.commands.set(command.name, command);
                console.log(`-> Loaded command ${command.name.toLowerCase()}`);
            }
        });
    }

    handleSlashCommands() {
        console.log("Loading slash commands...");

        const path = join(__dirname, "../slashCommands");

        readdirSync(path).forEach(dir => {
            const files = readdirSync(`${path}/${dir}`).filter(file => file.endsWith(".js"));

            for (const file of files) {
                const slashCommand = require(`${path}/${dir}/${file}`);
                this.slashCommands.set(slashCommand.name, slashCommand);
                console.log(`-> Loaded command ${slashCommand.name.toLowerCase()}`);
            }
        });
    }

    handleEvents() {
        console.log("Loading events...");

        const path = join(__dirname, "../events");
        const files = readdirSync(path).filter(file => file.endsWith(".js"));

        for (const file of files) {
            const event = require(`${path}/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(this, ...args));
            }

            console.log(`-> Loaded event ${event.name}`);
        }
    }

    async registerSlashCommands() {
        console.log("Registering application (/) commands...");

        const rest = new REST({ version: 10 }).setToken(process.env.DISCORD_TOKEN);

        try {
            const data = await rest.put(Routes.applicationGuildCommands(config.application_id, "718350376344223754"), {
                body: this.slashCommands.map((x) => x.data.toJSON())
            });

            console.log("Successfully registered " + data.length + " application (/) commands");
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Bot;