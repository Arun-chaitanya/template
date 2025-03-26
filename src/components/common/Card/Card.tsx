import React, { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Card.module.scss'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Title displayed at the top of the card */
    title?: ReactNode
    /** Card header content, replaces title if specified */
    header?: ReactNode
    /** Card footer content */
    footer?: ReactNode
    /** Extra content to display in the header */
    extraHeader?: ReactNode
    /** Extra content to display in the footer */
    extraFooter?: ReactNode
    /** Card body content */
    children?: ReactNode
    /** Whether to add padding to the body */
    padded?: boolean
    /** Whether to highlight this card */
    highlighted?: boolean
    /** Whether to center content */
    centered?: boolean
    /** Card border type */
    border?: 'all' | 'top' | 'bottom' | 'left' | 'right' | 'none'
    /** Whether to use subtle styles */
    subtle?: boolean
    /** Automatically hug content width */
    hug?: boolean
}

/**
 * Card component with customizable sections and styles.
 * Inspired by PostHog's Lemon UI Card component.
 */
export function Card({
    title,
    header,
    footer,
    extraHeader,
    extraFooter,
    children,
    padded = true,
    highlighted = false,
    centered = false,
    border = 'all',
    subtle = false,
    hug = false,
    className,
    ...divProps
}: CardProps): React.ReactElement {
    const cardClassName = clsx(
        styles.card,
        {
            [styles['card-padded']]: padded,
            [styles['card-highlighted']]: highlighted,
            [styles['card-centered']]: centered,
            [styles['card-subtle']]: subtle,
            [styles['card-hug']]: hug,
            [styles[`card-border-${border}`]]: border !== 'all',
        },
        className
    )

    const renderHeader = () => {
        if (!header && !title && !extraHeader) {
            return null
        }

        return (
            <div className={styles['card-header']}>
                <div className={styles['card-header-content']}>
                    {header || (title && <h3 className={styles['card-title']}>{title}</h3>)}
                </div>
                {extraHeader && <div className={styles['card-header-extra']}>{extraHeader}</div>}
            </div>
        )
    }

    const renderFooter = () => {
        if (!footer && !extraFooter) {
            return null
        }

        return (
            <div className={styles['card-footer']}>
                {footer && <div className={styles['card-footer-content']}>{footer}</div>}
                {extraFooter && <div className={styles['card-footer-extra']}>{extraFooter}</div>}
            </div>
        )
    }

    return (
        <div className={cardClassName} {...divProps}>
            {renderHeader()}
            {children && <div className={styles['card-body']}>{children}</div>}
            {renderFooter()}
        </div>
    )
} 