module.exports = {
    name: 'test',
    aliases: [''],
    category: 'Core',
    utilisation: '{prefix}test',

    execute(client, message, args) {

        message.channel.send('It Worked')
    }
}