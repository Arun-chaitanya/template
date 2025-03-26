import React, { ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './Toast.module.scss'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
    /** Toast message */
    message: ReactNode
    /** Toast message type */
    type?: ToastType
    /** Duration before auto-dismissing (ms). Set to 0 for no auto-dismiss */
    duration?: number
    /** Whether the toast is visible */
    visible: boolean
    /** Callback when toast is dismissed */
    onDismiss: () => void
    /** Whether to show a close button */
    closable?: boolean
    /** CSS class name */
    className?: string
    /** Custom ID for the toast */
    id?: string
    /** Whether to show a progress bar indicating time until auto-dismiss */
    showProgress?: boolean
    /** Action component/button to display */
    action?: ReactNode
}

/**
 * Individual Toast component.
 */
export function Toast({
    message,
    type = 'info',
    duration = 5000,
    visible,
    onDismiss,
    closable = true,
    className,
    id,
    showProgress = true,
    action,
}: ToastProps): React.ReactElement | null {
    const [isVisible, setIsVisible] = useState(visible)
    const [isExiting, setIsExiting] = useState(false)
    const [progress, setProgress] = useState(100)

    // Handle visibility changes
    useEffect(() => {
        if (visible && !isVisible) {
            setIsVisible(true)
            setIsExiting(false)
            setProgress(100)
        } else if (!visible && isVisible && !isExiting) {
            setIsExiting(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                setIsExiting(false)
            }, 200) // Match transition duration
            return () => clearTimeout(timer)
        }
    }, [visible, isVisible, isExiting])

    // Handle auto-dismiss
    useEffect(() => {
        if (!isVisible || !duration || isExiting) return

        // Set up progress bar
        const startTime = Date.now()
        let animationFrame: number
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, duration - elapsed)
            const progressValue = (remaining / duration) * 100
            
            setProgress(progressValue)
            
            if (progressValue > 0) {
                animationFrame = requestAnimationFrame(updateProgress)
            } else {
                handleDismiss()
            }
        }
        
        animationFrame = requestAnimationFrame(updateProgress)
        
        // Set up auto-dismiss
        const timer = setTimeout(handleDismiss, duration)
        
        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(animationFrame)
        }
    }, [isVisible, duration, isExiting])

    const handleDismiss = () => {
        if (!isExiting) {
            setIsExiting(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                setIsExiting(false)
                onDismiss()
            }, 200) // Match transition duration
            return () => clearTimeout(timer)
        }
    }

    if (!isVisible) {
        return null
    }

    const toastClasses = clsx(
        styles.toast,
        styles[`toast-${type}`],
        {
            [styles['toast-exiting']]: isExiting
        },
        className
    )

    return (
        <div className={toastClasses} role="alert" id={id}>
            <div className={styles['toast-content']}>
                <div className={styles['toast-icon']}>
                    {type === 'info' && 'ℹ️'}
                    {type === 'success' && '✓'}
                    {type === 'warning' && '⚠️'}
                    {type === 'error' && '✕'}
                </div>
                <div className={styles['toast-message']}>{message}</div>
                {action && <div className={styles['toast-action']}>{action}</div>}
                {closable && (
                    <button className={styles['toast-close']} onClick={handleDismiss} aria-label="Close">
                        ×
                    </button>
                )}
            </div>
            {showProgress && duration > 0 && (
                <div className={styles['toast-progress']}>
                    <div 
                        className={styles['toast-progress-bar']} 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            )}
        </div>
    )
}

// Toast container to manage multiple toasts
interface ToastContainerProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
    className?: string
    children: ReactNode
}

export function ToastContainer({
    position = 'top-right',
    className,
    children,
}: ToastContainerProps): React.ReactElement {
    const containerClasses = clsx(
        styles['toast-container'],
        styles[`toast-container-${position}`],
        className
    )

    return <div className={containerClasses}>{children}</div>
}

// Toast manager context and hooks
interface ToastOptions extends Omit<ToastProps, 'visible' | 'onDismiss' | 'message'> {
    message: ReactNode
}

interface ToastContextValue {
    showToast: (options: ToastOptions) => string
    dismissToast: (id: string) => void
    clearAllToasts: () => void
}

export const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function useToast(): ToastContextValue {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

interface ToastProviderProps {
    children: ReactNode
    position?: ToastContainerProps['position']
    max?: number
}

export function ToastProvider({
    children,
    position = 'top-right',
    max = 5,
}: ToastProviderProps): React.ReactElement {
    const [toasts, setToasts] = useState<
        (ToastOptions & { id: string; visible: boolean })[]
    >([])

    const showToast = (options: ToastOptions): string => {
        const id = Math.random().toString(36).substring(2, 9)
        
        setToasts((currentToasts) => {
            // If we have too many toasts, remove the oldest ones
            const newToasts = [...currentToasts]
            if (newToasts.length >= max) {
                newToasts.splice(0, newToasts.length - max + 1)
            }
            
            return [...newToasts, { ...options, id, visible: true }]
        })
        
        return id
    }

    const dismissToast = (id: string) => {
        setToasts((currentToasts) =>
            currentToasts.map((toast) =>
                toast.id === id ? { ...toast, visible: false } : toast
            )
        )
        
        // Remove toast from array after animation completes
        setTimeout(() => {
            setToasts((currentToasts) =>
                currentToasts.filter((toast) => toast.id !== id)
            )
        }, 500)
    }

    const clearAllToasts = () => {
        setToasts((currentToasts) =>
            currentToasts.map((toast) => ({ ...toast, visible: false }))
        )
        
        // Remove all toasts after animation completes
        setTimeout(() => {
            setToasts([])
        }, 500)
    }

    return (
        <ToastContext.Provider value={{ showToast, dismissToast, clearAllToasts }}>
            {children}
            <ToastContainer position={position}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onDismiss={() => dismissToast(toast.id)}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    )
} 