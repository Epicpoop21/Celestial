const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'serverinfo',
	description: 'gives info about the server',
	run: async = (client, message) => {
	let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Server Info")
		.setImage(message.guild.iconURL)
    .setDescription(`${message.guild}'s information`)
    .addField("Owner", `The owner of this server is <@${message.guild.ownerId}>`)
  	.addField("Member Count", `This server has ${message.guild.memberCount} members`)
    .addField("Emoji Count", `This server has ${message.guild.emojis.cache.size} emojis`)
    .addField("Roles Count", `This server has ${message.guild.roles.cache.size} roles`)
            
		message.channel.send({ embeds: [embed] });
	}
}

