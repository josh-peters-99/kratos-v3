import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                console.log("🔹 Received credentials:", credentials);
                try {
                    await connectDB();
                    console.log("✅ Connected to DB");
                    const user = await User.findOne({ email: credentials.email })
                    console.log("🔹 Found user:", user);

                    if (!user || !user.password) {
                        console.log("❌ Invalid username or password");
                        throw new Error("Invalid username or password");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    console.log("🔹 Password match result:", isValidPassword);
                    if (!isValidPassword) {
                        console.log("❌ Invalid username or password");
                        throw new Error("Invalid username or password");
                    }
                    console.log("✅ Authentication successful");
                    return { id: user._id, email: user.email, username: user.username };
                } catch (error) {
                    console.error("🔥 Error in authorize function:", error);
                    console.log("An error occurred: ", error);
                    throw new Error("Authentication failed")
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
    }
};

const handler  = NextAuth(authOptions);
export { handler as GET, handler as POST };