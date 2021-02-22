const Discord = require('discord.js');
const { API, } = require('nhentai-api');
const { Tag, } = require('nhentai-api');
const fs = require('fs');
const Keyv = require('keyv');
const { version, } = require('./../config.json');
const defaults = ['furry','lolicon','yaoi','scat','gore','ryona'];
var currpage
var tcheck
var gal
var url
var blacklist
var skipped

module.exports = {
    name: 'random',
    aliases: ['rand', 'r'],
    description: 'Provides the cover for a random gallery; will skip galleries that contain tags specified in the blacklist.',
    async execute(message, args) {
if (!message.channel.nsfw) {
  message.channel.send(`Must be in a nsfw channel.`);
  return;
} else {
try{
  var avatarurl = message.client.user.displayAvatarURL()
  const kblacklist = message.guild.id;
  var checklist = new Keyv('sqlite://bl.sqlite');
  checklist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
  if (typeof(await checklist.get(kblacklist)) == 'undefined') {
    await checklist.set(kblacklist, defaults).then(blemb(avatarurl, message)).catch((e) => message.channel.send(`error: ${e}`))
  }
  skipped = 0
  currpage = 0
  update(message);
  gallery(message);
}
catch(err)   {
  message.channel.send(`an error occured: ${err}`)
}}}};

async function update(message) {
  var rblist = new Keyv('sqlite://bl.sqlite');
  rblist.on('error', err => message.channel.send(`(blist) Keyv conn err: ${err}`)); //add embed
  //blacklist = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
  blacklist = await rblist.get(message.guild.id)
  //console.log(blacklist.length)
  if (typeof(blacklist) == 'undefined') {
    blacklist = await rblist.get('filter')
    return blacklist
}
return blacklist
console.log(blacklist)
}

function gallery(message){
  var avatarurl = message.client.user.displayAvatarURL()
  gal = rand(350000,000000);
  //var tcheck
  try {
  api = new API();
} catch (e) {
  return message.channel.send(e); //embed
}
  api.getBook(gal).then(book => {
    inttags = JSON.stringify(book.tags).toLowerCase().replace("[","").replace("]","").split("},{");
    ftags = inttags.filter(name => name.includes('tag'));
    tcheck = ftags.toString();
    //console.log(tcheck)
    arlen = blacklist.length
    //console.log(blacklist)
    tlen = ftags.length
    for (var i = 0; i < arlen; i++) {
      //console.log(blacklist)
      tagcheck = tcheck.indexOf(blacklist[i]);
      console.log(`${i+1} of ${arlen}  | checking for blacklisted terms...`);
      //message.channel.send(`${i+1} of ${arlen} | checking for blacklisted terms...`);
      if (tagcheck > 0) {
        //console.log(`found ${blacklist}`);
        i = arlen
        //console.log(gal);
        console.log(`Found blacklisted term at ${tagcheck}, skipping...`);
        //message.channel.send(`skipping gallery based on blacklist paramaters...`);
        skipped = skipped + 1
        //console.log(skipped)
        gallery(message);
      }
      }
      if (tagcheck != -1) {
      }else{
        console.log(`blacklisted terms not found\nGallery ${gal} marked as ok.\nsending url.`);
        //message.channel.send(`blacklisted terms not found\nGallery marked as ok.\nsending url.`);
        final = new API();
        api.getBook(gal).then(book => {

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
          .setDescription(`Randomly generated gallery: ${gal}`)
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
            { name: 'URL:', value: `https://nhentai.net/g/${gal}`}
          )
          .setTimestamp()
          //.setFooter(`Sauce • ${version} • (BL) ${skipped} Skipped`, `${avatarurl}`)


        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#EA28D4')
          .setTitle(`Random Gallery`)
          .setDescription(`Randomly generated gallery: ${gal}`)
          .setImage(api.getImageURL(book.cover))
          .addFields(
            //{ name: 'Sauce bot/system info', value: '\u200b' },
            //{ name: '\u200B', value: '\u200B' },
            { name: 'Gallery name', value: Object.values(book.title)},
            { name: 'Tags', value: fitags, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},
            { name: 'Page count', value: Object.values(book.pages).length, inline: true },
            { name: 'Uploaded', value: book.uploaded, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},
            //{ name: 'Skipped', value: `Based on blacklist: ${skipped}`, inline: true},

          )
          .setTimestamp()
          .setFooter(`${module.exports.name} • ${version} • (BL) ${skipped} Skipped`, `${avatarurl}`)

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
            napi.getBook(gal).then(book =>{
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
            nmapi.getBook(gal).then(book => {
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


}).catch((e) => senderr(e, gal, avatarurl, message))
      }
  }).catch((e) => senderr(e, gal, avatarurl, message))

}

function rand(min, max) {
return Math.floor(Math.random() * (max - min + 1) + min);
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

function blemb(avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    .setTitle(`Blacklist not found`)
    .setDescription(`Generating blacklist for ${message.guild.name} from defaults...`)
    //.setImage(api.getImageURL(book.cover))
    .addFields(
      //{ name: 'Sauce bot/system info', value: '\u200b' },
      //{ name: '\u200B', value: '\u200B' },
    //  { name: 'Gallery number', value: gal}
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
