import { Client, ClientEvents, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import "dotenv/config";
import fs from "node:fs";
import { join } from "node:path";

import Command from "./Command";
import config from "../../config.json";

export default class Bot extends Client<true> {
    public commands: Collection<string, Command> = new Collection();

    public components: Collection<string, any> = new Collection();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds
            ]
        });
    }

    public async create(): Promise<void> {
        console.log("Loading commands...");
        await this.loadCommands();

        console.log("Loading event listeners...");
        await this.loadEventListeners();

        await this.login(process.env.DISCORD_BOT_TOKEN);
    }

    private async loadCommands(): Promise<void> {
        // Load commands locally
        const directorys = fs.readdirSync(join(__dirname, "../interactions/commands"));

        for (const directory of directorys) {
            const files = fs.readdirSync(join(__dirname, `../interactions/commands/${directory}`));

            for (const file of files) {
                const command = (await import(`../interactions/commands/${directory}/${file}`)).default.default;
                this.commands.set(command.name, command);

                console.log(`-> Loaded command ${command.name}`);
            }
        }

        // Register commands remotely
        const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);

        try {
            console.log(`Started refreshing ${this.commands.size} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data: any = await rest.put(
                Routes.applicationGuildCommands(config.discord_application_id, "718350376344223754"),
                { body: this.commands.map((command) => command.data.toJSON()) },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }

    private async loadEventListeners(): Promise<void> {
        const files = fs.readdirSync(join(__dirname, "../events"));

        for (const file of files) {
            const event = (await import(`../events/${file}`)).default.default;

            if (event.once) {
                this.once(event.name, (...args: ClientEvents[keyof ClientEvents]) => event.execute(this, ...args));
            }
            else {
                this.on(event.name, (...args: ClientEvents[keyof ClientEvents]) => event.execute(this, ...args));
            }

            console.log(`-> Loaded event listener ${event.name}`);
        }
    }
}