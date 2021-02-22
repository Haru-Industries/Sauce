//Doesn't Work
module.exports = {
    name: 'pause',
    description: 'pauses playback',
    async execute(message, args) {
        if(!message.member.voice.channel) {
            message.channel.send('I am not in the Voice chat')
        }else {
            const connection = await message.member.voice.channel.join();
            connection.pause();
        }
    }
}