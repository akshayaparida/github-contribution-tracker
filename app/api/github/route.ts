import { NextResponse } from "next/server";

const GITHUB_API_URL = "https://api.github.com/search/issues";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Fetch issues and PRs authored by the user
    const [issuesRes, prsRes] = await Promise.all([
      fetch(`${GITHUB_API_URL}?q=author:${username}+type:issue`, { headers }),
      fetch(`${GITHUB_API_URL}?q=author:${username}+type:pr`, { headers }),
    ]);

    if (!issuesRes.ok || !prsRes.ok) {
      throw new Error("Failed to fetch data from GitHub");
    }

    const [issuesData, prsData] = await Promise.all([
      issuesRes.json(),
      prsRes.json(),
    ]);

    return NextResponse.json({
      issues: issuesData.items || [],
      prs: prsData.items || [],
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
