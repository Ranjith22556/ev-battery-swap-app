import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

console.log("NextAuth configuration loading...");
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "Defined" : "Undefined");
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? "Defined" : "Undefined");
console.log("NextAuth Secret:", process.env.NEXTAUTH_SECRET ? "Defined" : "Undefined");
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Defined" : "Undefined");

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign-in callback triggered", { user: { name: user.name, email: user.email }, provider: account?.provider });
      
      if (account?.provider === "google") {
        const { name, email, image } = user;
        
        try {
          await connectToDatabase();
          
          // Check if user exists
          const userExists = await User.findOne({ email });
          
          // If not, create a new user
          if (!userExists) {
            console.log("Creating new user:", email);
            await User.create({
              name,
              email,
              image,
              googleId: account.providerAccountId,
            });
          } else {
            console.log("Updating existing user:", email);
            // Update the user's information
            await User.findOneAndUpdate(
              { email },
              {
                name,
                image,
                googleId: account.providerAccountId,
                updatedAt: new Date(),
              }
            );
          }
          
          return true;
        } catch (error) {
          console.error("Error saving user to MongoDB:", error);
          return true; // Still allow sign in even if DB operation fails
        }
      }
      
      return true;
    },
    async session({ session }) {
      console.log("Session callback triggered", { user: session?.user?.email });
      // Add custom session logic here if needed
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
});

export { handler as GET, handler as POST }; 