import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../helper/auth";
import { connectToDatabase } from "../../../helper/db";

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("User not found");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Invalid password");
        }

        client.close();

        return { email: user.email };
      },
    }),
  ],
});
