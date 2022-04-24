const { client, CommandInteraction } = require('discord.js');
const warnModel = require('../../models/warnModel');
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {
  name: 'warn',
  description: 'Warn a user',
	userPermissions: ['MANAGE_MESSAGES'],
  options: [
    {
      name: 'target',
      description: 'user you want to warn',
      type: 'USER',
      required: true
    },
    {
      name: 'reason',
      description: 'reason for the warn',
      type: 'STRING',
      required: true
    },
  ],

  run: async(client, interaction) => {
		if(interaction.member.roles.cache.find(r => r.name === "Staff")) {

 	   const user = interaction.options.getUser('target');
 	   const reason = interaction.options.getString('reason');

 	   new warnModel({
  	    userId: user.id,
    	  guildId: interaction.guildId,
      	moderatorId: interaction.user.id,
 	      reason,
  	    timestamp: Date.now(),
				warnType: 'warn',
  	  }).save();

	    user.send(`You have been warned in ${interaction.guild.name} for ${reason}`).catch(console.log);
			client.channels.cache.get(process.env.channelId).send(`${user} has been warned for ${reason}`)
	
	    interaction.followUp({ content: `${user} has been warned for ${reason}`})
		}else{
			return interaction.followUp({ 
				content: 
					`You do not have permission to do this`,
			});
		};
 	 },
	};