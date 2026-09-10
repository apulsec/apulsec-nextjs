type ContributionDay = {
  date: string
  contributionCount: number
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE"
}

type GitHubGraphQLResponse = {
  data?: {
    user?: {
      login: string
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: Array<{ contributionDays: ContributionDay[] }>
        }
      }
    } | null
  }
  errors?: Array<{ message: string }>
}

const query = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`

export const runtime = "nodejs"

export async function GET() {
  const username = process.env.GITHUB_USERNAME?.trim()
  const token = process.env.GITHUB_TOKEN?.trim()

  if (!username || !token) {
    return Response.json(
      {
        error:
          "GitHub heatmap is not configured. Set GITHUB_USERNAME and GITHUB_TOKEN.",
      },
      { status: 503 }
    )
  }

  const to = new Date()
  const from = new Date(to)
  from.setUTCMonth(from.getUTCMonth() - 6)

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "mynext-sui-github-heatmap",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        query,
        variables: {
          from: from.toISOString(),
          login: username,
          to: to.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return Response.json(
        { error: "GitHub API request failed." },
        { status: 502 }
      )
    }

    const payload = (await response.json()) as GitHubGraphQLResponse

    if (payload.errors?.length) {
      return Response.json(
        { error: payload.errors[0].message },
        { status: 502 }
      )
    }

    const user = payload.data?.user
    if (!user) {
      return Response.json(
        { error: `GitHub user "${username}" was not found.` },
        { status: 404 }
      )
    }

    const calendar = user.contributionsCollection.contributionCalendar

    return Response.json(
      {
        profileUrl: `https://github.com/${user.login}`,
        totalContributions: calendar.totalContributions,
        username: user.login,
        weeks: calendar.weeks,
      },
      { headers: { "Cache-Control": "private, max-age=3600" } }
    )
  } catch {
    return Response.json(
      { error: "Unable to reach GitHub right now." },
      { status: 502 }
    )
  }
}
