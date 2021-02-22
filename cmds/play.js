const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Plays a youtube link',
    async execute(message, args) {
        if(!message.member.voice.channel) {
            message.channel.send('I am not in the Voice chat, please _summon me')
        }else if(!args.length) {
            message.channel.send('There is no youtube link to play')
        }else {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(ytdl(args[0]));
            dispatcher.setVolume(0.5);
            dispatcher.resume();
        }
    }
}