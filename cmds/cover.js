const Discord = require('discord.js');
const { API, } = require('nhentai-api');
const { version } = require('./../config.json')
var currpage
var skipped

module.exports = {
    name: 'cover',
    aliases: [ 'c', 'gallery', 'g', 't', 'tags' ],
    description: 'provides cover for gallery specified',
    async execute(message, args) {
currpage = 0
skipped = 0
var avatarurl = message.client.user.displayAvatarURL()

      if (!message.channel.nsfw) {
        message.channel.send(`Must be in a nsfw channel.`);
        return;
      } else{
      if (typeof(args[0]) == 'undefined'){
        message.channel.send(`Up to a 6 digit number is required`);
        return;
      };
    if (args[0].length <= 6){

      const api = new API();
      api.getBook(args[0]).then(book => {
        var inttags = JSON.stringify(book.tags).toLowerCase().replace("[","").replace("]","").replace(/\\/g, "").split("},{");
        var ftags = inttags.filter(name => name.includes('tag'));
        var tcheck = JSON.stringify(ftags).replace("[","").replace("]","").replace(/\\/g, "").replace(/['|"]/g, "").split("},").filter(name => name.includes('name'));
        var onlytags = JSON.stringify(tcheck).replace("[","").replace("]","").split(",").filter(name => name.includes('name'));
        var finaltags = JSON.stringify(onlytags).replace("[","").replace("]","").replace(/\\/g, "").replace(/['|"]/g, "").split(":");
        var finaltags = JSON.stringify(finaltags).replace("[","").replace("]","").replace(/\\/g, "").replace(/['|"]/g, "").split(",");
        var stags = finaltags.filter(name => !name.includes('name'));
        var fitags = JSON.stringify(stags).replace("[","").replace("]","").replace(/\\/g, "").replace(/['|"]/g, "").replace(/,/g, ", ")
        //console.log(stags);

        const editEmbed = new Discord.MessageEmbed()
          .setColor('#EA28D4')
          .setTitle(`Random Gallery`)
          .setDescription(`Randomly generated gallery: ${args[0]}`)
          .addFields(
            //{ name: 'Sauce bot/system info', value: '\u200b' },
            //{ name: '\u200B', value: '\u200B' },
            { name: 'Gallery name', value: Object.values(book.title)},
            { name: 'Tags', value: fitags, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},
            { name: 'Page count', value: Object.values(book.pages).length, inline: true },
            { name: 'Uploaded', value: book.uploaded, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},
          //  { name: 'Skipped', value: `Based on blacklist: ${skipped}`, inline: true},
            //{ name: 'Current page', value: `${currpage+1} of ${Object.values(book.pages).length }`, inline: true},
            { name: 'URL:', value: `https://nhentai.net/g/${args[0]}`}
          )
          .setTimestamp()
        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#EA28D4')
          .setTitle(`Gallery information`)
          .setDescription(`Gallery ${args[0]}`)
          .setImage(api.getImageURL(book.cover))
          .addFields(
            //{ name: 'Sauce bot/system info', value: '\u200b' },
            //{ name: '\u200B', value: '\u200B' },
            { name: 'Gallery name', value: Object.values(book.title)},
            { name: 'Tags', value: fitags, inline: true},
            { name: 'Page count', value: Object.values(book.pages).length, inline: true },
            //{ name: 'Favourited', value: book.favourites, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},
            { name: 'Uploaded', value: book.uploaded, inline: true},
            { name: 'URL:', value: `https://nhentai.net/g/${args[0]}`}
          )
          .setTimestamp()
          .setFooter(`${module.exports.name} • ${version}`,`${message.client.user.displayAvatarURL()}`)

        message.channel.send(exampleEmbed).then(async function (message) {
          await message.react('◀️');
          await message.react('🔂');
          await message.react('▶️');
          await message.react('❌');


          const filter = (reaction, user) => reaction.emoji.name === '◀️' || reaction.emoji.name === '🔂' || reaction.emoji.name === '▶️' || reaction.emoji.name === '❌';
  			  const collector = message.createReactionCollector(filter, {
  				time: 600000
  			});
  			collector.on('collect', (r, user) => {
          //console.log(`Collected ${r.emoji.name}`)
          const reac = r.emoji.name;
          if (reac === "◀️") {
            message.reactions.cache.find(r => r.emoji.name == '◀️').users.remove(user);
            currpage = currpage -1
            const napi = new API();
            napi.getBook(args[0]).then(book =>{
               if (currpage < 0) {
                currpage = Object.values(book.pages).length;
                currpage = currpage -1
              }}).then(() => {message.edit(editEmbed.setImage(api.getImageURL(book.pages[currpage])).setFooter(`${module.exports.name} • ${version} • (BL) ${skipped} Skipped • Page ${currpage+1} of ${Object.values(book.pages).length }`, `${avatarurl}`)
)})
          } else if (reac === "🔂") {
            message.reactions.cache.find(r => r.emoji.name == '🔂').users.remove(user);
            currpage = 0
            message.edit(editEmbed.setImage(api.getImageURL(book.pages[currpage])).setFooter(`${module.exports.name} • ${version} • (BL) ${skipped} Skipped • Page ${currpage+1} of ${Object.values(book.pages).length }`, `${avatarurl}`))
          } else if (reac === "▶️") {
            message.reactions.cache.find(r => r.emoji.name == '▶️').users.remove(user);
            currpage = currpage + 1
            nmapi = new API();
            nmapi.getBook(args[0]).then(book => {
              if (currpage >= Object.values(book.pages).length) {
                currpage = 0;
              }}).then(() => message.edit(editEmbed.setImage(api.getImageURL(book.pages[currpage])).setFooter(`${module.exports.name} • ${version} • (BL) ${skipped} Skipped • Page ${currpage+1} of ${Object.values(book.pages).length }`, `${avatarurl}`)))
          } else if (reac === "❌"){
            message.reactions.removeAll();
            //message.channel.send(`collected ${reac}; stopping`)
            collector.stop();
          }
        });
  			collector.on('end', collected => console.log(`Collected ${collected.size} items`));
});

        //message.channel.send(JSON.safeStringify(book), { split: true});
        //console.log(book.pages)
        //message.channel.send(`Tags for gallery ${args[0]}: ||${fitags}||`);


      }).catch((e) => senderr(e, args[0], avatarurl, message))



    } else {
      message.channel.send(`Up to a 6 digit number is required`)
    }

  }
}
}

function senderr(err, gal, avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    .setTitle(`Error`)
    .setDescription(`An error occured: ${err}`)
    //.setImage(api.getImageURL(book.cover))
    .addFields(
      //{ name: 'Sauce bot/system info', value: '\u200b' },
      //{ name: '\u200B', value: '\u200B' },
      { name: 'Gallery number', value: gal}
      //{ name: 'Tags', value: fitags, inline: true},
      //{ name: '\u200B', value: '\u200B', inline: true},
      //{ name: 'Page count', value: Object.values(book.pages).length, inline: true },
      //{ name: 'Uploaded', value: book.uploaded, inline: true},
      //{ name: '\u200B', value: '\u200B', inline: true},
      //{ name: 'Skipped', value: `Based on blacklist: ${skipped}`, inline: true},
      //{ name: 'URL:', value: `https://nhentai.net/g/${gal}`}
    )
    .setTimestamp()
    .setFooter(`${module.exports.name} • ${version}`, `${avatarurl}`)
    return message.channel.send(exampleEmbed)
}
