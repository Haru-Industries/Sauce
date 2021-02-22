const Keyv = require('keyv');
const fs = require('fs');
var bl = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
//const kblacklist = 'filter'
const defaults = ['furry','lolicon','yaoi','scat','gore','ryona'];
const { owners } = require('./../config.json');

module.exports = {
    name: 'blacklist',
    aliases: [ 'bl', 'b' ],
    description: 'Blacklist related functions, Add, Remove, Reset and Save Blacklisted Terms',
    usage: '\n**Show:** Show the length of the blacklist. use show all/list all to show the actual filter items\n**Reset:** Resets DB to values stored in the blacklist file.\n**Add:** Adds values as you type it in, if adding multiple separate it by comma `,` with no space inbetween. Item1,Item2\n**Remove:** TBD\n**Save:** Saves updated blacklist to the blacklist file.',
    async execute(message, args) {

      if (owners.includes(message.author.id)){


      const kblacklist = message.guild.id;
      var checklist = new Keyv('sqlite://bl.sqlite');
      checklist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
      if (typeof(await checklist.get(kblacklist)) == 'undefined') {
        await checklist.set(kblacklist, defaults).then(message.channel.send(`Blacklist for ${message.guild.name} not found; creating from defaults.`)).catch((e) => messag.channel.send(`error: ${e}`))
      }

    //  if (!message.channel.nsfw) {
        //message.channel.send(`channel`);
        //return;
    //  } else {
      if (args[0] == 'list' || args[0] == 'show') {
        if (!args[1]) {
        message.channel.send(`Use show all/list all to show the values.`);
        var blist = new Keyv('sqlite://bl.sqlite');
        blist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
        var bl2 = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
        message.channel.send(`Server BL: ${JSON.stringify(await blist.get(kblacklist)).split(",").length} item(s)\nFile BL: ${bl2.length} item(s)\nDefault BL: ${JSON.stringify(defaults).split(",").length} item(s)`);
      } else if (args[1] == 'all') {
        //message.channel.send(`disabled for now.`);
        var lblist = new Keyv('sqlite://bl.sqlite');
        lblist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
        var bl2 = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
        message.channel.send(`All item(s) in the blacklist:\nServer   :||${await lblist.get(kblacklist)}||\nFile        :||${bl2}||\nDefaults :||${JSON.stringify(defaults).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",")}||`);
        //console.log(`Current item(s) in the blacklist: ||${await blist.get('filter')}||`);

      } else if (args[1] == 'server') {
        var lblist = new Keyv('sqlite://bl.sqlite');
        lblist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
        message.channel.send(`Server blacklist contents: ||${await lblist.get(kblacklist)}||`);
      } else if (args[1] == 'file') {
        var bl2 = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
        message.channel.send(`File blacklist contents: ||${bl2}||`);
      } else if (args[1] == 'defaults' || args[1] == 'default') {
        message.channel.send(`Default blacklist contents: ||${JSON.stringify(defaults).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",")}||`);
      }
      } else if(args[0] == 'reset'){
        message.channel.send(`Resetting blacklist from defauts...`)
        var reblist = new Keyv('sqlite://bl.sqlite');
        //var ubl = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");

        await reblist.set(kblacklist, defaults);
        //console.log(defaults)
        //bl = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
        //console.log(await reblist.get('filter'))
        message.channel.send(`Reset complete. new blacklist length: ${JSON.stringify(await reblist.get(kblacklist)).split(",").length}`);
        //console.log(await reblist.get(kblacklist))
      } else if(args[0] == 'add' || args[0] == 'a'){
        //console.log(bl);
        try {
          var nitems = JSON.stringify(args).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",");
          nitems.splice(0,1);
          nitems = nitems.toString().replace(/,/g, " ");
          if (nitems.length < 1) {
            message.channel.send(`New item must be more than 0 characters long.`);
            return;
          }
            var tagcheck
            var chblist = new Keyv('sqlite://bl.sqlite');
            chblist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
            chbl = JSON.stringify(await chblist.get(kblacklist)).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",");
            //console.log(chbl)
            arlen = chbl.length
            //console.log(arlen)
            for (var i = 0; i < arlen; i++) {
              tagcheck = chbl.indexOf(nitems);
              //console.log(`${i+1} of ${arlen} | checking for blacklisted terms...`);
              //console.log(`checking for ${nitems}`)
              //message.channel.send(`${i+1} of ${arlen} | checking for blacklisted terms...`);
              if (tagcheck > 0) {
                //console.log(`found ${nitems}`);
                message.channel.send(`||${nitems}|| already exists`);
                i = arlen
                return;
              }
            }
            //console.log(tagcheck)
            if (tagcheck = -1) {
                var blist = new Keyv('sqlite://bl.sqlite');
                blist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
                bl2 = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
                bl2.push(JSON.stringify(nitems).replace("[", "").replace("]", "").replace(/['|"]/g, ""));
                await blist.set(kblacklist, bl2);
                //console.log(await blist.get('filter'));
                message.channel.send(`Added ||${nitems}|| to the blacklist`);
                console.log(`\n[Sauce] | Added new item to blacklist.`);
                console.log(`[Sauce] | New blacklist length: ${JSON.stringify(await blist.get(kblacklist)).split(",").length} item(s)`);
              }

          //console.log(nitems.length);
          //var nitems = JSON.stringify(arrnitems).replace("[", "").replace("]", "").replace(/['|"]/g, "");
          //for (var i = 0; i < nitems.length; i++) {
          //  bl.push(JSON.stringify(nitems[i]).replace("[", "").replace("]", "").replace(/['|"]/g, ""));
          //}
      } catch(e) {
        message.channel.send(`An error occured: ${e}`);
      }

      } else if( args[0] == 'remove' || args[0] == 'rm') {
          //console.log(`remove`);
          try {
            //----
            var nitems = JSON.stringify(args).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",");
            nitems.splice(0,1);
            nitems = nitems.toString().replace(/,/g, " ");
            if (nitems.length < 1) {
              message.channel.send(`Item to remove must be more than 0 characters long.`);
              return;
            }
              var tagcheck
              var chblist = new Keyv('sqlite://bl.sqlite');
              chblist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
              chbl = JSON.stringify(await chblist.get(kblacklist)).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",");
              //console.log(chbl)
              arlen = chbl.length
              //console.log(arlen)
              for (var i = 0; i < arlen; i++) {
                tagcheck = chbl.indexOf(nitems);
                //console.log(tagcheck)
                //console.log(`${i+1} of ${arlen} | checking for blacklisted terms...`);
                //console.log(`checking for ${nitems}`)
                //message.channel.send(`${i+1} of ${arlen} | checking for blacklisted terms...`);
                if (tagcheck > 0) {
                  //console.log(`found ${nitems}`);
                  message.channel.send(`Found ||${nitems}|| in blacklist; Deleting...`);
                  var blist = new Keyv('sqlite://bl.sqlite');
                  blist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
                  //bl3 = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
                  //console.log(nitems);
                  //bl3.splice(JSON.stringify(nitems).replace("[", "").replace("]", "").replace(/['|"]/g, ""));
                  //console.log(bl3);
                  bl3 = JSON.stringify(await blist.get(kblacklist)).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",");

                  bl3.splice(tagcheck, 1);
                  //console.log(bl3);
                  //console.log(bl3);
                  await blist.set(kblacklist, bl3);

                  i = arlen
                  return;
                }
              }
              //console.log(tagcheck)
              if (tagcheck = -1) {
                message.channel.send(`||${nitems}|| wasnt found.`)
                  //console.log(await blist.get('filter'));
                  //message.channel.send(`Added ||${nitems}|| to the blacklist`);
                  //console.log(`\n[Sauce] | Added new item to blacklist.`);
                //  console.log(`[Sauce] | New blacklist length: ${JSON.stringify(await blist.get('filter')).split(",").length} item(s)`);
                }
          //  -----
          } catch (e) {
            message.channel.send(`An error occured: ${e}`)
          }
      } else if ( args[0] == 'reload' || args[0] == 'r') {
          //console.log(`reload db from file`);
          message.channel.send(`Reloading DB values from blacklist file...`);
          var rblist = new Keyv('sqlite://bl.sqlite');
          rblist.on('error', err => message.channel.send(`(blist) Keyv conn err: ${err}`));
          await rblist.set(kblacklist, bl);
          message.channel.send(`(blist) Loaded ${JSON.stringify(await rblist.get(kblacklist)).split(",").length} item(s) to DB.`);
      } else if (args[0] == 'save' || args[0] == 's'){
          var rblist = new Keyv('sqlite://bl.sqlite');
          rblist.on('error', err => message.channel.send(`(blist) Keyv conn err: ${err}`));
          message.channel.send(`Saving DB items (${JSON.stringify(await rblist.get(kblacklist)).split(",").length}) to blacklist file...`);
          var newbl = JSON.stringify(await rblist.get(kblacklist)).replace("[", "").replace("]", "").replace(/['|"]/g, "").split(",");
          newbl.map(Function.prototype.call, String.prototype.trim);
          var finalbl = JSON.stringify(newbl).replace(", ", "").replace(/['|"]/g, "").replace("[", "").replace("]", "");
          fs.writeFile('./blacklist', finalbl, err => console.log);

          //console.log(finalbl)
      } else if (!args){
          message.channel.send(`I need an argument; valid ones are show/list, add and remove.`);
      } else {
          message.channel.send(`Specified argument '${args}' was invalid, valid ones are show/list, add and remove.`);
      }
    //}
  } else {
          message.channel.send(`only owners can run this command`);
          return
          //perms owner
        }
      }
}
