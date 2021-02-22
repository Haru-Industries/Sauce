// Define Modules
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const { token, } = require('./config.json');
const { prefix, } = require('./config.json');
const Keyv = require('keyv');
var bl = fs.readFileSync("./blacklist", {"encoding": "utf-8"}).trim().split(",");
const kblacklist = 'filter'
const globalPrefix = prefix

const blist = new Keyv('sqlite://bl.sqlite');
const prefixes = new Keyv('sqlite://prefixes.sqlite');
blist.on('error', err => console.log(`(Blst) Keyv connection error: ${err}`));
prefixes.on('error', err => console.log(`(Prefixes) Keyv connection error: ${err}`));


// Login with token and define prefix
try {
  console.log(`[Sauce] | Initializing...`)
  bot.login(token);
} catch(error) {
  console.error(error)
}


async function loadbl (){
  await blist.set(kblacklist, bl);
  //return console.log(`set: ${await blist.get('filter')}`);
  console.log(`[${bot.user.username}] | Loaded ${JSON.stringify(await blist.get('filter')).split(",").length} item(s) to DB.`);
  return console.log(`[${bot.user.username}] | Sauce ready.`);
}

// Init Message
bot.on('ready', () => {
  console.log(`[${bot.user.username}] | Loading blacklist...`);
  console.log(`[${bot.user.username}] | Loaded ${bl.length} item(s) from blacklist`);
  console.log(`[${bot.user.username}] | Loading blacklist terms to DB...`)
  loadbl();
})

// Filesystem Reading for command execution
bot.commands = new Discord.Collection();
console.log(`[Sauce] | Initializing commands...`)

const cmdFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
for (const file of cmdFiles) {
    const command = require(`./cmds/${file}`);
    bot.commands.set(command.name, command);
}

console.log(`[Sauce] | Loaded ${cmdFiles.length} commands.`)


// Command Handling
//bot.on('message', async message => {

//    if(!message.content.startsWith(prefix) || message.author.bot) return;
//    const args = message.content.slice(prefix.length).trim().split(/ +/);
//    const cmdName = args.shift().toLowerCase();

    //if(!bot.commands.has(cmdName)) return;
//    const command = bot.commands.get(cmdName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

//    try {
//        command.execute(message, args);
//        console.log(`\n[${bot.user.username}] | Command: ${cmdName} \n[${bot.user.username}] | User   : ${message.author.tag}\n[${bot.user.username}] | Args   : ${args}`)
//    } catch(error) {
        //console.error(error);
        //message.reply('Something happened')
//    }
//})


bot.on('message', async message => {
	if (message.author.bot) return;

	let args;
	// handle messages in a guild
	if (message.guild) {
		let prefix2;

		if (message.content.startsWith(globalPrefix)) {
			prefix2 = globalPrefix;
		} else {
			// check the guild-level prefix
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix2 = guildPrefix;
		}

		// if we found a prefix, setup args; otherwise, this isn't a command
		if (!prefix2) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);


	} else {
		// handle DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}
  const cmdName = args.shift().toLowerCase();

  const command = bot.commands.get(cmdName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
  if (!command) {return;}
try {
      command.execute(message, args);
      console.log(`\n[${bot.user.username}] | Command: ${cmdName} \n[${bot.user.username}] | User   : ${message.author.tag}\n[${bot.user.username}] | Args   : ${args}`)
  } catch(error) {
      console.error(error);
      //message.reply('Something happened')
  }
	// get the first space-delimited argument after the prefix as the command
	//const command = args.shift().toLowerCase();
});
