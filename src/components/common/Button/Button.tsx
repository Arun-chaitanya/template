import Link from 'next/link';
import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

// Create a type that extracts common attributes between button and anchor
type CommonHTMLAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement> & 
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'type' | 'onClick' | 'className' | 'href' | 'target' | 'rel'
>

export interface ButtonProps extends CommonHTMLAttributes {
    /** Button visual type variant */
    type?: ButtonType
    /** Button size variant */
    size?: ButtonSize
    /** Icon to display to the left of children */
    icon?: ReactNode
    /** Icon to display to the right of children */
    sideIcon?: ReactNode
    /** Whether the icon should be the only content (with children used for accessibility) */
    iconOnly?: boolean
    /** Whether the button is in a loading state */
    loading?: boolean
    /** Whether the button is disabled */
    disabled?: boolean
    /** Whether this button's role is submit (in a form) */
    htmlType?: 'button' | 'submit' | 'reset'
    /** URL to link to (renders as anchor) */
    to?: string
    /** Target for the link (requires to) */
    targetBlank?: boolean
    /** Whether to apply full width styling */
    fullWidth?: boolean
    /** Whether to apply active styling */
    active?: boolean
    /** Custom center tooltip on hover */
    tooltip?: string | null
    /** Custom data attribute for testing */
    'data-attr'?: string
    /** Click handler */
    onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] | AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
    /** Additional class name */
    className?: string
}

/**
 * Button component that supports different visual types, sizes, and states.
 * Inspired by PostHog's Lemon UI Button component.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            type = 'primary',
            size = 'medium',
            icon,
            sideIcon,
            iconOnly = false,
            loading = false,
            disabled = false,
            htmlType = 'button',
            to,
            targetBlank = false,
            fullWidth = false,
            active = false,
            tooltip = null,
            className,
            'data-attr': dataAttr,
            onClick,
            ...restProps
        },
        ref
    ) => {
        const buttonClassName = clsx(
            styles.button,
            styles[`button-${type}`],
            styles[`button-${size}`],
            {
                [styles['button-icon-only']]: iconOnly,
                [styles['button-loading']]: loading,
                [styles['button-full-width']]: fullWidth,
                [styles['button-active']]: active,
            },
            className
        )

        const loadingIcon = loading ? (
            <span className={styles['button-spinner']}>
                <span className={styles['spinner-circle']} />
            </span>
        ) : null
        
        if (to) {
            return (
                <Link
                    href={to}
                    className={buttonClassName}
                    target={targetBlank ? '_blank' : undefined}
                    rel={targetBlank ? 'noopener noreferrer' : undefined}
                    title={tooltip || undefined}
                    data-attr={dataAttr}
                    aria-label={iconOnly && typeof children === 'string' ? children : undefined}
                    onClick={onClick as AnchorHTMLAttributes<HTMLAnchorElement>['onClick']}
                    {...restProps as AnchorHTMLAttributes<HTMLAnchorElement>}
                >
                    {loadingIcon || icon ? (
                        <span className={styles['button-icon']}>{loadingIcon || icon}</span>
                    ) : null}
                    {!iconOnly && children ? <span className={styles['button-label']}>{children}</span> : null}
                    {sideIcon ? <span className={styles['button-side-icon']}>{sideIcon}</span> : null}
                </Link>
            )
        }

        return (
            <button
                ref={ref}
                className={buttonClassName}
                title={tooltip || undefined}
                data-attr={dataAttr}
                aria-label={iconOnly && typeof children === 'string' ? children : undefined}
                type={htmlType}
                disabled={disabled || loading}
                onClick={onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
                {...restProps as ButtonHTMLAttributes<HTMLButtonElement>}
            >
                {loadingIcon || icon ? (
                    <span className={styles['button-icon']}>{loadingIcon || icon}</span>
                ) : null}
                {!iconOnly && children ? <span className={styles['button-label']}>{children}</span> : null}
                {sideIcon ? <span className={styles['button-side-icon']}>{sideIcon}</span> : null}
            </button>
        )
    }
)

Button.displayName = 'Button'

// Legacy component for backward compatibility
interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: ButtonType;
    className?: string;
}

export function LinkButton({ href, children, variant = 'primary', className }: LinkButtonProps) {
    return (
        <Button to={href} type={variant} className={className}>
            {children}
        </Button>
    );
} 