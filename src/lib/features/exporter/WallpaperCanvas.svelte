<script lang="ts">
  import type { GithubStats } from "$lib/utils/types"
  import { formatNumber, accountAge } from "$lib/utils/format"
  import { buildSlices, arcPath } from "$lib/features/charts/useLanguagePie.svelte"
  import { Users, Calendar } from "lucide-svelte"

  let { stats, login, width, height }: {
    stats: GithubStats
    login: string
    width: number
    height: number
  } = $props()

  let displayName = $derived(stats.displayName || login)
  let isLandscape = $derived(width >= height)
  let u           = $derived(width / 100)

  const statItems = $derived([
    { label: "Contributions", value: stats.totalContributions, accent: "var(--foam)" },
    { label: "Commits",       value: stats.totalCommits,       accent: "var(--iris)" },
    { label: "Stars",         value: stats.totalStars,         accent: "var(--gold)" },
    { label: "Repos",         value: stats.totalRepos,         accent: "var(--pine)" },
    { label: "Followers",     value: stats.followers,          accent: "var(--rose)" },
    { label: "Pull Requests", value: stats.totalPrs,           accent: "var(--love)" },
  ])

  const langs  = $derived(stats.languages ?? [])
  const slices = $derived(buildSlices(langs))

  const donutSize = $derived(isLandscape ? u * 18 : u * 26)
  const donutCX   = $derived(donutSize / 2)
  const donutCY   = $derived(donutSize / 2)
  const donutRO   = $derived(donutSize * 0.46)
  const donutRI   = $derived(donutSize * 0.29)
</script>

<div style="
  width: {width}px; height: {height}px;
  position: relative; overflow: hidden;
  background: var(--base); color: var(--text);
  font-family: 'DM Mono', 'JetBrains Mono', monospace;
  box-sizing: border-box;
">
  <!-- Aurora -->
  <div aria-hidden="true" style="
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 85% 75% at -5% -10%, color-mix(in srgb, var(--iris) 20%, transparent), transparent 52%),
      radial-gradient(ellipse 65% 55% at 108% 108%, color-mix(in srgb, var(--foam) 16%, transparent), transparent 52%),
      radial-gradient(ellipse 50% 45% at 60% -5%, color-mix(in srgb, var(--love) 8%, transparent), transparent 62%);
  "></div>

  {#if isLandscape}
    <!-- ═══════════════ LANDSCAPE ═══════════════ -->
    <div style="
      position: relative; z-index: 1; height: 100%;
      display: grid; grid-template-columns: {u * 30}px 1fr;
      padding: {u * 5}px; gap: 0; box-sizing: border-box;
    ">

      <!-- LEFT: Profile -->
      <div style="
        display: flex; flex-direction: column; gap: {u * 2.2}px;
        justify-content: center;
        padding-right: {u * 4.5}px;
        border-right: 1px solid color-mix(in srgb, var(--iris) 15%, transparent);
        position: relative; overflow: hidden;
      ">
        <!-- Avatar -->
        <img
          src={stats.avatarUrl}
          crossorigin="anonymous"
          alt=""
          style="
            width: {u * 12}px; height: {u * 12}px;
            border-radius: {u * 2}px; object-fit: cover;
            border: {u * 0.15}px solid color-mix(in srgb, var(--iris) 40%, transparent);
            box-shadow: 0 {u * 1.5}px {u * 5}px rgba(0,0,0,0.55);
          "
        />

        <!-- Name + login -->
        <div style="display: flex; flex-direction: column; gap: {u * 0.6}px;">
          <h2 style="
            font-size: {u * 2.2}px; font-family: 'Instrument Serif', serif;
            font-weight: 600; line-height: 1.15; margin: 0; color: var(--text);
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          ">{displayName}</h2>
          <span style="font-size: {u * 1.15}px; color: var(--subtle); letter-spacing: 0.04em;">
            @{login}
          </span>
        </div>

        {#if stats.bio}
          <p style="
            font-size: {u * 1.05}px; color: var(--subtle); line-height: 1.65; margin: 0;
            display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
          ">{stats.bio}</p>
        {/if}

        <!-- Divider -->
        <div style="
          height: 1px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--iris) 30%, transparent), transparent);
        "></div>

        <!-- Followers / Following as mini stats -->
        <div style="display: flex; gap: {u * 3.5}px;">
          <div style="display: flex; flex-direction: column; gap: {u * 0.4}px;">
            <div style="display: flex; align-items: center; gap: {u * 0.5}px; color: var(--subtle);">
              <Users size={u * 1.1} />
              <span style="font-size: {u * 0.75}px; text-transform: uppercase; letter-spacing: 0.14em;">Followers</span>
            </div>
            <span style="
              font-size: {u * 2.2}px; font-family: 'Instrument Serif', serif;
              font-weight: 700; line-height: 1; color: var(--text);
            ">{formatNumber(stats.followers)}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: {u * 0.4}px;">
            <span style="font-size: {u * 0.75}px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--subtle);">
              Following
            </span>
            <span style="
              font-size: {u * 2.2}px; font-family: 'Instrument Serif', serif;
              font-weight: 700; line-height: 1; color: var(--text);
            ">{formatNumber(stats.following)}</span>
          </div>
        </div>

        <!-- Years on GitHub -->
        <div style="display: flex; align-items: center; gap: {u * 0.8}px; color: var(--subtle);">
          <Calendar size={u * 1.3} />
          <span style="font-size: {u * 1.15}px;">{accountAge(stats.accountCreatedAt)} on GitHub</span>
        </div>

        <div style="flex: 1;"></div>

        <!-- Branding -->
        <div style="display: flex; align-items: center; gap: {u * 1}px;">
          <span style="
            font-size: {u * 1.7}px; font-family: 'Instrument Serif', serif;
            background: linear-gradient(135deg, var(--iris) 0%, var(--foam) 50%, var(--rose) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          ">GitPeek</span>
          <span style="font-size: {u * 0.72}px; color: var(--muted);">github.com/{login}</span>
        </div>
      </div>

      <!-- RIGHT: Stats + Languages -->
      <div style="
        padding-left: {u * 4.5}px;
        display: flex; flex-direction: column; gap: {u * 2.2}px; justify-content: center;
      ">

        <!-- Stats 3×2: accent top-border + colored number -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: {u * 1.5}px;">
          {#each statItems as item}
            <div style="
              background: color-mix(in srgb, var(--surface) 80%, transparent);
              border: 1px solid color-mix(in srgb, {item.accent} 20%, transparent);
              border-top: {u * 0.35}px solid {item.accent};
              border-radius: {u * 1.3}px; padding: {u * 1.6}px {u * 1.8}px;
              display: flex; flex-direction: column; gap: {u * 0.6}px;
              box-shadow:
                0 {u * 0.5}px {u * 2}px rgba(0,0,0,0.4),
                0 0 {u * 4}px color-mix(in srgb, {item.accent} 7%, transparent);
            ">
              <span style="
                font-size: {u * 0.68}px; text-transform: uppercase; letter-spacing: 0.16em;
                color: var(--subtle);
              ">{item.label}</span>
              <span style="
                font-size: {u * 2.5}px; font-family: 'Instrument Serif', serif;
                font-weight: 700; line-height: 1; color: {item.accent};
              ">{formatNumber(item.value)}</span>
            </div>
          {/each}
        </div>

        <!-- Languages: donut + legend -->
        {#if slices.length}
          <div style="
            background: color-mix(in srgb, var(--surface) 80%, transparent);
            border: 1px solid color-mix(in srgb, var(--iris) 18%, transparent);
            border-top: {u * 0.35}px solid color-mix(in srgb, var(--iris) 60%, transparent);
            border-radius: {u * 1.3}px; padding: {u * 1.8}px {u * 2}px;
            box-shadow: 0 {u * 0.5}px {u * 2.5}px rgba(0,0,0,0.4);
            display: flex; align-items: center; gap: {u * 2.5}px;
          ">
            <!-- Donut with glow -->
            <svg
              width={donutSize}
              height={donutSize}
              viewBox="0 0 {donutSize} {donutSize}"
              style="flex-shrink: 0; overflow: visible;"
            >
              <defs>
                <filter id="donut-glow-l" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={u * 0.6} result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <!-- Track -->
              <circle
                cx={donutCX} cy={donutCY}
                r={(donutRO + donutRI) / 2}
                fill="none"
                stroke="rgba(144,140,170,0.1)"
                stroke-width={donutRO - donutRI + 1}
              />
              <!-- Glowing slices -->
              <g filter="url(#donut-glow-l)">
                {#each slices as slice}
                  <path
                    d={arcPath(donutCX, donutCY, donutRO, donutRI, slice.startDeg, slice.endDeg)}
                    fill={slice.color}
                  />
                {/each}
              </g>
              <circle cx={donutCX} cy={donutCY} r={donutRI - 2} fill="var(--base)" />
              <circle cx={donutCX} cy={donutCY} r={donutRI - 2}
                fill="none" stroke-width="1.5"
                stroke="color-mix(in srgb, var(--iris) 25%, transparent)"
              />
              <!-- Center text -->
              <text x={donutCX} y={donutCY - u * 0.6}
                text-anchor="middle" dominant-baseline="middle"
                font-size={u * 0.85} font-family="DM Mono, monospace"
                letter-spacing="0.06em" fill="var(--subtle)"
              >{slices.length}</text>
              <text x={donutCX} y={donutCY + u * 1.1}
                text-anchor="middle" dominant-baseline="middle"
                font-size={u * 0.68} font-family="DM Mono, monospace"
                letter-spacing="0.1em" fill="var(--muted)"
              >LANGUAGES</text>
            </svg>

            <!-- Legend -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: {u * 0.6}px; min-width: 0;">
              {#each slices as slice}
                <div style="display: flex; align-items: center; gap: {u * 0.8}px;">
                  <div style="
                    width: {u * 0.6}px; height: {u * 0.6}px; border-radius: 50%;
                    background: {slice.color}; flex-shrink: 0;
                    box-shadow: 0 0 {u * 0.6}px {slice.color};
                  "></div>
                  <span style="
                    font-size: {u * 0.75}px; color: var(--text); flex: 1;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                  ">{slice.name}</span>
                  <span style="font-size: {u * 0.7}px; color: {slice.color}; flex-shrink: 0; font-weight: 500;">
                    {slice.percentage}%
                  </span>
                </div>
              {/each}
            </div>

            <!-- Repo -->
            {#if stats.mostStarredRepo}
              {@const repo = stats.mostStarredRepo}
              <div style="
                flex-shrink: 0; width: {u * 16}px;
                border-left: 1px solid color-mix(in srgb, var(--subtle) 12%, transparent);
                padding-left: {u * 2}px;
                display: flex; flex-direction: column; gap: {u * 0.8}px; justify-content: center;
              ">
                <p style="
                  font-size: {u * 0.68}px; text-transform: uppercase; letter-spacing: 0.15em;
                  color: var(--muted); margin: 0;
                ">Top Repo</p>
                <h3 style="
                  font-size: {u * 1.2}px; font-family: 'Instrument Serif', serif;
                  color: var(--text); margin: 0;
                  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                ">{repo.name}</h3>
                <span style="font-size: {u * 1.1}px; color: var(--gold);">
                  ★ {formatNumber(repo.stars)}
                </span>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

  {:else}
    <!-- ═══════════════ PORTRAIT ═══════════════ -->
    <div style="
      position: relative; z-index: 1; height: 100%;
      display: flex; flex-direction: column;
      padding: {u * 6}px; gap: {u * 3}px;
      box-sizing: border-box; overflow: hidden;
    ">

      <!-- Logo -->
      <div style="text-align: center; flex-shrink: 0;">
        <span style="
          font-size: {u * 5}px; font-family: 'Instrument Serif', serif;
          background: linear-gradient(135deg, var(--iris) 0%, var(--foam) 50%, var(--rose) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        ">GitPeek</span>
      </div>

      <!-- Profile card -->
      <div style="
        display: flex; align-items: center; gap: {u * 4}px; flex-shrink: 0;
        background: color-mix(in srgb, var(--surface) 80%, transparent);
        border: 1px solid color-mix(in srgb, var(--iris) 20%, transparent);
        border-top: {u * 0.35}px solid color-mix(in srgb, var(--iris) 60%, transparent);
        border-radius: {u * 2.5}px; padding: {u * 3.5}px {u * 4}px;
        box-shadow: 0 {u * 1}px {u * 4}px rgba(0,0,0,0.4);
      ">
        <img
          src={stats.avatarUrl}
          crossorigin="anonymous"
          alt=""
          style="
            flex-shrink: 0;
            width: {u * 18}px; height: {u * 18}px;
            border-radius: {u * 2.5}px; object-fit: cover;
            border: {u * 0.18}px solid color-mix(in srgb, var(--iris) 40%, transparent);
            box-shadow: 0 {u * 1.5}px {u * 5}px rgba(0,0,0,0.55);
          "
        />
        <div style="min-width: 0; overflow: hidden;">
          <h2 style="
            font-size: {u * 4.5}px; font-family: 'Instrument Serif', serif;
            margin: 0 0 {u * 0.8}px; line-height: 1.1; color: var(--text);
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          ">{displayName}</h2>
          <p style="font-size: {u * 1.5}px; color: var(--subtle); margin: 0 0 {u * 1.2}px; letter-spacing: 0.05em;">@{login}</p>
          {#if stats.bio}
            <p style="
              font-size: {u * 1.3}px; color: var(--muted); margin: 0 0 {u * 1}px;
              display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
            ">{stats.bio}</p>
          {/if}
          <p style="font-size: {u * 1.2}px; color: var(--subtle); margin: 0;">
            <span style="color: var(--text);">{formatNumber(stats.followers)}</span> followers
            &nbsp;·&nbsp;
            <span style="color: var(--text);">{formatNumber(stats.following)}</span> following
          </p>
        </div>
      </div>

      <!-- Stats 3×2 with accent top-border + colored numbers -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: {u * 2.2}px; flex-shrink: 0;">
        {#each statItems as item}
          <div style="
            background: color-mix(in srgb, var(--surface) 80%, transparent);
            border: 1px solid color-mix(in srgb, {item.accent} 20%, transparent);
            border-top: {u * 0.35}px solid {item.accent};
            border-radius: {u * 2.2}px; padding: {u * 2.8}px {u * 2.5}px;
            display: flex; flex-direction: column; gap: {u * 1}px;
            box-shadow:
              0 {u * 0.5}px {u * 2.5}px rgba(0,0,0,0.4),
              0 0 {u * 4}px color-mix(in srgb, {item.accent} 7%, transparent);
          ">
            <span style="
              font-size: {u * 1.05}px; text-transform: uppercase; letter-spacing: 0.14em;
              color: var(--subtle);
            ">{item.label}</span>
            <span style="
              font-size: {u * 4}px; font-family: 'Instrument Serif', serif;
              font-weight: 700; line-height: 1; color: {item.accent};
            ">{formatNumber(item.value)}</span>
          </div>
        {/each}
      </div>

      <!-- Languages: donut + legend -->
      {#if slices.length}
        <div style="
          background: color-mix(in srgb, var(--surface) 80%, transparent);
          border: 1px solid color-mix(in srgb, var(--iris) 18%, transparent);
          border-top: {u * 0.35}px solid color-mix(in srgb, var(--iris) 60%, transparent);
          border-radius: {u * 2.2}px; padding: {u * 3}px {u * 3.5}px; flex-shrink: 0;
          box-shadow: 0 {u * 0.5}px {u * 2.5}px rgba(0,0,0,0.4);
          display: flex; align-items: center; gap: {u * 4}px;
        ">
          <!-- Donut with glow -->
          <svg
            width={donutSize}
            height={donutSize}
            viewBox="0 0 {donutSize} {donutSize}"
            style="flex-shrink: 0; overflow: visible;"
          >
            <defs>
              <filter id="donut-glow-p" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={u * 0.8} result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <circle
              cx={donutCX} cy={donutCY}
              r={(donutRO + donutRI) / 2}
              fill="none"
              stroke="rgba(144,140,170,0.1)"
              stroke-width={donutRO - donutRI + 1}
            />
            <g filter="url(#donut-glow-p)">
              {#each slices as slice}
                <path
                  d={arcPath(donutCX, donutCY, donutRO, donutRI, slice.startDeg, slice.endDeg)}
                  fill={slice.color}
                />
              {/each}
            </g>
            <circle cx={donutCX} cy={donutCY} r={donutRI - 2} fill="var(--base)" />
            <circle cx={donutCX} cy={donutCY} r={donutRI - 2}
              fill="none" stroke-width="1.5"
              stroke="color-mix(in srgb, var(--iris) 25%, transparent)"
            />
            <text x={donutCX} y={donutCY - u * 0.8}
              text-anchor="middle" dominant-baseline="middle"
              font-size={u * 1.1} font-family="DM Mono, monospace"
              letter-spacing="0.06em" fill="var(--subtle)"
            >{slices.length}</text>
            <text x={donutCX} y={donutCY + u * 1.5}
              text-anchor="middle" dominant-baseline="middle"
              font-size={u * 0.9} font-family="DM Mono, monospace"
              letter-spacing="0.1em" fill="var(--muted)"
            >LANGUAGES</text>
          </svg>

          <!-- Legend 2-col grid -->
          <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: {u * 1.2}px {u * 3}px;">
            {#each slices as slice}
              <div style="display: flex; align-items: center; gap: {u * 1.3}px;">
                <div style="
                  width: {u * 1.1}px; height: {u * 1.1}px; border-radius: 50%;
                  background: {slice.color}; flex-shrink: 0;
                  box-shadow: 0 0 {u * 0.8}px {slice.color};
                "></div>
                <span style="
                  font-size: {u * 1.15}px; color: var(--text); flex: 1;
                  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                ">{slice.name}</span>
                <span style="font-size: {u * 1.1}px; color: {slice.color}; flex-shrink: 0; font-weight: 500;">
                  {slice.percentage}%
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Most starred repo -->
      {#if stats.mostStarredRepo}
        {@const repo = stats.mostStarredRepo}
        <div style="
          background: color-mix(in srgb, var(--surface) 80%, transparent);
          border: 1px solid color-mix(in srgb, var(--gold) 20%, transparent);
          border-top: {u * 0.35}px solid color-mix(in srgb, var(--gold) 60%, transparent);
          border-radius: {u * 2.2}px; padding: {u * 2.5}px {u * 3}px;
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
          box-shadow: 0 {u * 0.5}px {u * 2.5}px rgba(0,0,0,0.4);
        ">
          <div style="display: flex; flex-direction: column; gap: {u * 0.8}px; min-width: 0; overflow: hidden;">
            <p style="
              font-size: {u * 1.05}px; text-transform: uppercase; letter-spacing: 0.12em;
              color: var(--muted); margin: 0;
            ">Top Repository</p>
            <h3 style="
              font-size: {u * 2.8}px; font-family: 'Instrument Serif', serif;
              color: var(--text); margin: 0;
              overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            ">{repo.name}</h3>
          </div>
          <span style="
            font-size: {u * 2.2}px; color: var(--gold); flex-shrink: 0; padding-left: {u * 2}px;
            font-family: 'Instrument Serif', serif; font-weight: 700;
          ">★ {formatNumber(repo.stars)}</span>
        </div>
      {/if}

      <!-- Footer -->
      <div style="margin-top: auto; text-align: center; flex-shrink: 0;">
        <span style="font-size: {u * 1.05}px; color: var(--muted);">github.com/{login}</span>
      </div>
    </div>
  {/if}
</div>
