export interface RetryPolicy {
  attempts: number
  delayMilliseconds: number
}

export async function requestWithRetries(
  send: () => Promise<Response>,
  policy: RetryPolicy,
): Promise<Response> {
  let lastFailure: unknown

  for (let attempt = 1; attempt <= policy.attempts; attempt++) {
    try {
      const response = await send()
      if (response.ok) return response
      lastFailure = new Error(`Request failed with status ${response.status}`)
    } catch (error) {
      lastFailure = error
    }

    if (attempt < policy.attempts) await delay(policy.delayMilliseconds)
  }

  throw lastFailure instanceof Error ? lastFailure : new Error('Request failed after retries')
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
