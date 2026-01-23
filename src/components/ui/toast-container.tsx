'use client'

import { useState, useEffect } from 'react'
import { useToast, type Toast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const { subscribe, subscribeDismiss } = useToast()

  useEffect(() => {
    const unsubscribe = subscribe((toast) => {
      setToasts((prev) => [...prev, toast])
    })

    return unsubscribe
  }, [subscribe])

  useEffect(() => {
    const unsubscribe = subscribeDismiss((id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    })

    return unsubscribe
  }, [subscribeDismiss])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-9999 space-y-3 w-full max-w-2xl px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

function Toast({ toast }: { toast: Toast }) {
  const { dismissToast } = useToast()

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[toast.type]

  const textColor = {
    success: 'text-green-900',
    error: 'text-red-900',
    info: 'text-blue-900',
    warning: 'text-yellow-900',
  }[toast.type]

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }[toast.type]

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  }[toast.type]

  return (
    <div
      className={`${bgColor} border rounded-xl p-4 shadow-lg flex items-start gap-3 animate-in slide-in-from-right-5 fade-in duration-300`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${textColor}`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-sm ${textColor} opacity-90 mt-1`}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className={`shrink-0 p-1 hover:bg-black/10 rounded transition-colors`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
