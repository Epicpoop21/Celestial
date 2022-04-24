const { Client, CommandInteraction } = require('discord.js');
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {
	name: 'unban',
	description: 'unban a user',
	userPermissions: ['BAN_MEMBERS'],
	options: [
			{
				name: 'userid',
				description: 'userId of the person to unban',
				type: 'STRING',
				required: true
			},
	],
	
	run: async(client, interaction) => {
		const userId = interaction.options.getString('userid');

		interaction.guild.members.unban(userId).then((user) => {
			interaction.followUp({ content: `${user.tag} is unbanned from this server`,
			})
			client.channels.cache.get(process.env.channelId).send(`${user} has been unbanned`,
			);
		}).catch(() => {
			interaction.followUp({ content: 'Please specify a valid member\'s ID',
			});

		});
	},
};