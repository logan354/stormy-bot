import config from "../../config.json";

export function getMetServiceIconEmoji(icon: string): string | undefined {
    let emoji;

    for (let i = 0; i < config.emojis.metservice_icons.length; i++) {
        if (config.emojis.metservice_icons[i].name === icon) {
            emoji = config.emojis.metservice_icons[i].value;
            break;
        }
        else continue;
    }

    return emoji;
}