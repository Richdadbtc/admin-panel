import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Use the admin login endpoint instead of regular auth
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/login`, {
            email: credentials.email,
            password: credentials.password
          })

          if (response.data.success) {
            return {
              id: response.data.user._id,
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role, // Use actual role from response
              token: response.data.token
            }
          }
          return null
        } catch (error) {
          console.error('Admin login error:', (error as any).response?.data || (error as Error).message)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.accessToken = token.accessToken
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}