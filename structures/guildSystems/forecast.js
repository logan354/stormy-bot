const { Client } = require("discord.js");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    async function run() {
        const d = new Date();

        // NZST = UTC+12
        if (d.getUTCHours() !== 18 && d.getMinutes() !== 0) return;
    }

    setInterval(run, 60000);
}