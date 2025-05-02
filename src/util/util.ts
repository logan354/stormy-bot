import emojis from "../../emojis.json";

export function getMetServiceIconEmoji(icon: string): string | undefined {
    let emoji;

    for (let i = 0; i < emojis.metservice_icons.length; i++) {
        if (emojis.metservice_icons[i].name === icon) {
            emoji = emojis.metservice_icons[i].value;
            break;
        }
        else continue;
    }

    return emoji;
}

export function formatTitleCase(str: string): string {
    return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function formatSnakeCase(str: string): string {
    return str.toLowerCase().replace(" ", "_");
}