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
  
  export interface ContributionSummary {
    totalIssues: number;
    openIssues: number;
    closedIssues: number;
    totalPRs: number;
    openPRs: number;
    mergedPRs: number;
  }