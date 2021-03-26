module.exports = {
    name: 'message',
    aliases: [],
    category: 'Private',
    utilisation: '{prefix}message',

    execute(client, message, args) {

        if (message.author.id === '499372750171799554') {


} else {
    message.channel.send(`${client.emotes.error} - **You do not have permission to use this command**`)
}

    }
}
