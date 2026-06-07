"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = useCallback((next: string) => {
    setMessage(next)
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [message])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      >
        <div
          className={`rounded-full bg-espresso px-6 py-3 text-center font-sans text-sm text-cream shadow-lg transition-all duration-300 ${
            message ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {message}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
