// --- Overview ---
export interface AnalyticsOverview {
  totalUsers: number
  activeUsers7d: number
  activeUsers30d: number
  totalAttempts: number
  overallAccuracy: number
  avgResponseTimeMs: number | null
  questionsInSrs: number
  masteryRate: number
}

// --- Topic Accuracy ---
export interface TopicAccuracy {
  sectionId: number
  sectionName: string
  totalAttempts: number
  correctCount: number
  accuracyRate: number
  avgResponseTimeMs: number | null
}

export interface TopicAccuracyTrend {
  periodStart: string
  sectionId: number
  sectionName: string
  totalAttempts: number
  accuracyRate: number
}

export interface TopicAccuracyData {
  current: TopicAccuracy[]
  trend: TopicAccuracyTrend[]
}

// --- Engagement ---
export interface ActiveUsersTrend {
  periodStart: string
  activeUsers: number
  totalStudyTime: number
  avgStudyTime: number
}

export interface StudyTimeDistribution {
  range: string
  count: number
}

export interface SessionDurationTrend {
  periodStart: string
  avgStudyTime: number
  maxStudyTime: number
  minStudyTime: number
}

export interface EngagementData {
  activeUsers: ActiveUsersTrend[]
  studyTimeDistribution: StudyTimeDistribution[]
  sessionDurationTrend: SessionDurationTrend[]
}

// --- Response Times ---
export interface ResponseTimeBucket {
  binStart: number
  binEnd: number
  count: number
}

export interface SectionResponseTime {
  sectionId: number
  sectionName: string
  avgMs: number
  minMs: number
  maxMs: number
  attemptCount: number
}

export interface CorrectnessCorrelation {
  speedBucket: string
  totalAttempts: number
  accuracyRate: number
}

export interface ResponseTimeData {
  histogram: ResponseTimeBucket[]
  bySection: SectionResponseTime[]
  correctnessCorrelation: CorrectnessCorrelation[]
}

// --- Retention Curves ---
export interface BoxDistribution {
  boxLevel: number
  count: number
  percentage: number
}

export interface BoxRetention {
  boxLevel: number
  totalStates: number
  avgAttempts: number
  retentionRate: number
  expectedIntervalDays: number
}

export interface MasteryDistribution {
  range: string
  count: number
}

export interface TimeToMastery {
  avgDays: number | null
  medianDays: number | null
  minDays?: number
  maxDays?: number
  stdDev?: number
  distribution: MasteryDistribution[]
}

export interface RetentionDecay {
  boxLevel: number
  fixedIntervalDays: number
  userCount: number
  meanRetention: number
  stdDev: number
  minRetention: number
  maxRetention: number
}

export interface FixedIntervalCritique {
  fixedIntervals: number[]
  varianceByLevel: { boxLevel: number; stdDev: number }[]
  highVarianceCount: number
  conclusion: string
}

export interface RetentionCurveData {
  boxDistribution: BoxDistribution[]
  retentionByBox: BoxRetention[]
  timeToMastery: TimeToMastery
  retentionDecay: RetentionDecay[]
  fixedIntervalCritique: FixedIntervalCritique
}

// --- Learner Segments ---
export type SegmentKey = 'fast_accurate' | 'slow_accurate' | 'fast_inaccurate' | 'struggling'

export interface LearnerUser {
  totalAttempts: number
  accuracy: number
  avgResponseMs: number
  segment: SegmentKey
  segmentLabel: string
}

export interface SegmentSummary {
  segment: SegmentKey
  label: string
  description: string
  userCount: number
  avgAccuracy: number
  avgResponseMs: number
}

export interface SegmentBoxRetention {
  boxLevel: number
  retention: number | null
  count: number
}

export interface SrsImpact {
  segment: SegmentKey
  label: string
  userCount: number
  boxDistribution: Record<string, number>
  retentionByBox: SegmentBoxRetention[]
}

export interface LearnerSegmentData {
  segments: LearnerUser[]
  segmentSummary: SegmentSummary[]
  srsImpactBySegment: SrsImpact[]
}
