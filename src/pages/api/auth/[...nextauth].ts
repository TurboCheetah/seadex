import {sequelize} from "../../../db";
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import SequelizeAdapter, {models} from "@next-auth/sequelize-adapter"
import {DataTypes} from "sequelize";

export default NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        })
    ],
    callbacks: {
        session({session, user}) {
            return {
                ...session,
                user
            } // The return type will match the one returned in `useSession()`
        },
    },
    adapter: SequelizeAdapter(sequelize, {
        models: {
            User: sequelize.define("user", {
                ...models.User,
                isEditor: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
            }),
        },
        synchronize: false
    })
})
