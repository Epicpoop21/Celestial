const warnModel = require('../../models/warnModel');
const { Client, CommandInteraction } = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose')

module.exports = {
  name: 'edit-warn',
  description: 'Edit a warn using an ID',
	userPermissions: ['MODERATE_MEMBERS'],
  options: [
    {
      name: 'warnid',
      description: 'warnId you want to edit',
      type: 'STRING',
      required: true
    },
		{
      name: 'reason',
      description: 'new reason for warn',
      type: 'STRING',
      required: true
    },
  ],
  
  run: async(client, interaction) => {
		if(interaction.member.roles.cache.find(r => r.name === "Staff")) {

	    const warnId = interaction.options.getString('warnid');
  	  const reason = interaction.options.getString('reason');

			const data = await warnModel.findById(warnId);
			const user = interaction.guild.members.cache.get(data.userId)

	    if(!data) return interaction.followUp({ content: `${warnId} is not a valid id!`,})

			warnModel.findOneAndUpdate({ _id: warnId }, {reason: reason}, (error, data) => {
				if(error){
					console.log(error)
				};
			})
			client.channels.cache.get(process.env.channelId).send(`${user}'s warning has been changed to ${reason}`)
		
			return interaction.followUp({ content: `Updated the reason of ${user}'s warn (${warnId}) to: ${reason}`})
		}else{
			return interaction.followUp({ 
				content: 
					`You do not have permission to do this`,
			});
		};
  }
};