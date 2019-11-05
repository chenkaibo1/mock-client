const storage: any = window.sessionStorage

export function setItem(key: string, value: any): void {
  storage.setItem(key, value)
}

export function getItem(key: string): string {
  return storage.getItem(key)
}

export function removeItem(key: string): void {
  storage.removeItem(key)
}

export function clear() {
  storage.clear()
}
