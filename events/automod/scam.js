
module.exports = async (bot, message) => {
const {Permissions, MessageEmbed} = require("discord.js");
const expression = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]?/gi; const regex = new RegExp(expression); const t = message.content;


    if (t.match(regex)) {

        const unix = Math.floor(new Date().getTime() / 1000);

        let data = await require('node-fetch')("https://anti-fish.bitflow.dev/check", {
            method: "post",
            body: JSON.stringify({message: message.content}),
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "ToD Anti-phishing (Nek#2937 / 750510159289254008)",
            },

        }).then(res => res.json())
        if (data.match) {

            try {

                let dataInfo = await require('node-fetch')(`https://api.phisherman.gg/v1/domains/info/${data.matches.map(m => m.domain)}`, {
                    headers: {
                        "Authorization": 'Bearer 02e6fac0-b924-48aa-b583-2d410fbc691a',
                        'Content-Type': 'application/json',
                        "User-Agent": "Anti-phishing (Nek#2937 / 750510159289254008)",
                    },
                }).then(res => res.json())

                if (message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;
                setTimeout(async () => {
                    if (message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                        await message.delete()
                    }
                }, 1000);

                if (bot.db.fetch(`mutedRole_${message.guild.id}`)) {
                    if (message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                        const muter = bot.db.fetch(`mutedRole_${message.guild.id}`);
                        await message.member.roles.add(muter);
                    }
                }

                let linkstat = dataInfo[`${data.matches.map(m => m.domain)}`].status

                if (linkstat === "ONLINE") {
                    linkstat = "Active"
                } else {
                    linkstat = "Inactive"
                }

                const embed = new MessageEmbed()
                    .setAuthor(`❌ ${data.matches.map(m => m.type)} link detected!`)
                    .setColor('RED')
                    .setThumbnail(message.author.avatarURL({dynamic: true}))
                    .setDescription(`<@${message.author.id}> | ${message.author.tag} (${message.author.id})\n\n\n**${linkstat}** ${data.matches.map(m => m.type.toLowerCase())} link found <t:${unix}:R>:\n ||${data.matches.map(m => m.domain)}||`)
                    .setFooter('To configure this, use the t;disable or t;enable commands.');
                console.log(`Anti-Scam:`.green + ` [ Scam link prevented in ` + `${message.guild.name} (${message.guild.id})`.red + ` | ${message.guild.memberCount} ]`)

                return message.channel.send({
                    content: message.author.id,
                    embeds: [embed],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "Delete",
                                    style: 4,
                                    custom_id: "del",
                                },
                                {
                                    type: 2,
                                    label: "Get Domain Info",
                                    style: 2,
                                    custom_id: "info",
                                },
                            ],
                        },
                    ],
                }).then((msg) => {
                    bot.on("interactionCreate", async (interaction) => {

                        if (interaction.customId === "del") {
                            if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                                interaction.reply({content: `You can't delete this message`, ephemeral: true})
                            } else {
                                setTimeout(() => msg.delete(), 0);
                            }

                        }
                        if (interaction.customId === "info") {
                            let thing = new MessageEmbed()
                                .addField('Useless Domain info:', `__Domain IP__: **${dataInfo[`${data.matches.map(m => m.domain)}`].details.ip_address ? dataInfo[`${data.matches.map(m => m.domain)}`].details.ip_address : 'IP address not found.'}**\n__Asn Name__: ${dataInfo[`${data.matches.map(m => m.domain)}`].details.asn.asn_name ? dataInfo[`${data.matches.map(m => m.domain)}`].details.asn.asn_name : 'No asn name found.'}`)
                                .setImage(dataInfo[`${data.matches.map(m => m.domain)}`].details.websiteScreenshot)
                                .setColor('RANDOM')
                            return interaction.reply({embeds: [thing], ephemeral: true})
                        }

                    })
                })


            } catch (e) {
                console.log(e)
            }
        }
    }
}