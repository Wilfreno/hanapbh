import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { ServerResponse } from "./types/server-response";
import { Photo, User } from "./types/data-type";
import { GETRequest, POSTRequest } from "./server/fetch";

const google_client_id = process.env.GOOGLE_CLIENT_ID;
if (!google_client_id)
  throw new Error("GOOGLE_CLIENT_ID is missing on your .env.local file");
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
if (!google_client_secret)
  throw new Error("GOOGLE_CLIENT_SECRET is missing on your .env.local file");

const secret = process.env.NEXTAUTH_SECRET;
if (!secret)
  throw new Error("NEXTAUTH_SECRET is missing on your .env.local file");

// const facebook_client_id = process.env.FACEBOOK_CLIENT_ID;
// if (!facebook_client_id) throw new Error("FACEBOOK_CLIENT_ID");
// const facebook_client_secret = process.env.FACEBOOK_CLIENT_SECRET;
// if (!facebook_client_secret) throw new Error("FACEBOOK_CLIENT_SECRET");

const auth_options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        try {
          const { data, status, message } = await POSTRequest<User>(
            "/v1/user/authenticate",
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          if (status !== "OK") throw new Error(message);

          return data;
        } catch (error) {
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: google_client_id,
      clientSecret: google_client_secret,
    }),
    // FacebookProvider({
    //   clientId: facebook_client_id,
    //   clientSecret: facebook_client_secret,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/",
  },
  secret,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, profile }) {
      try {
        if (profile) {
          const { email } = user;
          const { status } = await GETRequest<User>("/v1/user/@" + email);

          if (status === "NOT_FOUND") {
            const { data } = await POSTRequest<User>("/v1/user", {
              email: email!,
              first_name: profile.given_name,
              last_name: profile.family_name,
            } satisfies Omit<User, "id">);

            await POSTRequest("/v1/user/photo", {
              id: data.id,
              photo: {
                url: profile.picture,
              } satisfies Photo,
            });
          }
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, profile, user, trigger, session }) {
      if (trigger == "update") return { ...token, ...session };

      delete token.sub;
      delete token.name;
      delete token.sub;
      delete token.picture;
      delete token.jti;

      try {
        if (profile) {
          const { data } = await GETRequest<User>("/v1/user/@" + profile.email);

          return { ...token, ...data };
        }
        return { ...token, ...user };
      } catch (error) {
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        session.user = token as any;
        return session;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default auth_options;
