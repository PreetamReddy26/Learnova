export const XP_REWARDS = {
  quizCompleted: 15,
  planItemCompleted: 10,
} as const

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// A day still counts toward the streak until it ends — so if today has no
// activity yet, we start counting from yesterday instead of breaking early.
export function computeStreak(activityTimestamps: string[]): number {
  const days = new Set(activityTimestamps.map((ts) => toDateKey(new Date(ts))))
  const cursor = new Date()

  if (!days.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (days.has(toDateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export interface AchievementStats {
  quizCount: number
  bestScorePercent: number
  streak: number
  xpEventCount: number
}

export interface Achievement {
  code: string
  title: string
  description: string
  earned: boolean
}

export function computeAchievements(stats: AchievementStats): Achievement[] {
  return [
    {
      code: "first_quiz",
      title: "First Steps",
      description: "Complete your first practice quiz",
      earned: stats.quizCount >= 1,
    },
    {
      code: "perfect_score",
      title: "Perfect Score",
      description: "Score 100% on a practice quiz",
      earned: stats.bestScorePercent >= 100,
    },
    {
      code: "on_a_roll",
      title: "On a Roll",
      description: "Keep a 3-day study streak",
      earned: stats.streak >= 3,
    },
    {
      code: "consistent_learner",
      title: "Consistent Learner",
      description: "Log 5 study activities",
      earned: stats.xpEventCount >= 5,
    },
  ]
}
