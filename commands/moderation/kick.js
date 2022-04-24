const { Client, CommandInteraction} = require('discord.js');
const warnModel = require('../../models/warnModel');
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {
	name: 'kick',
	description: 'remove a member from the server',
	userPermissions: ['KICK_MEMBERS'],
	options: [
		{
			name: 'target',
			description: 'member to remove',
			type: 'USER',
			required: true
		},
		{
			name: 'reason',
			description: 'reason for kick',
			type: 'STRING',
			required: true
		}
	],

	run: async (client, interaction, args) => {
		const user = interaction.options.getMember('target');
		const reason = interaction.options.getString('reason');

    new warnModel({
      userId: user.id,
      guildId: interaction.guildId,
      moderatorId: interaction.user.id,
      reason,
      timestamp: Date.now(),
			warnType: 'kick',
    }).save();		

		if (
			user.roles.highest.position >= 
			interaction.member.roles.highest.position
		) 
			return interaction.followUp({ 
				content: 
					`You can not take action on ${user.tag} as their role is higher than yours`,
			});

		await user.send(
			`You have been kicked from ${interaction.guild.name} for ${reason}`
		);

		user.kick(reason);
		
		client.channels.cache.get(process.env.channelId).send(`${user} has been kicked for ${reason}`)

		interaction.followUp({
			content: `Kicked ${user.tag} succesfully! reason: ${reason}`
		});
	},
};