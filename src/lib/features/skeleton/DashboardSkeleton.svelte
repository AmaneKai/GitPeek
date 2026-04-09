<div class="dashboard fade-in-up">

  <!-- Left col: profile + stat grid -->
  <div class="col">
    <!-- Profile skeleton -->
    <div class="glass rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 overflow-hidden">
      <div class="shimmer w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[14px]"></div>
      <div class="flex flex-col gap-2.5 flex-1 pt-1">
        <div class="shimmer h-6 w-40 rounded-lg"></div>
        <div class="shimmer h-3 w-full rounded-md opacity-60"></div>
        <div class="shimmer h-3 w-2/3 rounded-md opacity-60"></div>
      </div>
    </div>

    <!-- Hero stat skeletons (2-col) -->
    <div class="grid grid-cols-2 gap-3">
      {#each [0, 1] as i}
        <div
          class="shimmer rounded-2xl h-24 bg-surface/60 border border-highlight-med/10"
          style="animation-delay:{i * 60}ms"
        ></div>
      {/each}
    </div>

    <!-- Detail stat skeletons (3-col) -->
    <div class="grid grid-cols-3 gap-2.5">
      {#each [0, 1, 2, 3, 4, 5] as i}
        <div
          class="shimmer rounded-[14px] h-20 bg-surface/60 border border-highlight-med/10"
          style="animation-delay:{i * 60}ms"
        ></div>
      {/each}
    </div>
  </div>

  <!-- Right col: language pie + repo -->
  <div class="col">
    <!-- Language pie skeleton -->
    <div class="glass rounded-2xl p-4 sm:p-5 overflow-hidden" style="min-height:260px;">
      <div class="flex items-center gap-3 mb-5">
        <div class="shimmer h-2.5 w-20 rounded-md"></div>
        <div class="flex-1 h-px bg-subtle/10"></div>
        <div class="shimmer h-5 w-14 rounded-full"></div>
      </div>
      <div class="flex items-start gap-5">
        <div class="shimmer shrink-0 rounded-full w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]">
        </div>
        <div class="flex flex-col gap-3 flex-1">
          {#each [0, 1, 2, 3, 4] as i}
            <div class="flex items-center gap-2" style="animation-delay:{i * 60}ms">
              <div class="shimmer w-6 h-6 rounded-md"></div>
              <div class="shimmer h-3 flex-1 rounded-md"></div>
              <div class="shimmer h-2 w-16 rounded-full"></div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Repo skeleton -->
    <div class="glass rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 overflow-hidden">
      <div class="flex flex-col gap-2 flex-1">
        <div class="shimmer h-2 w-24 rounded-md"></div>
        <div class="shimmer h-5 w-40 rounded-lg"></div>
      </div>
      <div class="shimmer h-9 w-20 rounded-xl"></div>
    </div>
  </div>

</div>

<style>
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    touch-action: pan-y pinch-zoom;
  }

  @media (min-width: 860px) {
    .dashboard {
      grid-template-columns: 1.05fr 1fr;
      align-items: start;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 14px;
    touch-action: pan-y;
  }

  @media (max-width: 640px) {
    .dashboard { gap: 12px; }
    .col       { gap: 12px; }
  }
</style>
