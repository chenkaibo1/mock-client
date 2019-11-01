const storage: any = window.sessionStorage

export function setItem(key: string, value: any): void {
  storage.setItem(key, value)
}

export function getItem(key: string): string {
  return storage.getItem(key)
}

export function clear(key: string, clearAll: boolean = false): void {
  if (clearAll) {
    storage.clear()
  } else {
    storage.removeItem(key)
  }
}
