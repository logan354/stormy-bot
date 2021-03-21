module.exports = {
    name: 'dm',
    aliases: [],
    category: 'Private',
    utilisation: '{prefix}dm',

    async execute(client, message, args) {

        if (message.author.id === '499372750171799554') {

            if (args[1]) {
                const target = message.mentions.users.first();

                if (target) {
                    const targetID = target.id
                    const user = await client.users.fetch(targetID).catch(() => null);
                    const message = message.content.split(client.config.discord.prefix + `dm `)[1]

                    if (!user) return message.channel.send(`${client.emotes.error} - Failed to find that member`);

                    await user.send(`Hey ${target} Block354 wanted me to send you this message: ${message}`).catch(() => {
                        message.channel.send(`${client.emotes.error} - User has DMs closed or has no mutual servers with the bot`)
                    });

                    message.channel.send(`${client.emotes.success} - Successfully sent a DM to ${target}`)

                    //client.users.cache.get(targetID).send(`Hey ${target} Block354 wanted me to send you this message: ${args[1]}`)

                } else message.channel.send(`${client.emotes.error} - Failed to find that member`);

            } else message.channel.send(`${client.emotes.error} - What message do you want to send them`);

        } else message.channel.send(`${client.emotes.error} - **You do not have permission to use this command**`);

    }
}