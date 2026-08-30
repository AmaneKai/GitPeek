<script lang="ts">
  import type { GithubStats } from '$lib/entities/github-stats/model/github-stats'
  import type { ThemeTokens } from '$lib/entities/theme/model/theme-manager'
  import {
    WALLPAPER_MONO_FONT_STACK,
    WALLPAPER_SERIF_FONT_STACK,
  } from '../lib/wallpaper-font-styles'
  import { PREVIEW_AVATAR_SIZE_PIXELS, withAvatarSizeHint } from '../lib/wallpaper-url'
  import WallpaperCard from './WallpaperCard.svelte'

  let {
    statistics,
    username,
    theme,
    avatarUrl,
    width,
    height,
  }: {
    statistics: GithubStats
    username: string
    theme: ThemeTokens
    avatarUrl: string
    width: number
    height: number
  } = $props()

  const previewAvatarUrl = $derived(withAvatarSizeHint(avatarUrl, PREVIEW_AVATAR_SIZE_PIXELS))

  const GOOGLE_FONTS_HREF =
    'https://fonts.googleapis.com/css2?family=Gelasio:wght@400;700' +
    '&family=Noto+Sans+JP&family=Noto+Serif+JP:wght@400;700&display=swap'
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
</svelte:head>

<div
  class="wallpaper-preview"
  style:--wallpaper-text-fill={theme.text}
  style:--wallpaper-mono-font={WALLPAPER_MONO_FONT_STACK}
  style:--wallpaper-serif-font={WALLPAPER_SERIF_FONT_STACK}
  style:aspect-ratio="{width} / {height}"
>
  <WallpaperCard
    {statistics}
    {username}
    {theme}
    avatarDataUri={previewAvatarUrl}
    {width}
    {height}
  />
</div>

<style>
  .wallpaper-preview {
    width: 100%;
    height: 100%;
  }

  .wallpaper-preview :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .wallpaper-preview :global(.text-main) {
    font-family: var(--wallpaper-mono-font);
    fill: var(--wallpaper-text-fill);
  }

  .wallpaper-preview :global(.text-serif) {
    font-family: var(--wallpaper-serif-font);
    fill: var(--wallpaper-text-fill);
  }
</style>
