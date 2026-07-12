import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <section className="toast-viewport" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div>
            <strong>{toast.title}</strong>
            {toast.message && <p>{toast.message}</p>}
          </div>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
            x
          </button>
        </article>
      ))}
    </section>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((type, title, message, duration = 3000) => {
    const id = uid()
    setToasts((previous) => [...previous, { id, type, title, message }])

    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  const value = useMemo(
    () => ({
      success: (title, message, duration) => pushToast('success', title, message, duration),
      error: (title, message, duration) => pushToast('error', title, message, duration),
      warning: (title, message, duration) => pushToast('warning', title, message, duration),
      info: (title, message, duration) => pushToast('info', title, message, duration),
    }),
    [pushToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}
