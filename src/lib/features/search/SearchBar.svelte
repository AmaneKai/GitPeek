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
  <div class="pl-4 pr-1 flex items-center shrink-0">
    <Search
      size={15}
      aria-hidden="true"
      style="color: {focused ? 'var(--iris)' : 'var(--muted)'}; transition: color 0.2s;"
    />
  </div>

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
    style="color: var(--text);"
    class="
      flex-1 bg-transparent border-none outline-none shadow-none
      text-base sm:text-base py-3 px-2 font-mono tracking-wide
      caret-iris placeholder:opacity-30
      focus-visible:ring-0 focus-visible:ring-offset-0
      touch-manipulation
    "
  />

  <Button
    onclick={handleSearch}
    variant="ghost"
    style="color: var(--iris); border-color: color-mix(in srgb, var(--iris) 25%, transparent);
           background: linear-gradient(to bottom right, color-mix(in srgb, var(--iris) 20%, transparent), color-mix(in srgb, var(--foam) 15%, transparent));"
    class="
      shrink-0 m-0.5 px-5 py-2.5 min-h-[44px]
      rounded-xl text-base font-mono tracking-wide uppercase font-medium
      active:scale-95 select-none border
      transition-all duration-200 touch-manipulation
    "
  >
    peek
  </Button>
</div>

<style>
  .focused {
    border-color: color-mix(in srgb, var(--subtle) 40%, transparent) !important;
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--iris) 8%, transparent),
      0 24px 48px -12px rgba(0, 0, 0, 0.5);
  }
</style>
