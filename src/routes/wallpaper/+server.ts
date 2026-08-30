import { render } from 'svelte/server'
import { dev } from '$app/environment'
import { Resvg } from '@resvg/resvg-js'
import { createGithubClient } from '$lib/entities/github-stats/api/github-client'
import { GHFETCH_STATS_URL } from '$lib/entities/github-stats/api/config'
import { fetchAsDataUri } from '$lib/server/remote-image'
import { getWallpaperFontFiles } from '$lib/server/font-assets'
import WallpaperCard from '$lib/widgets/wallpaper/ui/WallpaperCard.svelte'
import { buildWallpaperStyles } from '$lib/widgets/wallpaper/lib/wallpaper-font-styles'
import { getWallpaperFormat } from '$lib/widgets/wallpaper/lib/wallpaper-formats'
import { resolveWallpaperTheme } from '$lib/widgets/wallpaper/lib/wallpaper-theme-param'
import { checkRateLimit } from '$lib/server/rate-limit'
import { getHotStats, setHotStats } from '$lib/server/hot-stats-cache'
import type { RequestHandler } from './$types'

const COLD_RENDER_TIMEOUT_SECONDS = 60
const STATS_REQUEST_TIMEOUT_MILLISECONDS = 8000
const HOUR_IN_SECONDS = 3600
const DAY_IN_SECONDS = 86_400

export const config = { maxDuration: COLD_RENDER_TIMEOUT_SECONDS }

export const GET: RequestHandler = async (event) => {
  const username = event.url.searchParams.get('username')?.trim()

  if (!username) return new Response('Missing username', { status: 400 })

  const format = getWallpaperFormat(event.url.searchParams.get('format'))

  if (!format) return new Response('Invalid format', { status: 400 })

  const [rateLimit, hotStats] = await Promise.all([
    checkRateLimit(event.getClientAddress()),
    getHotStats(username),
  ])

  if (!rateLimit.success) {
    const retryAfterSeconds = Math.max(0, Math.ceil((rateLimit.reset - Date.now()) / 1000))
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds), 'Cache-Control': 'no-store' },
    })
  }

  const theme = resolveWallpaperTheme(
    event.url.searchParams.get('theme'),
    event.url.searchParams.get('t'),
  )

  let statistics = hotStats

  if (!statistics) {
    const client = createGithubClient({
      apiUrl: GHFETCH_STATS_URL,
      requestTimeoutMilliseconds: STATS_REQUEST_TIMEOUT_MILLISECONDS,
    })

    const result = await client.fetchStats(username)

    if (!result.ok) {
      const status = result.error.kind === 'not-found' ? 404 : 502
      return new Response(result.error.message, {
        status,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    statistics = result.value
    statistics.languages = Array.isArray(statistics.languages) ? statistics.languages : []
    await setHotStats(username, statistics)
  }

  const [fontFiles, avatarDataUri] = await Promise.all([
    getWallpaperFontFiles(),
    fetchAsDataUri(statistics.avatarUrl),
  ])

  const { body } = render(WallpaperCard, {
    props: {
      statistics,
      username,
      theme,
      avatarDataUri,
      width: format.width,
      height: format.height,
    },
  })
  const fontStyles = buildWallpaperStyles(theme)
  const svg = body.replace('<defs>', `<defs><style>${fontStyles}</style>`)

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: format.width },
    font: {
      fontFiles: [
        fontFiles.mono,
        fontFiles.bookSerif,
        fontFiles.bookSerifBold,
        fontFiles.jp,
        fontFiles.serifJp,
        fontFiles.serifJpBold,
      ].filter(Boolean),
      loadSystemFonts: false,
      defaultFontFamily: 'JetBrains Mono',
    },
  })
  const pngBuffer = resvg.render().asPng()

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="gitpeak-${username}-${format.id}.png"`,
      'Cache-Control': dev
        ? 'no-store'
        : `public, max-age=${HOUR_IN_SECONDS}, stale-while-revalidate=${DAY_IN_SECONDS}`,
    },
  })
}
