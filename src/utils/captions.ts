// Caption utilities — turns scene transcript_text into timed cues and WebVTT.
// Until per-line timing arrives with the ElevenLabs narration, sentences are
// distributed across the scene proportionally to their length.

export interface Cue {
  start: number
  end: number
  text: string
}

export function buildSceneCues(transcript: string, duration: number): Cue[] {
  const sentences = transcript
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (sentences.length === 0) return []

  const totalChars = sentences.reduce((n, s) => n + s.length, 0)
  const cues: Cue[] = []
  let t = 0
  for (const sentence of sentences) {
    const span = (sentence.length / totalChars) * duration
    cues.push({ start: t, end: Math.min(t + span, duration), text: sentence })
    t += span
  }
  return cues
}

const stamp = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = (sec % 60).toFixed(3).padStart(6, '0')
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${s}`
}

export function cuesToVTT(cues: Cue[]): string {
  const body = cues
    .map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}`)
    .join('\n\n')
  return `WEBVTT\n\n${body}\n`
}

export function vttObjectURL(transcript: string, duration: number): string {
  const vtt = cuesToVTT(buildSceneCues(transcript, duration))
  return URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }))
}
