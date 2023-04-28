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

        try {
            await createTeam();
        } catch (error) {
            console.error(error);
        }
    }
    if (command[1] == 'regras')
        message.channel.send(`O Livro das regras ainda não ta 100% pronto, mas na moral não se mata pra torre bobão.`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

function createTeam() {
    return new Promise((resolve, reject) => {
      const messageHandler = (messageStart) => {
        let matcher = messageStart.content.match("^([a-zA-Z0-9]+\/)+[a-zA-Z0-9]+$")
        if (matcher == null)
          return;
        console.log('Entrou')
        const names = matcher[0].split('/'); // Separa os names em uma lista
        if (names.length % 2 === 0) {
          console.log('Entrou MOD')
          const sortedNames = _.shuffle(names); // Embaralha aleatoriamente os names
          const half = Math.ceil(sortedNames.length / 2);
  
          const teamOneList = sortedNames.slice(0, half);
          const teamTwoList = sortedNames.slice(half);
  
          let teamOneNames = teamOneList.join(", ");
          let teamTwoNames = teamTwoList.join(", ");
          messageStart.channel.send(`Time 1: ${teamOneNames} \nTime 2: ${teamTwoNames}`)
          resolve();
        } else {
          messageStart.channel.send(`Infezlimente não quero fazer parte dessa crocodilagem de um time ficar -1, ainda mais se o Guijas tiver `)
          reject()
        }
      }
  
      client.off('message', messageHandler); // Remove o manipulador de eventos anterior, se existir
      client.on('message', messageHandler); // Adiciona o novo manipulador de eventos
    });
  }