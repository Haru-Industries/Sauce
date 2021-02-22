const Discord = require('discord.js');
const Keyv = require('keyv');
const { version, owners } = require('./../config.json');
const prefixes = new Keyv('sqlite://prefixes.sqlite');
prefixes.on('error', err => console.log(`(Prefixes) Keyv connection error: ${err}`));


module.exports = {
    name: 'prefix',
    aliases: [],
    description: 'Show/change prefix',
    usage: '<prefix>',
    async execute(message, args) {
      if (owners.includes(message.author.id)){


      if (args.length) {
        await prefixes.set(message.guild.id, args[0]);
        //return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
        return emptyemb(`Prefix set to ${args[0]}`, message);
      }

      //return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
      return emptyemb(`Prefix is ${await prefixes.get(message.guild.id) || globalPrefix}`, message)
    } else {
            message.channel.send(`only owners can run this command`);
            return
            //perms owner
          }
    }
  }

  function emptyemb(desc, message) {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#EA28D4')
      //.setTitle(`Info`)
      .setDescription(`${desc}`)
      .addFields(
        //{ name: '', value: `${prefix}reload <command>`}
      )
      .setTimestamp()
      .setFooter(`${module.exports.name} • ${version}`, `${message.client.user.displayAvatarURL()}`)
      return message.channel.send(exampleEmbed)
  }
