export function formatDuration(hours: number | string) {
  const value = Number(hours || 0);
  if (value < 8) {
    return `${value.toFixed(1)} 小时`;
  }
  return `${(value / 8).toFixed(1)} 工日`;
}
