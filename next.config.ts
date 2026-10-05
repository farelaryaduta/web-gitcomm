import type { NextConfig } from "next";

// The www -> non-www redirect lives in the Vercel dashboard (Project Settings ->
// Domains), not here. Vercel's domain redirect is answered at the edge, before
// this app gets the request, so a second rule in next.config only competes with
// it: apex -> www at the edge, www -> apex here, and the two bounce forever.
const nextConfig: NextConfig = {};

export default nextConfig;