require('dotenv').config();
const Discord = require('discord.js');
const _ = require('lodash');

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Bot ${client.user.tag} está pronto para ser usado!`);
});

// Evento que é executado quando o bot recebe uma mensagem
client.on('messageCreate', async (message) => {
    // Verificando se a mensagem foi enviada por um bot
    if (message.author.bot) return;

    //Verificando se a mensagem começa com o prefixo '!aram'
    if (!message.content.startsWith('!aram')) return;

    let command = message.content.split(' ')
    console.log(command[1])

    if (command[1] == 'start') {
        message.reply("Quem serão os azarados que vão jogar com o Wesley ou Guijas? \nPasse os Nicks no seguinte padrão: Barbixinha/Lascaltinho/Patriquinho/...")

        createTeam().then(x => {
            message.channel.send(`Boa Gameplay, não se esqueçam das regras \n1- Ofender todos \n2- Não se matar pra torre\n3- Ofender todos\n4- Acertou bolinha de neve......... VAI\n5- Ofender todos (Não se esqueça do seu próprio time)\n6- Não de dodge \n7- Divirta-se`);
        }).catch(err => message.channel.send('Hmmmm, acho que alguma coisa ta mal programda'))
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

function createTeam() {
   return new Promise((resolve, reject) => {
        client.on('messageCreate', (messageStart) => {
            let matcher = messageStart.content.match("^([a-zA-Z0-9]+\/)+[a-zA-Z0-9]+$")
            if (matcher == null)
                return;

            const nomes = matcher[0].split('/'); // Separa os nomes em uma lista
            const nomesEmbaralhados = _.shuffle(nomes); // Embaralha aleatoriamente os nomes
            const metade = Math.ceil(nomesEmbaralhados.length / 2);

            const lista1 = nomesEmbaralhados.slice(0, metade);
            const lista2 = nomesEmbaralhados.slice(metade);

            messageStart.channel.send(`Time 1: ${lista1[0]}, ${lista1[1]}, ${lista1[2]} \nTime 2: ${lista2[0]}, ${lista2[1]}, ${lista2[2]}`)
            resolve();
        });
    })
}