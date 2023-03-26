const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Ouça a melhor playlist de Lofi Music"),

    async execute(interaction) {
        await interaction.reply("https://open.spotify.com/artist/1dABGukgZ8XKKOdd2rVSHM?si=S12j6F9DQgux3WAXFy-iHQ")
    }
}