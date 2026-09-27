export function parseQuality(quality: string | null): number {
  if (!quality) return 0;
  const match = /(\d+)/.exec(quality);
  return match ? Number(match[1]) : 0;
}

export function isHlsUrl(url: string): boolean {
  return /\.m3u8($|\?)/i.test(url) || !/\.(mp4|webm|ogg|mp3|aac)($|\?)/i.test(url);
}
