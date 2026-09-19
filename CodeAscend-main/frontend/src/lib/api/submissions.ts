import { apiClient } from "./client";
import type { PagedResponse, Submission, SubmissionDetail, SubmissionLanguage, SubmissionStatus } from "@/types";

export type CreateSubmissionInput = {
  problemId?: string;
  problemSlug?: string;
  language: SubmissionLanguage;
  sourceCode: string;
};

export type RunCodeInput = {
  language: SubmissionLanguage;
  sourceCode: string;
  customInput?: string;
  problemSlug?: string;
};

export type RunCodeResult = {
  status: SubmissionStatus;
  stdout: string;
  expectedOutput?: string | null;
  failureMessage: string | null;
  runtimeMs: number | null;
  memoryKb: number | null;
};

export async function createSubmission(input: CreateSubmissionInput): Promise<SubmissionDetail> {
  const response = await apiClient.post<SubmissionDetail>("/submissions", input);
  return response.data;
}

export async function runCode(input: RunCodeInput): Promise<RunCodeResult> {
  const response = await apiClient.post<RunCodeResult>("/submissions/run", input);
  return response.data;
}

export async function fetchMySubmissions(page = 0, size = 20): Promise<PagedResponse<Submission>> {
  const response = await apiClient.get<PagedResponse<Submission>>("/submissions/my", {
    params: { page, size },
  });
  return response.data;
}

export async function fetchSubmissionById(id: string): Promise<SubmissionDetail> {
  const response = await apiClient.get<SubmissionDetail>(`/submissions/${id}`);
  return response.data;
}

export async function fetchSubmissionsByProblem(slug: string): Promise<Submission[]> {
  const response = await apiClient.get<Submission[]>(`/submissions/problem/${slug}`);
  return response.data;
}

export async function requestHint(submissionId: string): Promise<{ hint: string }> {
  const response = await apiClient.post<{ hint: string }>(`/submissions/${submissionId}/hint`);
  return response.data;
}
