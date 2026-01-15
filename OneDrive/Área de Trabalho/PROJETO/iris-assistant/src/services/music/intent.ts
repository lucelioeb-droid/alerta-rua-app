export function isMusicCommand(text: string) {
  return /(toca|toque|play|pausa|parar)/i.test(text)
}

export function parseMusicIntent(text: string) {
  if (/pausa|parar/i.test(text)) {
    return { action: "pause" }
  }

  const match = text.match(/toca(?:r)? (.+)/i)
  if (match) {
    return { action: "play", query: match[1] }
  }

  return null
}