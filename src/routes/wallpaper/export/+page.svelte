<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/state'
  import { ArrowLeft, Download, LoaderCircle } from 'lucide-svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { createGithubClient } from '$lib/entities/github-stats/api/github-client'
  import { GHFETCH_STATS_URL } from '$lib/entities/github-stats/api/config'
  import { warmServerStats } from '$lib/entities/github-stats/api/warm-server-stats'
  import {
    WALLPAPER_FORMATS,
    type WallpaperFormat,
  } from '$lib/widgets/wallpaper/lib/wallpaper-formats'
  import { buildWallpaperUrl } from '$lib/widgets/wallpaper/lib/wallpaper-url'
  import { downloadWallpaper } from '$lib/widgets/wallpaper/lib/download-wallpaper'
  import { packThemeTokens } from '$lib/widgets/wallpaper/lib/wallpaper-theme-param'
  import WallpaperPreview from '$lib/widgets/wallpaper/ui/WallpaperPreview.svelte'
  import { getTokens } from '$lib/entities/theme/model/theme-manager'
  import {
    getActivePresetName,
    getActiveThemeTokens,
    setActiveThemeTokens,
  } from '$lib/entities/theme/model/theme-state.svelte'
  import ThemeControls from '$lib/features/customize-theme/ui/ThemeControls.svelte'
  import { toast } from 'svelte-sonner'

  const STATS_REQUEST_TIMEOUT_MILLISECONDS = 8000
  const STATS_STALE_TIME_MILLISECONDS = 60 * 1000
  const DOWNLOAD_PREWARM_DEBOUNCE_MILLISECONDS = 600

  const login = $derived(page.url.searchParams.get('username')?.trim() ?? '')

  const statsClient = createGithubClient({
    apiUrl: GHFETCH_STATS_URL,
    requestTimeoutMilliseconds: STATS_REQUEST_TIMEOUT_MILLISECONDS,
  })

  const statsQuery = createQuery(() => ({
    queryKey: ['github-stats', login.toLowerCase()],
    queryFn: async () => {
      const result = await statsClient.fetchStats(login)
      if (!result.ok) throw new Error(result.error.message)

      warmServerStats(login, result.value)
      return result.value
    },
    enabled: login.length > 0,
    staleTime: STATS_STALE_TIME_MILLISECONDS,
  }))

  let selectedFormat = $state<WallpaperFormat>(WALLPAPER_FORMATS[0])
  let isGenerating = $state(false)

  const theme = $derived(getActiveThemeTokens())
  const presetName = $derived(getActivePresetName())
  const packedCustomTokens = $derived(presetName ? undefined : packThemeTokens(theme))

  const wallpaperUrl = $derived(
    buildWallpaperUrl(login, selectedFormat, presetName, packedCustomTokens),
  )
  const downloadFilename = $derived(`gitpeak-${login}-${selectedFormat.id}.png`)

  onMount(() => {
    setActiveThemeTokens(getTokens())
  })

  $effect(() => {
    const urlToPrewarm = wallpaperUrl
    if (!statsQuery.data || !login) return

    const timer = setTimeout(() => {
      fetch(urlToPrewarm).catch(() => {})
    }, DOWNLOAD_PREWARM_DEBOUNCE_MILLISECONDS)

    return () => clearTimeout(timer)
  })

  async function generateWallpaper(): Promise<void> {
    if (isGenerating) return
    isGenerating = true

    try {
      await downloadWallpaper(wallpaperUrl, downloadFilename)
      toast.success('Wallpaper saved!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed — give it a moment and try again.')
    } finally {
      isGenerating = false
    }
  }
</script>

<svelte:head>
  <title>Wallpaper export{login ? ` for ${login}` : ''} | GitPeak</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#if !login}
  <div class="empty-state">
    <p>No username given.</p>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href="/">Back to GitPeak</a>
  </div>
{:else}
  <div class="page">
    <header class="page-header">
      <!-- eslint-disable svelte/no-navigation-without-resolve -->
      <a href="/?username={login}" class="back-link" aria-label="Back to {login}'s profile">
        <ArrowLeft size={15} />
      </a>
      <!-- eslint-enable svelte/no-navigation-without-resolve -->
      <span class="eyebrow">Wallpaper Export</span>
    </header>

    <div class="page-body">
      <div class="preview-column">
        <div class="preview-area">
          <div
            class="preview-frame"
            style="aspect-ratio: {selectedFormat.width} / {selectedFormat.height};"
          >
            {#if statsQuery.data}
              <WallpaperPreview
                statistics={statsQuery.data}
                username={login}
                {theme}
                avatarUrl={statsQuery.data.avatarUrl}
                width={selectedFormat.width}
                height={selectedFormat.height}
              />
            {:else if statsQuery.isError}
              <div class="preview-status">
                Couldn’t load {login}’s stats.
              </div>
            {:else}
              <div class="preview-status">
                <LoaderCircle size={20} class="animate-spin" />
                Loading {login}’s stats…
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="controls-column">
        <p class="section-label">Format</p>
        <div class="format-grid">
          {#each WALLPAPER_FORMATS as format (format.id)}
            <button
              class="format-button"
              class:format-button--active={selectedFormat.id === format.id}
              onclick={() => (selectedFormat = format)}
            >
              <span>{format.name}</span>
              <span class="format-subtitle">{format.subtitle}</span>
            </button>
          {/each}
        </div>

        <p class="section-label mt-5">Theme</p>
        <ThemeControls />
      </div>
    </div>

    <footer class="page-footer">
      <span class="dim-label">{selectedFormat.width} × {selectedFormat.height}</span>
      <button
        disabled={isGenerating || !statsQuery.data}
        onclick={generateWallpaper}
        class="download-button"
        class:download-button--busy={isGenerating}
      >
        {#if !isGenerating}
          <Download size={12} />
        {/if}
        {isGenerating ? 'Generating…' : 'Download PNG'}
      </button>
    </footer>
  </div>
{/if}

<style>
  .empty-state {
    display: flex;
    min-height: 100dvh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-family: 'DM Mono', monospace;
    color: var(--subtle);
  }

  .empty-state a {
    color: var(--iris);
  }

  .page {
    display: flex;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
    flex-direction: column;
    background: var(--base);
  }

  .page-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 12px;
    padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px;
    background: color-mix(in srgb, var(--base) 92%, transparent);
    border-bottom: 1px solid var(--border-glass-faint);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .back-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    color: var(--subtle);
    background: color-mix(in srgb, var(--highlight-med) 40%, transparent);
    transition: color 0.15s ease;
    touch-action: manipulation;
  }

  .back-link:hover {
    color: var(--iris);
  }

  .eyebrow {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--subtle);
  }

  .page-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  @media (min-width: 768px) {
    .page-body {
      flex-direction: row;
      overflow: hidden;
    }
  }

  .preview-column {
    display: flex;
    flex-shrink: 0;
    min-height: 35vh;
    min-width: 0;
  }

  @media (min-width: 768px) {
    .preview-column {
      flex: 1;
      min-height: 0;
    }
  }

  .preview-area {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 24px;
    min-height: 0;
    min-width: 0;
    background: repeating-linear-gradient(
      45deg,
      color-mix(in srgb, var(--highlight-low) 30%, transparent) 0px,
      color-mix(in srgb, var(--highlight-low) 30%, transparent) 1px,
      transparent 1px,
      transparent 12px
    );
  }

  @media (min-width: 768px) {
    .preview-area {
      padding: 40px;
    }
  }

  .preview-frame {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 8px;
    box-shadow:
      0 24px 64px -12px rgba(0, 0, 0, 0.65),
      0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  }

  .preview-status {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--subtle);
    background: color-mix(in srgb, var(--base) 85%, transparent);
  }

  .controls-column {
    flex-shrink: 0;
    padding: 20px 20px calc(env(safe-area-inset-bottom, 0px) + 120px);
    border-top: 1px solid var(--border-glass-faint);
    background: color-mix(in srgb, var(--base) 40%, transparent);
  }

  @media (min-width: 768px) {
    .controls-column {
      width: 420px;
      padding: 24px 24px 80px;
      overflow-y: auto;
      border-top: none;
      border-left: 1px solid var(--border-glass-faint);
    }
  }

  .section-label {
    display: block;
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .section-label.mt-5 {
    margin-top: 24px;
  }

  .format-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .format-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    padding: 12px 14px;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.13s ease;
    border: 1px solid var(--border-glass);
    background: transparent;
    color: var(--subtle);
    touch-action: manipulation;
  }

  .format-button--active {
    border-color: color-mix(in srgb, var(--iris) 50%, transparent);
    background: color-mix(in srgb, var(--iris) 10%, transparent);
    color: var(--iris);
  }

  .format-subtitle {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.05em;
    font-weight: 400;
  }

  .format-button--active .format-subtitle {
    color: color-mix(in srgb, var(--iris) 65%, transparent);
  }

  .page-footer {
    position: sticky;
    bottom: 0;
    z-index: 10;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px calc(env(safe-area-inset-bottom, 0px) + 12px);
    background: color-mix(in srgb, var(--base) 92%, transparent);
    border-top: 1px solid var(--border-glass-faint);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .dim-label {
    font-size: 9px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    white-space: nowrap;
  }

  .download-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 11px 20px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: all 0.15s ease;
    touch-action: manipulation;
    background: color-mix(in srgb, var(--iris) 85%, transparent);
    color: var(--base);
  }

  .download-button--busy {
    background: color-mix(in srgb, var(--highlight-med) 60%, transparent);
    color: var(--muted);
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
