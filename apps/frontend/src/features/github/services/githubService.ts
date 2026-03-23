import { format, subDays } from 'date-fns'

export interface GitHubCommit {
  sha: string
  message: string
  date: string
  repo: string
}

export interface CommitsPerDay {
  date: string
  count: number
}

export const githubService = {
  async fetchCommits(token: string, username: string, days = 30): Promise<GitHubCommit[]> {
    const since = subDays(new Date(), days).toISOString()
    const commits: GitHubCommit[] = []
    let page = 1

    while (page <= 3) {
      const res = await fetch(
        `https://api.github.com/users/${username}/events?per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )

      if (!res.ok) {
        if (res.status === 401) throw new Error('Invalid GitHub token')
        if (res.status === 404) throw new Error('GitHub user not found')
        throw new Error(`GitHub API error: ${res.status}`)
      }

      const events = await res.json()
      if (!events.length) break

      for (const event of events) {
        if (event.type !== 'PushEvent') continue
        if (event.created_at < since) continue

        const eventCommits = event.payload.commits
        if (eventCommits && eventCommits.length > 0) {
          for (const commit of eventCommits) {
            commits.push({
              sha: commit.sha.slice(0, 7),
              message: commit.message.split('\n')[0],
              date: event.created_at,
              repo: event.repo.name,
            })
          }
        } else {
          // Fallback: no commits detail, count the push as 1 commit
          commits.push({
            sha: event.payload.head?.slice(0, 7) ?? event.id.slice(0, 7),
            message: `Push to ${event.payload.ref?.replace('refs/heads/', '') ?? 'main'}`,
            date: event.created_at,
            repo: event.repo.name,
          })
        }
      }

      page++
    }

    return commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  getCommitsPerDay(commits: GitHubCommit[], days = 7): CommitsPerDay[] {
    const grouped = new Map<string, number>()

    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      grouped.set(date, 0)
    }

    for (const commit of commits) {
      const date = format(new Date(commit.date), 'yyyy-MM-dd')
      if (grouped.has(date)) {
        grouped.set(date, (grouped.get(date) ?? 0) + 1)
      }
    }

    return Array.from(grouped.entries()).map(([date, count]) => ({
      date: format(new Date(date), 'EEE'),
      count,
    }))
  },

  async validateToken(token: string): Promise<string> {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!res.ok) throw new Error('Invalid token')

    const user = await res.json()
    return user.login as string
  },
}
