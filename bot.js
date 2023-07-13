const Discord = require('discord.js');
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.once('ready', () => {
    console.log("Bot started.");
});

// CHANGE THOSE VALUES
const MEDIA_CHANNEL_ID = process.env.MEDIA_CHANNEL_ID;
const GIF_LIMIT = 3;
const GIF_TIME_LIMIT = 90; // In seconds
const WARNING_TITLE = "Tu envoies trop de gifs !";
const WARNING_MESSAGE = "Merci de ne pas spammer les gifs.\nTu peux les envoyer dans le salon <#" + MEDIA_CHANNEL_ID + "> à la place.";

const gifMap = new Map();

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.channel.id != MEDIA_CHANNEL_ID && (message.content.startsWith("https://tenor.com/view/") || (message.content.includes("giphy.com") && message.content.includes("media")))) {

        // If the user has sent more than X gifs in the last Y seconds, delete the message and send them a warning.
        if (gifMap.has(message.author.id) && gifMap.get(message.author.id) >= GIF_LIMIT) {
            message.delete();
            const embed = new Discord.EmbedBuilder()
                .setColor('#eb4034')
                .setTitle(WARNING_TITLE)
                .setDescription(WARNING_MESSAGE)

            message.author.send({ embeds: [embed] });
            return;
        }

        if (gifMap.has(message.author.id)) {
            let count = gifMap.get(message.author.id);
            gifMap.set(message.author.id, count + 1);
        } else {
            gifMap.set(message.author.id, 1);
        }

        console.log("Incremented " + message.author.username + "'s counter to " + (gifMap.get(message.author.id)));
        setTimeout(decrementCounter, GIF_TIME_LIMIT * 1000, message.author);
    }
});

function decrementCounter(user) {
    console.log("Decrementing " + user.username + "'s counter");
    if (gifMap.has(user.id)) {
        let count = gifMap.get(user.id);
        if (count > 0) {
            gifMap.set(user.id, count - 1);
        }
    }
}

client.login(process.env.TOKEN);