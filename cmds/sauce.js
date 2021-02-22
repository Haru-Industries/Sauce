const Discord = require('discord.js')
const ValidUrl = require('valid-url');
const { saucenao, version } = require('./../config.json');
//const sagiri = require('sagiri');
const Sauce = require('node-sauce');
const { API, } = require('nhentai-api');
//const NanaAPI = require('nana-api');


module.exports = {
    name: 'sauce',
    aliases: [ 'pls' ],
    description: 'Provides Sauce',
    usage: '',
    async execute(message, args) {
      var avatarurl = message.client.user.displayAvatarURL()
      if (!message.channel.nsfw) {
        message.channel.send(`Must be in a nsfw channel.`);
        return;
      } else{
    if (args.length == 0){
      if (message.attachments.size > 0) {
      var url = (message.attachments).array()[0].url;

      const sauce = new Sauce(saucenao);
      sauce.dbmask = [18, 37, 29, 5]
      sauce.numres = 1
      //sauce(args[0]).then(result => message.channel.send(require('util').inspect(result), {split: true}));


      sauce(url).then(res => {
        //console.log(Object.values(res));
        var tostr = JSON.stringify(Object.values(res));
        //console.log(Object.values(res[0]))
        //var titl = ;
        var titl = JSON.stringify(Object.values(res[0]).map((key) => [key, res[key]])[2]).replace(/_/g, " ").split('["')[1].split('",null')[0].split("{")[0]
        //message.channel.send(titl)
        //var postsplit = tostr.replace("[","").replace("]","").replace(/\\/g, "").split('","');
        //var postsplit = tostr.replace("[","").replace("]","").replace(/\\/g, "").split('","');
        //var closegalname = postsplit[2].toString().split(":")[1];
        //var galname = closegalname.split('"');
        ///  try {
          //      galname = galname.replace(/_/g,"");
          //    } catch (e){
            //      console.log(`no replace`)
            //    }
            //message.channel.send(galname);
            //console.log(encodeURI(titl))
            var api = new API();
            api.search(encodeURI(titl)).then(res => {
              console.log(res);
              //message.channel.send(JSON.safeStringify(Object.values(res).map((key) => [key, res[key]])), { split: true })
              //message.channel.send(JSON.safeStringify(Object.values(res).map((key) => [key, res[key]])), { split: true })
              //message.channel.send(Object.getOwnPropertyNames(res['books'][0]['id']), { split: true })
              //message.channel.send(Object.entries(res['books'][0]), { split: true })
              //message.channel.send(res['books'][0]['id'], { split: true })
              //for (const [key, value] of Object.entries(res['books'][0])) {
              //  console.log(`${key}: ${value}`);
              //}
              //try {
              //  var galid = JSON.safeStringify(Object.values(res).map((key) => [key, res[key]])).split("id")[1].split(":")[1].split(",")[0]
              //} catch (err)   {
              //  //message.channel.send(`an error occured: ${err}; most likely a match was not found`)
              //  galerr(err, avatarurl, message);
              //}

              try {
                var reslen = res['books'].length
                console.log(`reslen: ${reslen}`)
                //message.channel.send(`books found: ${reslen}`)
                var galid = res['books'][0]['id'];
                if (!parseInt(galid)) {
                  return message.channel.send(`an error occured: ${err}; most likely a match was not found`)
                }
              } catch (err) {
                return message.channel.send(`an error occured: ${err}; most likely a match was not found`)
              }
              var sapi = new API();
              var gal = galid
              //message.channel.send(`gal: ${galid}`)
              api.getBook(gal).then(book => {
                //message.channel.send(sapi.getImageURL(book.cover))
                //message.channel.send(Object.getOwnPropertyNames(book.tags), { split: true })
                Object.getOwnPropertyNames(book.tags).forEach(function (val,idx,array) {
                  console.log(`${val} - ${Object.getOwnPropertyNames(book.tags[val])}`)
                })
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
                .setTitle(`Potential Gallery`)
                .setDescription(`Potential gallery: ${gal}`)
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
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#EA28D4')
                .setTitle(`Gallery information`)
                .setDescription(`Gallery ${gal}`)
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
                  { name: 'URL:', value: `https://nhentai.net/g/${gal}`}
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
              })
              //const nana = new NanaAPI();
              //nana.search(galname).then((res) => {
                //console.log(Object.values(res))
              })

    } else {
      //message.channel.send(`I need either an embedded image or url.`)
      emptyemb(avatarurl, message);
    }
  } else if(ValidUrl.isUri(args[0])){
    //var res
    //const client = sagiri(saucenao);
    //console.log(args[0])
    //const results = await client(args[0], {mask: [18]});
    //message.channel.send(require('util').inspect(results), {split: true});
    //console.log(results)
    const sauce = new Sauce(saucenao);
    sauce.dbmask = [18, 37, 29, 5]
    sauce.numres = 1
    //sauce(args[0]).then(result => message.channel.send(require('util').inspect(result), {split: true}));


    sauce(args[0]).then(res => {
      //console.log(Object.values(res));
      var tostr = JSON.stringify(Object.values(res));
      console.log(Object.values(res[0]))
      //var titl = ;
      var titl = JSON.stringify(Object.values(res[0]).map((key) => [key, res[key]])[2]).replace(/_/g, " ").split('["')[1].split('",null')[0].split("{")[0]
      //message.channel.send(titl)
      //var postsplit = tostr.replace("[","").replace("]","").replace(/\\/g, "").split('","');
      //var postsplit = tostr.replace("[","").replace("]","").replace(/\\/g, "").split('","');
      //var closegalname = postsplit[2].toString().split(":")[1];
      //var galname = closegalname.split('"');
    ///  try {
//      galname = galname.replace(/_/g,"");
//    } catch (e){
//      console.log(`no replace`)
//    }
      //message.channel.send(titl);
      //console.log(encodeURI(titl))
      var api = new API();
      api.search(encodeURI(titl)).then(res => {
        console.log(res);
      //  try {
      //    var galid = JSON.safeStringify(Object.values(res).map((key) => [key, res[key]])).split("id")[1].split(":")[1].split(",")[0]
      //  } catch (err)   {
      //    //message.channel.send(`an error occured: ${err}; most likely a match was not found`)
        //  galerr(err, avatarurl, message);
        //}

        try {
          var reslen = res['books'].length
          console.log(`reslen: ${reslen}`)
          var galid = res['books'][0]['id'];
          if (!parseInt(galid)) {
            return message.channel.send(`an error occured: ${err}; most likely a match was not found`)
          }
        } catch (err) {
          return message.channel.send(`an error occured: ${err}; most likely a match was not found`)
        }
        var sapi = new API();
        var gal = galid
        var tagslist = []
        //message.channel.send(gal)
        api.getBook(gal).then(book => {
          //message.channel.send(sapi.getImageURL(book.cover))
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
            .setTitle(`Potential Gallery`)
            .setDescription(`Potential gallery: ${gal}`)
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
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#EA28D4')
            .setTitle(`Gallery information`)
            .setDescription(`Gallery ${gal}`)
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
              { name: 'URL:', value: `https://nhentai.net/g/${gal}`}
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
      })
      //const nana = new NanaAPI();
      //nana.search(galname).then((res) => {
        //console.log(Object.values(res))
      })
      //console.log(galname)
    //  const api = new API();
    //  console.log(escapeRegExp(galname));
      //api.search(galname).then(book => {
        //console.log(book);
        //message.channel.send(api.getImageURL(book.cover));
        //message.channel.send(api.getImageURL(book.pages[1]));
    //  })

      //console.log(tosplit);
    //});

  //args[0] is link

    //message.channel.send(exampleEmbed);


  } else {
    message.channel.send(`No valid url or embedded image was found.`)
  }
    }
  }
}

//function escapeRegExp(input) {
//	const source = typeof input === 'string' || input instanceof String ? input : '';
//	return source.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//}

function replink(find,search) {
  var rep = "{}";
  var re = new RegExp(rep, "g");
  return search.replace(re, find)
}

JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};


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

function galerr(err, avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    .setTitle(`Error`)
    .setDescription(`An error occured: ${err}`)
    //.setImage(api.getImageURL(book.cover))
    .addFields(
      //{ name: 'Sauce bot/system info', value: '\u200b' },
      //{ name: '\u200B', value: '\u200B' },
      { name: '\u200B', value: `Most likely there were no results.`}
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

function emptyemb(avatarurl, message) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#EA28D4')
    //.setTitle(`Error`)
    .setDescription(`I need an image or url to search for`)
    //.setImage(api.getImageURL(book.cover))
    .addFields(
      //{ name: 'Sauce bot/system info', value: '\u200b' },
      //{ name: '\u200B', value: '\u200B' },
      //{ name: '', value: `Most likely there were no results.`}
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
