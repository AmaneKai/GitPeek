<script lang="ts">
  import "../app.css"
  import { Toaster } from "svelte-sonner"

  let { children } = $props()
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <!--
    Non-blocking font load — print trick defers the stylesheet until
    after the page has rendered, eliminating render-blocking.
  -->
  <noscript>
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap"
      rel="stylesheet"
    />
  </noscript>
</svelte:head>

<Toaster
  position="bottom-right"
  toastOptions={{
    style: "background: #26233a; border: 1px solid rgba(144,140,170,0.25); color: #e0def4; font-family: 'DM Mono', monospace; font-size: 13px; border-radius: 14px;",
  }}
/>

{@render children()}
