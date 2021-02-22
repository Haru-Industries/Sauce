const Discord = require('discord.js');
var { version, prefix, owners } = require('./../config.json');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	async execute(message, args) {

    if (owners.includes(message.author.id)){


    var avatarurl = message.client.user.displayAvatarURL()
    if (!args.length) {
      //return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
      return emptyemb(avatarurl, message);
    }

const commandName = args[0].toLowerCase();
const command = message.client.commands.get(commandName)
	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

if (!command) return nocmd(commandName, avatarurl,message);
delete require.cache[require.resolve(`./${command.name}.js`)];
try {
	const newCommand = require(`./${command.name}.js`);
	message.client.commands.set(newCommand.name, newCommand);
  //message.channel.send(`Command \`${command.name}\` was reloaded!`);
  sendemb(command.name, avatarurl, message);
} catch (error) {
	console.error(error);
	//message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
  senderr(error, command.name, avatarurl, message);
}
} else {
        message.channel.send(`only owners can run this command`);
        return
        //perms owner
      }
	},
};


function sendemb(cmd, avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    //.setTitle(`Info`)
    .setDescription(`Successfully reloaded: ${cmd}.`)
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${avatarurl}`)
    return message.channel.send(exampleEmbed)
}

function senderr(err, cmd, avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    //.setTitle(`Info`)
    .setDescription(`Error reloading: ${cmd}.`)
    .addFields(
      { name: 'Error', value: err}
    )
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${avatarurl}`)
    return message.channel.send(exampleEmbed)
}

function nocmd(cmd, avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    //.setTitle(`Error`)
    .setDescription(`There is no command: ${cmd}.`)
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${avatarurl}`)
    return message.channel.send(exampleEmbed)
}

function emptyemb(avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    //.setTitle(`Info`)
    .setDescription(`I need a command to reload.`)
    .addFields(
      { name: 'Usage', value: `${prefix}reload <command>`}
    )
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${avatarurl}`)
    return message.channel.send(exampleEmbed)
}
