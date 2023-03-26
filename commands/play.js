const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música do YouTube.')
    .addStringOption(option => option.setName('song').setDescription('Digite o nome da música ou cole o link do YouTube.')),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('Você precisa estar em um canal de voz para executar este comando!');
    }

    try {
      const connection = await voiceChannel.join();

      const songQuery = interaction.options.getString('song');

      const songInfo = await ytdl.getInfo(songQuery);
      const stream = ytdl(songInfo.videoDetails.video_url, { filter: 'audioonly' });
      const dispatcher = connection.play(stream, { type: 'opus' });

      dispatcher.on('start', () => {
        console.log(`Reproduzindo: ${songInfo.title}`);
        return interaction.reply({ content: `Agora tocando: **${songInfo.title}**` });
      });

      dispatcher.on('finish', () => {
        console.log(`Terminou de tocar: ${songInfo.title}`);
        voiceChannel.leave(); // desconectar quando a música terminar
      });

      dispatcher.on('error', error => {
        console.error(`Erro ao tocar a música: ${error}`);
        return interaction.reply({ content: 'Houve um erro ao tocar a música!', ephemeral: true });
      });

    } catch (error) {
      console.error(`Erro ao entrar no canal de voz ou obter informações do vídeo: ${error}`);
      return interaction.reply({ content: 'Não foi possível encontrar ou reproduzir essa música.', ephemeral: true });
    }
  }
};