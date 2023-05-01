import { createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { player } from '../../../index.js';

export const conga = async (msg) => {
  const voiceChannel = msg.member.voice.channel;
  if (!voiceChannel) return msg.reply('You need to be in a voice channel to play music!');

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  const track = await player.search('mc pipokinha', msg.member.user);

  if (!track || !track.tracks.length) {
    return msg.reply(`No results found for ${'mc pipokinha'}!`);
  }

  const stream = createAudioResource(track.tracks[0].url);
  const audioPlayer = createAudioPlayer();

  connection.subscribe(audioPlayer);
  audioPlayer.play(stream);

  audioPlayer.on('error', () => {
    msg.channel.send('The music has ended!');
    connection.destroy();
  });

  return msg.reply(`Now playing: ${track.tracks[0].title}`);
};
