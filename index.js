const fs = require('fs');
const discord = require('discord.js');

//const client = new discord.Client({ disableMentions: 'everyone' });
const client = new discord.Client({ disableEveryone: false });

client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.commands = new discord.Collection();


//Passing through client to admincmd commands
const timedMessage = require('./commands/admincmd/timedMessage');
timedMessage(client)

const autoPublish = require('./commands/admincmd/auto-publish');
autoPublish(client)

const weatherAlert = require('./commands/admincmd/weather-alert');
weatherAlert(client)

// const testEnabler = require('./commands/admincmd/test');
// testEnabler(client)
//---------------------------------------------------------------


fs.readdirSync('./commands').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});


fs.readdirSync('./commands/utility').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/utility/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/utility/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

client.login(client.config.discord.token);