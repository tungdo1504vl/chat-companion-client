import { envServer } from "@/env/server";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  baseURL: envServer.BETTER_AUTH_URL,
  secret: envServer.BETTER_AUTH_SECRET || "",
  database: new Pool({
    connectionString: envServer.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Uncomment and configure social providers as needed
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
