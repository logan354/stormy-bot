const Bot = require("./struct/Bot");

const bot = new Bot().start();

let index = 0;

            // Send message and await response
            const response = await message.channel.send({ embeds: [payload[0][index]], components: [row2] });

            // Collect button responses for a certain period of time
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            // Collector
            collector.on("collect", (i) => {
                if (i.customId === "forecast-button-previous") {
                    index--;

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index <= 0) {
                        newRow2.components[1].setDisabled();
                    }

                    newRow2.components[2].setDisabled(false);

                    i.update({ embeds: [payload[0][index]], components: [row2] });
                }
                else if (i.customId === "forecast-button-next") {
                    index++;

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index >= payload[0].length - 1) {
                        newRow2.components[2].setDisabled();
                    }

                    newRow2.components[1].setDisabled(false);

                    i.update({ embeds: [payload[0][index]], components: [row2] });
                }
            });

            // Collector end
            collector.on("end", (collected, reason) => {
                const newRow2 = new ActionRowBuilder(row2);
                newRow2.components[1].setDisabled();
                newRow2.components[2].setDisabled();

                response.edit({ components: [newRow2] });
            });