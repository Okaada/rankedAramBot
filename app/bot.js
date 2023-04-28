require('dotenv').config();
const Discord = require('discord.js');
const _ = require('lodash');

const { Client, Intents } = require('discord.js');

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log(`Bot ${client.user.tag} está pronto para ser usado!`);
});

// Evento que é executado quando o bot recebe uma mensagem
client.on('message', async (message) => {
    // Verificando se a mensagem foi enviada por um bot
    if (message.author.bot) return;

    //Verificando se a mensagem começa com o prefixo '!aram'
    if (!message.content.startsWith('!aram')) return;
    let command = message.content.split(' ')

    if (command[1] == 'start') {
        message.reply("Quem serão os azarados que vão jogar com o Wesley ou Guijas? \nPasse os Nicks no seguinte padrão: Barbixinha/Lascaltinho/Patriquinho/...")
        await waitForMessage(message)
    }
    if (command[1] == 'regras')
        message.channel.send(`O Livro das regras ainda não ta 100% pronto, mas na moral não se mata pra torre bobão.`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

function waitForMessage(message) {
    return new Promise((resolve, reject) => {
        const filter = (response) => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {
            time: 30000,
            max: 1,
        });

        collector.on("collect", (response) => {
            const matcher = response.content.match("^([a-zA-Z0-9]+\/)+[a-zA-Z0-9]+$");

            if (matcher == null) {
                message.channel.send(
                    "Você ta de sacanagem? Eu FALEI O PADRÃO CERTINHO");
                return;
            }

            const names = matcher[0].split("/");

            if (names.length % 2 === 0) {
                const sortedNames = _.shuffle(names);
                const half = Math.ceil(sortedNames.length / 2);

                const teamOneList = sortedNames.slice(0, half);
                const teamTwoList = sortedNames.slice(half);

                const teamOneNames = teamOneList.join(", ");
                const teamTwoNames = teamTwoList.join(", ");
                message.channel.send(`Time 1: ${teamOneNames}\nTime 2: ${teamTwoNames}`);
                message.channel.send(`Boa Gameplay, não se esqueçam das regras:\n\n1- Ofender todos\n2- Não se matar pra torre\n3- Ofender todos\n4- Acertou bolinha de neve......... VAI\n5- Ofender todos (Não se esqueça do seu próprio time)\n6- Não de dodge\n7- Divirta-se`);
                resolve(response.content);
            } else {
                message.channel.send(
                    "Infezlimente não quero fazer parte dessa crocodilagem de um time ficar -1, ainda mais se o Guijas tiver"
                );
                return;
            }

            collector.stop();
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
                message.channel.send("Tempo esgotado.");
                resolve("timeout");
            }
        });
    });
}
