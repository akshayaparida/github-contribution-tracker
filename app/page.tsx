"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import {
  GitHubResults,
  GitHubPullRequest,
  ContributionSummary,
} from "./types/github";

// Helper function to determine PR status
const getPRStatus = (pr: GitHubPullRequest) => {
  if (pr.merged_at) return "Merged";
  return pr.state.charAt(0).toUpperCase() + pr.state.slice(1);
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<GitHubResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(`/api/github?username=${username}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const contributionSummary: ContributionSummary | null = results
  ? {
      totalIssues: results.issues.length,
      openIssues: results.issues.filter((issue) => issue.state === "open").length,
      closedIssues: results.issues.filter((issue) => issue.state === "closed").length,
      totalPRs: results.prs.length,
      openPRs: results.prs.filter((pr) => pr.state === "open").length,
      closedPRs: results.prs.filter((pr) => pr.state === "closed").length, // Includes both merged & non-merged closed PRs
    }
  : null;





  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6 relative">
        {username && (
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-5 right-5"
          >
            <Github size={24} />
          </a>
        )}

        <h1 className="text-2xl font-bold text-center flex items-center gap-2 justify-center underline decoration-pink-400">
          <Github size={28} />
          GitHub Contribution Tracker
        </h1>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-3 flex-1 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-500 transition"
          >
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center mt-4">Fetching contributions...</p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {contributionSummary && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold underline decoration-pink-500">
              Contribution Summary
            </h2>
            <p className="text-sm">
              <strong>Issues:</strong> {contributionSummary.totalIssues} total (
              {contributionSummary.openIssues} open,{" "}
              {contributionSummary.closedIssues} closed)
            </p>
            <p className="text-sm">
  <strong>Pull Requests:</strong> {contributionSummary.totalPRs} total (
  {contributionSummary.openPRs} open, {contributionSummary.closedPRs} closed)
</p>
          </div>
        )}

        {results && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-xl font-semibold text-center">Issues</h2>
              <div className="mt-2 space-y-2">
                {results.issues.length === 0 ? (
                  <p className="text-center">No issues found.</p>
                ) : (
                  results.issues.map((issue) => (
                    <div key={issue.id} className="p-3 bg-gray-100 rounded-lg">
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium flex items-center gap-1 underline decoration-pink-500"
                      >
                        {issue.title}
                      </a>
                      <p className="text-sm">Status: {issue.state}</p>
                      <p className="text-xs">
                        Created:{" "}
                        {new Date(issue.created_at).toLocaleDateString()}
                      </p>
                      {issue.closed_at && (
                        <p className="text-xs">
                          Closed:{" "}
                          {new Date(issue.closed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-center">
                Pull Requests
              </h2>
              <div className="mt-2 space-y-2">
                {results.prs.length === 0 ? (
                  <p className="text-center">No pull requests found.</p>
                ) : (
                  results.prs.map((pr) => (
                    <div key={pr.id} className="p-3 bg-gray-100 rounded-lg">
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium flex items-center gap-1 underline decoration-pink-500"
                      >
                        {pr.title}
                      </a>
                      <p className="text-sm">Status: {getPRStatus(pr)}</p>
                      <p className="text-xs">
                        Created: {new Date(pr.created_at).toLocaleDateString()}
                      </p>
                      {pr.merged_at && (
                        <p className="text-xs">
                          Merged: {new Date(pr.merged_at).toLocaleDateString()}
                        </p>
                      )}
                      {!pr.merged_at && pr.state === "closed" && (
                        <p className="text-xs">
                          Closed: {new Date(pr.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        <footer className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-center text-sm">
            Check out GitHub profile of{" "}
            <a
              href="https://github.com/akshayaparida"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Akshaya Parida
            </a>{" "}
            for more projects and contributions.
          </p>
        </footer>
      </div>
    </div>
  );
}
