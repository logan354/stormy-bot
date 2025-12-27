import { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";

import Bot from "./Bot";

interface Interaction {
    name: string;
    execute(bot: Bot, interaction: ChatInputCommandInteraction): Promise<void>
}

export default Interaction;