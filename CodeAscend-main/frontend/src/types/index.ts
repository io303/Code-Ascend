export type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";

export type TestCase = {
  id: string;
  inputData: string;
  expectedOutput: string;
  displayOrder: number;
};

export type ProblemSummary = {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  acceptanceRate: number;
  timeLimitMs: number;
  memoryLimitMb: number;
  tags: string[];
  createdAt: string;
  userStatus?: "SOLVED" | "ATTEMPTED" | "UNATTEMPTED";
  isBookmarked?: boolean;
};

export type ProblemDetail = ProblemSummary & {
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examplesJson: string;
  sampleInput: string;
  sampleOutput: string;
  visibleTestCases: TestCase[];
};

export type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR";

export type SubmissionLanguage = "JAVA" | "PYTHON" | "CPP" | "JAVASCRIPT";

export type Submission = {
  id: string;
  evaluationId: string;
  problemId: string;
  problemSlug: string;
  problemTitle: string;
  userId: string;
  username: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtimeMs: number | null;
  memoryKb: number | null;
  failureMessage: string | null;
  submittedAt: string;
  completedAt: string | null;
};

export type SubmissionDetail = Submission & {
  sourceCode: string;
  queueKey: string;
  queuedAt: string;
  startedAt: string | null;
  aiHint: string | null;
  aiComplexityJson: string | null;
  aiPlagiarismScore: number | null;
  aiFeedback: string | null;
  passedTestCasesCount?: number;
  totalTestCasesCount?: number;
  ratingDelta?: number;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  rating: number;
  solvedCount: number;
  streak: number;
  tier: string;
};

export type UserRank = LeaderboardEntry;

export type RatingHistoryPoint = {
  id: string;
  previousRating: number;
  newRating: number;
  ratingDelta: number;
  reason: string;
  createdAt: string;
};

export type TopicSkill = {
  topic: string;
  score: number;
  solvedCount: number;
};

export type CodeDna = {
  topicSkills: TopicSkill[];
  strongestTopic: string;
  weakestTopic: string;
  mostImprovedTopic?: string;
  overallSkillRating: number;
  recommendedProblemSlug?: string;
  recommendedProblemTitle?: string;
};

export type AchievementBadge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type UserProfile = {
  userId: string;
  username: string;
  displayName: string;
  email: string;
  rating: number;
  rank: number;
  tier: string;
  problemsSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
  streak: number;
  difficultyBreakdown: Record<string, number>;
  topicPerformance: Record<string, number>;
  submissionHeatmap: Record<string, number>;
  achievements: AchievementBadge[];
  recentSubmissions: Submission[];
  ratingHistory: RatingHistoryPoint[];
  codeDna: CodeDna;
};

export type DashboardData = {
  problemsSolved: number;
  currentRating: number;
  totalSubmissions: number;
  acceptanceRate: number;
  streak: number;
  submissionHeatmap: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  recentSubmissions: Submission[];
  leaderboardPreview: LeaderboardEntry[];
  recommendedProblems: ProblemSummary[];
};

export type PlatformAnalytics = {
  totalUsers: number;
  totalSubmissions: number;
  totalProblems: number;
  acceptanceRate: number;
  averageUserRating: number;
  submissionsByDay: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  topLanguages: Record<string, number>;
};

export type UserAnalytics = {
  userId: string;
  username: string;
  displayName: string;
  rating: number;
  totalSubmissions: number;
  problemsSolved: number;
  acceptanceRate: number;
  streak: number;
  submissionsByDay: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  languageBreakdown: Record<string, number>;
};
