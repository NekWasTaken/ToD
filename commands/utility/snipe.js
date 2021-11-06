const Discord = require("discord.js");

module.exports = {
    config: {
        name: "snipe",
        usage: "t;snipe",
        description: "Snipe a deleted message.",
    },
    run: async (bot, message, args) => {
        let channelsnipe =
            message.mentions.channels.first() ||
            bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) ||
            message.guild.channels.cache.find(
                (c) => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()
            ) ||
            message.channel.id;
        let snip = bot.snipe.get(channelsnipe);

        if (!snip) return message.channel.send("🔴 No deleted messages found.");

        let embed = new Discord.MessageEmbed()
            .setColor("#eaecf3")
            .setAuthor("Sniped", snip.profilephoto)
            .addField(
                `**${snip.user} deleted:**`,
                `${snip.msg} \nin **<#${message.channel.id}>**`
            )
            .setTimestamp(snip.date);
        if (snip.image) embed.setImage(snip.image);

        return message.channel.send({embeds: [embed]});
    },
};
