import { useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

// Simple in-memory toast store
let toastListeners: Set<(toast: Toast) => void> = new Set()
let toastDismissListeners: Set<(id: string) => void> = new Set()

export function useToast() {
  const showToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration: number = 3000
  ) => {
    const id = `${Date.now()}-${Math.random()}`
    const toast: Toast = { id, type, title, message, duration }

    // Notify all listeners
    toastListeners.forEach(listener => listener(toast))

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        toastDismissListeners.forEach(listener => listener(id))
      }, duration)
    }

    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    toastDismissListeners.forEach(listener => listener(id))
  }, [])

  return {
    showToast: {
      success: (title: string, message?: string) => showToast('success', title, message),
      error: (title: string, message?: string) => showToast('error', title, message),
      info: (title: string, message?: string) => showToast('info', title, message),
      warning: (title: string, message?: string) => showToast('warning', title, message),
    },
    dismissToast,
    subscribe: (listener: (toast: Toast) => void) => {
      toastListeners.add(listener)
      return () => {
        toastListeners.delete(listener)
      }
    },
    subscribeDismiss: (listener: (id: string) => void) => {
      toastDismissListeners.add(listener)
      return () => {
        toastDismissListeners.delete(listener)
      }
    },
  }
}
