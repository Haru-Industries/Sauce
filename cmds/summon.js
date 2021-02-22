module.exports = {
    name: 'summon',
    description: 'Summons bot into Voice channel',
    async execute(message, args) {
        if(message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        } else {
            message.channel.send('You need to be in a voice channel first')
        }
    }
}