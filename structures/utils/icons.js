const { GuildEmoji } = require("discord.js");

// [name, URL, emojiId, ?[nightURL, emojiNightId]]
const icons = [
    [
        "Fine",
        "https://about.metservice.com/assets/img/icon-exp/_resampled/resizedimage5555-ic-condition-fine-tiny-2.png",
        "<:Fine:876238436112138331>",
        [
            "https://about.metservice.com/assets/Uploads/Fine-Night.png",
            "<:Night_Fine:876238635920408646>"
        ]
    ],
    [
        "Partly cloudy",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-partly-cloudy-tiny-2.png",
        "<:PartlyCloudy:876238435885658134>",
        [
            "https://about.metservice.com/assets/Uploads/Partly-Cloudy-Night.png",
            "<:Night_PartlyCloudy:876238635924615168>"
        ]
    ],
    [
        "Cloudy",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-cloudy-tiny.png",
        "<:Cloudy:876238436242182174>",
    ],
    [
        "Few showers",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-few-showers-tiny-2.png",
        "<:FewShowers:876238436028285048>",
        [
            "https://about.metservice.com/assets/Uploads/Few-Showers-Night.png",
            "<:Night_FewShowers:876238635396132905>"
        ]
    ],
    [
        "Showers",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-showers-tiny.png",
        "<:Showers:876238435894063115>"
    ],
    [
        "Rain",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-rain-tiny-2.png",
        "<:Rain:876238436053446667>"
    ],
    [
        "Drizzle",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-drizzle-tiny-2.png",
        "<:Drizzle:876238436267360336>"
    ],
    [
        "Fog",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-fog-tiny.png",
        "<:Fog:876238436212834304>"
    ],
    [
        "Snow",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-snow-tiny.png",
        "<:Snow:876238436347052072>"
    ],
    [
        "Windy",
        "https://about.metservice.com/assets/Uploads/Windy.png",
        "<:Wind:876238436305084436>"
    ],
    [
        "Wind rain",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-wind-and-rain-tiny-2.png",
        "<:WindRain:876238436011499611>"
    ],
    [
        "Thunder",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-thunder-tiny-2.png",
        "<:Thunder:876238436221210714>"
    ],
    [
        "Hail",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-hail-tiny-2.png",
        "<:Hail:876238436149911582>"
    ],
    [
        "Frost",
        "https://about.metservice.com/assets/img/icon-exp/ic-condition-frost-tiny.png",
        "<:Frost:876238435642404905>"
    ],
    [
        "Warning yellow",
        "https://about.metservice.com/assets/Uploads/_resampled/resizedimage8888-General-Watch.png",
        "<:Watch:878485283316842556>"
    ],
    [
        "Warning orange",
        "https://about.metservice.com/assets/Uploads/_resampled/resizedimage9079-General-Warning.png",
        "<:OrangeWarning:878485283396534313>"
    ],
    [
        "Warning red",
        "https://about.metservice.com/assets/Uploads/_resampled/resizedimage8980-General-Severe-Warning.png",
        "<:RedWarning:878485282947731488>"
    ]
]

/**
 * Gets a MetService icon url
 * @param {string} query 
 * @param {?string} type 
 * @returns {URL}
 */
function getIconURL(query, type = "day") {
    for (let iconObj of icons) {
        if (iconObj[0].toLowerCase() === query.toLowerCase()) {
            if (type.toLowerCase() === "night" || iconObj.length > 3) {
                return iconObj[3][0];
            }

            return iconObj[1];
        }
    }
}

/**
 * Gets a Discord emoji id to the related MetService icon
 * @param {string} query 
 * @param {?string} type 
 * @returns {GuildEmoji}
 */
function getIconEmojiID(query, type = "day") {
    for (let iconObj of icons) {
        if (iconObj[0].toLowerCase() === query.toLowerCase()) {
            if (type.toLowerCase() === "night" && iconObj.length > 3) {
                return iconObj[3][1];
            }

            return iconObj[2];
        }
    }
}

module.exports = { getIconURL, getIconEmojiID }