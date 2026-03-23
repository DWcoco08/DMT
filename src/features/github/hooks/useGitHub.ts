import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { githubService } from '../services/githubService'

interface GitHubStore {
  token: string | null
  username: string | null
  setCredentials: (token: string, username: string) => void
  disconnect: () => void
}

export const useGitHubStore = create<GitHubStore>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      setCredentials: (token, username) => set({ token, username }),
      disconnect: () => set({ token: null, username: null }),
    }),
    { name: 'dmt-github' }
  )
)

export function useGitHubCommits(days = 30) {
  const { token, username } = useGitHubStore()

  return useQuery({
    queryKey: ['github', 'commits', username, days],
    queryFn: () => githubService.fetchCommits(token!, username!, days),
    enabled: !!token && !!username,
    staleTime: 1000 * 60 * 5,
  })
}

export function useGitHubCommitsPerDay(days = 7) {
  const { data: commits } = useGitHubCommits(30)

  return {
    data: commits ? githubService.getCommitsPerDay(commits, days) : undefined,
    isLoading: !commits,
  }
}

export function useConnectGitHub() {
  const queryClient = useQueryClient()
  const setCredentials = useGitHubStore((s) => s.setCredentials)

  return useMutation({
    mutationFn: async (token: string) => {
      const username = await githubService.validateToken(token)
      return { token, username }
    },
    onSuccess: ({ token, username }) => {
      setCredentials(token, username)
      queryClient.invalidateQueries({ queryKey: ['github'] })
    },
  })
}

export function useDisconnectGitHub() {
  const queryClient = useQueryClient()
  const disconnect = useGitHubStore((s) => s.disconnect)

  return () => {
    disconnect()
    queryClient.removeQueries({ queryKey: ['github'] })
  }
}
