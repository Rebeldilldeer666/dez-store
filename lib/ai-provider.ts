export type GeneratedCopy = { text: string }

export function isAiProviderConfigured() {
  return Boolean(process.env.CHEAPERINFERENCE_API_KEY && process.env.CHEAPERINFERENCE_MODEL)
}

export async function generateCopy(prompt: string): Promise<GeneratedCopy> {
  const apiKey = process.env.CHEAPERINFERENCE_API_KEY
  const model = process.env.CHEAPERINFERENCE_MODEL
  const baseUrl = process.env.CHEAPERINFERENCE_BASE_URL ?? 'https://api.cheaperinference.com/v1'
  if (!apiKey || !model) throw new Error('Optional AI provider is not configured')

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.4 }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`)
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('AI provider returned no content')
  return { text }
}
