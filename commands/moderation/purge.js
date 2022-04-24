const { Client, CommandInteraction} = require('discord.js');
const ms = require('ms');
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {
	name: 'purge',
	description: 'purge messages',
	userPermissions: ['MANAGE_MESSAGES'],
	options: [
		{
			name: 'amount',
			description: 'how many messages you want to delete',
			type: 'INTEGER',
			required: true,
		},
	],

	run: async(client, interaction) => {
		const amount = interaction.options.getInteger('amount');

		if(amount > 100) 
			return interaction.followUp ({ 
				content: 
					'The maximum amount of messages you can delete is 100',
			});
		const messages = await interaction.channel.messages.fetch({ 
			limit: amount + 1,
		});

		const filtered = messages.filter(
			(msg) => Date.now() - msg.createdTimestamp < ms('14 days')
		);

		await interaction.channel.bulkDelete(filtered)
		
		interaction.channel.send({ 
			content: `Deleted ${filtered.size - 1} messages`,
		}).then((msg) => {
			setTimeout(() => msg.delete(), ms('10 seconds'))
		});
		
	},
};