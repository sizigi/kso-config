
export function toHex(value: number): string {
  return ('0' + value.toString(16).toUpperCase()).slice(-2)
}