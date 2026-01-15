export function openMusic(query: string) {
  const spotify = `https://open.spotify.com/search/${encodeURIComponent(query)}`
  const youtube = `https://music.youtube.com/search?q=${encodeURIComponent(query)}`

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
  window.open(isMobile ? spotify : youtube, "_blank")
}