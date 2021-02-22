const os = require('os');
const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");
const { version, owners, prefix } = require('./../config.json')
const Keyv = require('keyv');
const prefixes = new Keyv('sqlite://prefixes.sqlite');
prefixes.on('error', err => console.log(`(Prefixes) Keyv connection error: ${err}`));


module.exports = {
	name: 'info',
	description: 'Bot info/system info',
	aliases: ['status', 'stats'],
	usage: '[command name]',
async	execute(message, args) {
  const { commands } = message.client;
  	var cmds = commands.map(command => command.name).length
    var cpus = os.cpus();
    var cpumodel = JSON.stringify(os.cpus()).split("}");
    var longcpu = cpumodel.filter(name => name.includes('model'))[0];
    var exactcpu = JSON.stringify(longcpu).split(",");
    var showcpu = JSON.stringify(exactcpu[0]).replace("[","").replace("]","").replace(/\\/g, "").replace(/['|"]/g, "").split(":")
    var dispcpus = `${cpus.length}x ${showcpu[1]}`;
    var platform = os.platform();
    var mem = `${formatBytes(os.freemem(), 4)} free of ${formatBytes(os.totalmem(), 4)}`;
    var uptime = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    var ver = os.version();
    //console.log(message.client.uptime)
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#EA28D4')
      .setTitle(`Sauce ${version}`)
      //.setDescription('Saucy stuff about Sauce')
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: 'Creator', value: 'Joshj23#4817', inline: true},
        { name: 'Owner', value: owners , inline: true},
        { name: 'Prefixes', value: `Default: ${prefix} \nServer: ${await prefixes.get(message.guild.id)}`, inline: true},
        { name: 'Commands', value: cmds, inline: true },
        { name: 'Sauce uptime', value: uptime, inline: true},
        { name: 'Platform', value: platform, inline: true },
        { name: 'CPU(s)', value: dispcpus, inline: true },
        { name: 'Memory', value: mem, inline: true},
        { name: '\u200B', value: '\u200B', inline: true},
        { name: 'OS version', value: ver, inline: true}
      )
      .setTimestamp()
      .setFooter(`${module.exports.name} • ${version} • ${prefix}`,'https://images-ext-2.discordapp.net/external/juqFX2moxj0cvrsAw6_TBVwRd9InLh8NGR6y1PnjCHM/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/249044688571465729/4b06fcbe84025f764f6b534de26363fb.webp')

    message.channel.send(exampleEmbed);

	},
}

function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
