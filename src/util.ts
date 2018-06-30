
export function toHex(value: number): string {
  return ('0' + value.toString(16).toUpperCase()).slice(-2)
}

export function safe_set(array: Uint8Array, source: Uint8Array, offset: number): void {
  array.set(
    source.subarray(0, array.length - offset),
    offset)
}