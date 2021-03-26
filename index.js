const fs = require('fs');
const discord = require('discord.js');

//const client = new discord.Client({ disableMentions: 'everyone' });
const client = new discord.Client({ disableEveryone: false });

client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.commands = new discord.Collection();


//Passing through client to servercmd commands
const timedMessage = require('./commands/servercmd/weather-commands/timedMessage');
timedMessage(client)

const autoPublish = require('./commands/servercmd/weather-commands/auto-publish');
autoPublish(client)

// const weatherAlert = require('./commands/servercmd/weather-commands/weather-alert');
// weatherAlert(client)

const twitter = require('./commands/servercmd/weather-commands/twitter');
twitter(client)

// const testEnabler = require('./commands/admincmd/test');
// testEnabler(client)
//---------------------------------------------------------------


fs.readdirSync('./commands/servercmd').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/servercmd/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/servercmd/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});


fs.readdirSync('./commands/maincmd').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/maincmd/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/maincmd/${dirs}/${file}`);
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