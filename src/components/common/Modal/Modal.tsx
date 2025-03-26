'use client';

import React, { ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './Modal.module.scss'
import { Button } from '../Button'

export interface ModalProps {
    /** Whether the modal is visible */
    isOpen: boolean
    /** Callback when the modal is dismissed */
    onClose: () => void
    /** Modal title */
    title?: ReactNode
    /** Modal width */
    width?: number | string
    /** Whether to show a close button in the header */
    closable?: boolean
    /** CSS class name */
    className?: string
    /** Modal content */
    children: ReactNode
    /** Footer content */
    footer?: ReactNode
    /** Whether to center the modal vertically */
    centered?: boolean
    /** Secondary title/subtitle shown below the main title */
    subtitle?: ReactNode
    /** Whether to disable closing the modal when clicking outside */
    disableOutsideClick?: boolean
    /** Whether to disable closing the modal when pressing escape */
    disableEscape?: boolean
    /** Custom header content (replaces title) */
    header?: ReactNode
    /** Icon to display in the header */
    icon?: ReactNode
    /** Whether to render the modal inline */
    inline?: boolean
    /** Whether the modal can be dragged */
    draggable?: boolean
}

/**
 * Modal component for displaying content in a layer above the app.
 * Inspired by PostHog's Lemon UI Modal component.
 */
export function Modal({
    isOpen,
    onClose,
    title,
    width = 480,
    closable = true,
    className,
    children,
    footer,
    centered = false,
    subtitle,
    disableOutsideClick = false,
    disableEscape = false,
    header,
    icon,
    inline = false,
    draggable = false,
}: ModalProps): React.ReactElement | null {
    const [isVisible, setIsVisible] = useState(isOpen)
    const [isExiting, setIsExiting] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

    // Handle open/close transitions
    useEffect(() => {
        if (isOpen && !isVisible) {
            setIsVisible(true)
            setIsExiting(false)
        } else if (!isOpen && isVisible && !isExiting) {
            setIsExiting(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                setIsExiting(false)
            }, 200) // Match transition duration
            return () => clearTimeout(timer)
        }
    }, [isOpen, isVisible, isExiting])

    // Handle escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible && !disableEscape) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isVisible, onClose, disableEscape])

    // Handle click outside modal
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (
            e.target === e.currentTarget &&
            !disableOutsideClick &&
            !dragging
        ) {
            onClose()
        }
    }

    // Dragging functionality
    const handleDragStart = (e: React.MouseEvent) => {
        if (!draggable || e.button !== 0) return
        setDragging(true)
        
        const modalRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const offsetX = e.clientX - modalRect.left
        const offsetY = e.clientY - modalRect.top
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            setPosition({
                x: moveEvent.clientX - offsetX,
                y: moveEvent.clientY - offsetY,
            })
        }
        
        const handleMouseUp = () => {
            setDragging(false)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
        
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    if (!isVisible) {
        return null
    }

    const modalStyle: React.CSSProperties = {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        ...(position && { top: position.y, left: position.x, margin: 0, position: 'absolute' })
    }

    const modalClassName = clsx(
        styles.modal,
        {
            [styles['modal-visible']]: isVisible,
            [styles['modal-exiting']]: isExiting,
            [styles['modal-centered']]: centered,
            [styles['modal-inline']]: inline,
            [styles['modal-draggable']]: draggable,
            [styles['modal-dragging']]: dragging,
        },
        className
    )

    const renderHeader = () => {
        if (!header && !title && !closable) {
            return null
        }

        return (
            <div 
                className={styles['modal-header']} 
                onMouseDown={draggable ? handleDragStart : undefined}
            >
                {header || (
                    <div className={styles['modal-title-container']}>
                        {icon && <div className={styles['modal-icon']}>{icon}</div>}
                        <div className={styles['modal-title-wrapper']}>
                            {title && <h3 className={styles['modal-title']}>{title}</h3>}
                            {subtitle && <div className={styles['modal-subtitle']}>{subtitle}</div>}
                        </div>
                    </div>
                )}
                {closable && (
                    <Button
                        icon="×"
                        iconOnly
                        type="tertiary"
                        onClick={onClose}
                        className={styles['modal-close-button']}
                        aria-label="Close modal"
                    />
                )}
            </div>
        )
    }

    const renderFooter = () => {
        if (!footer) {
            return null
        }

        return <div className={styles['modal-footer']}>{footer}</div>
    }

    const modalContent = (
        <div className={modalClassName} style={modalStyle} onClick={e => e.stopPropagation()}>
            {renderHeader()}
            <div className={styles['modal-body']}>{children}</div>
            {renderFooter()}
        </div>
    )

    if (inline) {
        return modalContent
    }

    return (
        <div className={styles['modal-backdrop']} onClick={handleBackdropClick}>
            {modalContent}
        </div>
    )
} 