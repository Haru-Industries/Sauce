const { prefix, version } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of Sauce\'s commands or info about a specific command.',
	aliases: ['commands', 'h'],
	usage: '[command name]',
	cooldown: 5,
	async execute(message, args) {
    const data = [];
const { commands } = message.client;

if (!args.length) {
  //data.push('Here\'s a list of all my commands:');
	var cmds = commands.map(command => command.name).join(', ')
//data.push(commands.map(command => command.name).join(', '));
//data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
//return message.channel.send(data, { split: true })
return sendgen(message, cmds)
	.then(() => {
		//if (message.channel.type === 'dm') return;
		//message.reply('I\'ve sent you a DM with all my commands!');
	})
	.catch(error => {
		//console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
		//message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
	});
}
const name = args[0].toLowerCase();
const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

if (!command) {
	//return message.reply('that\'s not a valid command!');
	return sendnom(message);
}

///data.push(`**Name:** ${command.name}`);

///if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
///if (command.description) data.push(`**Description:** ${command.description}`);
///if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

//data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

///message.channel.send(data, { split: true });
sendspec(message, command)

	},
};


function sendgen(message, cmds) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    .setTitle(`Commands`)
    .setDescription(`Here's a list of my commands\nYou can use ${prefix}help <command> for specific commands`)
    .addFields(
      { name: '\u200B', value: cmds}
    )
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${message.client.user.displayAvatarURL()}`)
    return message.channel.send(exampleEmbed)
}
function sendnom(message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    .setTitle(`Commands`)
    .setDescription(`No matches for command`)
    .addFields(
      //{ name: 'Usage', value: `${prefix}reload <command>`}
    )
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${message.client.user.displayAvatarURL()}`)
    return message.channel.send(exampleEmbed)
}

function sendspec(message, command) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    //.setTitle(`Info`)
    .setDescription(`Help for ${command.name}`)
    .addFields(
			{ name: 'Usage', value: `${prefix}${command.name} ${command.usage}`},
			{ name: 'Aliases', value: `${command.aliases.join(', ')}`, inline: true},
      { name: 'Description', value: `${command.description}`, inline: true}
    )
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${message.client.user.displayAvatarURL()}`)
    return message.channel.send(exampleEmbed)
}
