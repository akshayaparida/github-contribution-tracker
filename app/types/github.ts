// types/github.ts

export interface GitHubIssue {
    id: number;
    title: string;
    state: 'open' | 'closed';
    html_url: string;
    created_at: string;
    closed_at: string | null;
  }
  
  export interface GitHubPullRequest {
    id: number;
    title: string;
    state: 'open' | 'closed';
    html_url: string;
    created_at: string;
    merged_at: string | null;
    updated_at: string;
  }
  
  export interface GitHubResults {
    issues: GitHubIssue[];
    prs: GitHubPullRequest[];
  }
  
  export type ContributionSummary = {
    totalIssues: number;
    openIssues: number;
    closedIssues: number;
    totalPRs: number;
    openPRs: number;
   closedPRs: number; // Includes both merged & non-merged closed PRs
   
  };
  