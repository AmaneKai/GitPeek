<script lang="ts">
  import { toPng } from "html-to-image"
  import { X, Download } from "lucide-svelte"
  import type { GithubStats } from "$lib/utils/types"
  import WallpaperCanvas from "./WallpaperCanvas.svelte"
  import { toast } from "svelte-sonner"

  let { stats, login, onClose }: {
    stats: GithubStats
    login: string
    onClose: () => void
  } = $props()

  const formats = [
    { id: "desktop", name: "Desktop",    sub: "16 : 9",  w: 1920, h: 1080 },
    { id: "mac",     name: "MacBook",    sub: "16 : 10", w: 2560, h: 1600 },
    { id: "phone",   name: "Phone",      sub: "9 : 16",  w: 1080, h: 1920 },
    { id: "tall",    name: "Tall Phone", sub: "9 : 21",  w: 1080, h: 2520 },
  ]

  let selected   = $state(formats[0])
  let generating = $state(false)
  let exportNode = $state<HTMLElement | null>(null)

  // Measure the preview pane so the canvas fills all available space
  let previewW = $state(700)
  let previewH = $state(500)
  const PAD = 48 // 24px padding on each side
  let scale = $derived(Math.min(
    (previewW - PAD) / selected.w,
    (previewH - PAD) / selected.h,
  ))

  async function generate() {
    if (!exportNode || generating) return
    generating = true
    try {
      const dataUrl = await toPng(exportNode, {
        pixelRatio: 2,
        cacheBust: true,
        width: selected.w,
        height: selected.h,
      })
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `gitpeek-${login}-${selected.id}.png`
      a.click()
    } catch (e) {
      console.error("Wallpaper export failed:", e)
      toast.error("Export failed. Try again.")
    } finally {
      generating = false
    }
  }

  function handleBackdropKey(e: KeyboardEvent) {
    if (e.key === "Escape") onClose()
  }
</script>

<svelte:window onkeydown={handleBackdropKey} />

<!-- Backdrop -->
<div
  class="fixed inset-0 z-40"
  style="background: rgba(0,0,0,0.72); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);"
  role="button"
  tabindex="-1"
  onclick={onClose}
  onkeydown={() => {}}
  aria-label="Close wallpaper exporter"
></div>

<!-- Modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
  <div class="modal-shell pointer-events-auto" style="
    display: flex;
    width: min(1060px, 96vw);
    max-height: 88vh;
    border-radius: 20px;
    overflow: hidden;
    background: var(--overlay);
    border: 1px solid color-mix(in srgb, var(--subtle) 18%, transparent);
    box-shadow: 0 48px 96px -24px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04) inset;
  ">

    <!-- ── SIDEBAR ── -->
    <aside style="
      width: 256px; flex-shrink: 0;
      display: flex; flex-direction: column;
      padding: 20px;
      border-right: 1px solid color-mix(in srgb, var(--highlight-med) 40%, transparent);
      background: color-mix(in srgb, var(--base) 40%, transparent);
    ">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <span style="
          font-size: 10px; font-family: 'DM Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: var(--subtle);
        ">Wallpaper Export</span>
        <button
          onclick={onClose}
          class="flex items-center justify-center w-6 h-6 rounded-lg transition-colors duration-150"
          style="color: var(--muted);"
          aria-label="Close"
        >
          <X size={13} />
        </button>
      </div>

      <!-- Format list -->
      <p style="
        font-size: 9px; font-family: 'DM Mono', monospace;
        text-transform: uppercase; letter-spacing: 0.18em;
        color: var(--muted); margin: 0 0 8px;
      ">Format</p>
      <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
        {#each formats as fmt}
          <button
            onclick={() => selected = fmt}
            style="
              display: flex; align-items: center; justify-content: space-between;
              padding: 9px 12px; border-radius: 10px; width: 100%;
              font-family: 'DM Mono', monospace; font-size: 11px;
              text-align: left; cursor: pointer; transition: all 0.13s ease;
              border: 1px solid {selected.id === fmt.id
                ? 'color-mix(in srgb, var(--iris) 50%, transparent)'
                : 'transparent'};
              background: {selected.id === fmt.id
                ? 'color-mix(in srgb, var(--iris) 10%, transparent)'
                : 'transparent'};
              color: {selected.id === fmt.id ? 'var(--iris)' : 'var(--subtle)'};
            "
          >
            <span>{fmt.name}</span>
            <span style="
              font-size: 9px; letter-spacing: 0.05em;
              color: {selected.id === fmt.id ? 'color-mix(in srgb, var(--iris) 65%, transparent)' : 'var(--muted)'};
            ">{fmt.sub}</span>
          </button>
        {/each}
      </div>

      <!-- Bottom: resolution + generate -->
      <div style="display: flex; flex-direction: column; gap: 10px; padding-top: 16px; border-top: 1px solid color-mix(in srgb, var(--highlight-med) 35%, transparent);">
        <span style="
          font-size: 9px; font-family: 'DM Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--muted); text-align: center;
        ">{selected.w} × {selected.h}</span>
        <button
          onclick={generate}
          disabled={generating}
          style="
            display: flex; align-items: center; justify-content: center; gap: 7px;
            width: 100%; padding: 11px;
            border-radius: 50px; cursor: pointer;
            font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600;
            letter-spacing: 0.08em; text-transform: uppercase;
            background: {generating
              ? 'color-mix(in srgb, var(--highlight-med) 60%, transparent)'
              : 'color-mix(in srgb, var(--iris) 85%, transparent)'};
            color: {generating ? 'var(--muted)' : 'var(--base)'};
            border: none; transition: all 0.15s ease;
            opacity: {generating ? 0.7 : 1};
          "
        >
          {#if !generating}
            <Download size={12} />
          {/if}
          {generating ? "Generating…" : "Download PNG"}
        </button>
      </div>
    </aside>

    <!-- ── PREVIEW PANE ── -->
    <main
      bind:clientWidth={previewW}
      bind:clientHeight={previewH}
      style="flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0;"
    >

      <!-- Preview header -->
      <div style="
        padding: 12px 20px;
        border-bottom: 1px solid color-mix(in srgb, var(--highlight-med) 35%, transparent);
        flex-shrink: 0;
      ">
        <span style="
          font-size: 9px; font-family: 'DM Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.18em; color: var(--muted);
        ">Live Preview</span>
      </div>

      <!-- Canvas preview area -->
      <div style="
        flex: 1; display: flex; align-items: center; justify-content: center;
        overflow: hidden; padding: 24px;
        background: repeating-linear-gradient(
          45deg,
          color-mix(in srgb, var(--highlight-low) 30%, transparent) 0px,
          color-mix(in srgb, var(--highlight-low) 30%, transparent) 1px,
          transparent 1px, transparent 12px
        );
      ">
        <!-- Clipping shell — sets the visible preview size -->
        <div style="
          width: {selected.w * scale}px;
          height: {selected.h * scale}px;
          position: relative; overflow: hidden; flex-shrink: 0;
          border-radius: 6px;
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset;
        ">
          <!-- Scale wrapper: shrinks visually but is NOT the capture target -->
          <div style="
            transform: scale({scale});
            transform-origin: top left;
            width: {selected.w}px;
            height: {selected.h}px;
          ">
            <!-- exportNode has no transform — html-to-image sees the real 1920×1080 -->
            <div bind:this={exportNode} style="width: {selected.w}px; height: {selected.h}px;">
              <WallpaperCanvas {stats} {login} width={selected.w} height={selected.h} />
            </div>
          </div>
        </div>
      </div>
    </main>

  </div>
</div>
