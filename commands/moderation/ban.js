const { Client, CommandInteraction } = require('discord.js');
const warnModel = require('../../models/warnModel');
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {
	name: 'ban',
	description: 'ban a member from the server',
	userPermissions: ['BAN_MEMBERS'],
	options: [
		{
			name: 'target',
			description: 'member to ban',
			type: 'USER',
			required: true
		},
		{
			name: 'reason',
			description: 'reason for ban',
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
			warnType: 'ban',
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
			`You have been banned from ${interaction.guild.name} for ${reason}. Appeal here: <https://docs.google.com/forms/d/e/1FAIpQLScjYXG3wWBBrVgq-eTq2DPDvxND9UdlLUmAZKLInEVn9msm0g/viewform?usp=sf_link> or contact Correct Speling#5118`
		);

		user.ban({ reason });
		client.channels.cache.get(process.env.channelId).send(`${user} has been banned for ${reason}`)

		interaction.followUp({
			content: `Banned ${user.tag} succesfully! reason: ${reason}`
		});
	},
};