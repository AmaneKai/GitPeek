<script lang="ts">
  import { Search } from "lucide-svelte"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"

  let { onSearch }: { onSearch: (username: string) => void } = $props()

  let username = $state("")
  let focused  = $state(false)

  function handleSearch() {
    const trimmed = username.trim()
    if (trimmed) onSearch(trimmed)
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") handleSearch()
  }
</script>

<div
  class="
    relative flex items-center w-full max-w-lg
    rounded-2xl p-1 glass
    transition-all duration-300 touch-manipulation
    max-w-[calc(100vw-24px)]
  "
  class:focused
>
  <!-- Search icon -->
  <div class="pl-4 pr-1 flex items-center shrink-0">
    <Search
      size={15}
      aria-hidden="true"
      class="transition-colors duration-200 {focused ? 'text-iris' : 'text-muted'}"
    />
  </div>

  <!-- Input -->
  <Input
    bind:value={username}
    onkeydown={handleKeydown}
    onfocus={() => focused = true}
    onblur={()  => focused = false}
    placeholder="username"
    spellcheck="false"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    enterkeyhint="search"
    class="
      flex-1 bg-transparent border-none outline-none shadow-none
      text-sm py-3 px-2 font-mono tracking-wide
      text-rp-text caret-iris placeholder:opacity-30
      focus-visible:ring-0 focus-visible:ring-offset-0
      touch-manipulation
    "
  />

  <!-- Submit button -->
  <Button
    onclick={handleSearch}
    variant="ghost"
    class="
      shrink-0 m-0.5 px-5 py-2.5 min-h-[44px]
      rounded-xl text-xs font-mono tracking-widest uppercase font-medium
      text-iris border border-iris/25
      bg-gradient-to-br from-iris/20 to-foam/15
      hover:from-iris/30 hover:to-foam/22 hover:border-iris/45 hover:text-iris
      active:scale-95 select-none
      transition-all duration-200 touch-manipulation
    "
  >
    peek
  </Button>
</div>

<style>
  .focused {
    border-color: rgba(144, 140, 170, 0.4) !important;
    box-shadow:
      0 0 0 4px rgba(196, 167, 231, 0.08),
      0 24px 48px -12px rgba(0, 0, 0, 0.5);
  }
</style>
