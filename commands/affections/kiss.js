const fetch = require("node-fetch");
const waifuAPI = "https://waifu.pics/api";
const Discord = require("discord.js");

module.exports = {
    config: {
        name: "kiss",
        description: "Kiss a user.",
        usage: "Kiss @user/id",
    },
    run: async (bot, message, args) => {
        let user =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find((m) =>
                [m.user.username, m.displayName, m.user.tag].some(
                    (e) => e.toLowerCase() === args.join(" ").toLowerCase()
                )
            );
        if (!user) {
            return message.channel.send("Please input a (valid) user to kiss them <:Megumin_Blush:843537370107215913>");
        }

        let ishorny = [
            "Aww that's cute.",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
            " ",
        ];
        let hornyresult = Math.floor(Math.random() * ishorny.length);
        const waifu = new Discord.MessageEmbed();

        const {url} = await fetch(`${waifuAPI}/sfw/kiss`).then((res) => res.json());
        let quotes = args.slice(1).join(" ");
        waifu
            .setImage(url)
            .setAuthor(`${message.author.username} has kissed ${user.user.tag}`, message.author.avatarURL({dynamic: true}))

            .setDescription(quotes)
            .setColor("RANDOM")
            .setFooter(ishorny[hornyresult]);

        return message.channel.send({embeds: [waifu]});
    },
};
