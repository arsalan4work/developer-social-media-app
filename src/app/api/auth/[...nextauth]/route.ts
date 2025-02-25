import NextAuth from "next-auth";
import { authOptions } from "../../../../../auth";  // Import the configuration from auth.ts

export default (req, res) => NextAuth(req, res, authOptions);  // Pass the options to NextAuth
