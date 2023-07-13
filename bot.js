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


const MEDIA_CHANNEL_ID = "1086959321792925766";
const gifMap = new Map();

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.channel.id != MEDIA_CHANNEL_ID && (message.content.startsWith("https://tenor.com/view/") || (message.content.includes("giphy.com") && message.content.includes("media")))) {

        if (gifMap.has(message.author.id) && gifMap.get(message.author.id) >= 3) {
            message.delete();
            // Build embed
            const embed = new Discord.EmbedBuilder()
                .setColor('#eb4034')
                .setTitle('Tu envoies trop de gifs !')
                .setDescription(`Merci de ne pas spammer les gifs dans le général.\nTu peux les envoyer dans le salon <#${MEDIA_CHANNEL_ID}> à la place.`)

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
        setTimeout(decrementCounter, 10000, message.author);
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