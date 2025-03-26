import React, { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

export type InputSize = 'small' | 'medium' | 'large'
export type InputStatus = 'default' | 'success' | 'warning' | 'error'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    /** Input size variant */
    size?: InputSize
    /** Element to display before the input */
    prefix?: ReactNode
    /** Element to display after the input */
    suffix?: ReactNode
    /** Icon to display before the input */
    icon?: ReactNode
    /** Whether the input is disabled */
    disabled?: boolean
    /** Status of the input for validation feedback */
    status?: InputStatus
    /** Label for the input */
    label?: ReactNode
    /** Help text to display below the input */
    help?: ReactNode
    /** Whether to allow the input to be cleared */
    allowClear?: boolean
    /** Whether to display a border */
    bordered?: boolean
    /** Whether to take up full width of container */
    fullWidth?: boolean
}

/**
 * Input component that supports different sizes, states, and decorations.
 * Inspired by PostHog's Lemon UI Input component.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size = 'medium',
            prefix,
            suffix,
            icon,
            disabled = false,
            status = 'default',
            label,
            help,
            allowClear = false,
            bordered = true,
            fullWidth = false,
            value,
            onChange,
            className,
            type = 'text',
            ...inputProps
        },
        ref
    ) => {
        const [localValue, setLocalValue] = useState(value || '')

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalValue(e.target.value)
            onChange?.(e)
        }

        const handleClear = () => {
            const emptied = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>
            setLocalValue('')
            onChange?.(emptied)
        }

        const inputClassName = clsx(
            styles.input,
            styles[`input-${size}`],
            styles[`input-${status}`],
            {
                [styles['input-disabled']]: disabled,
                [styles['input-bordered']]: bordered,
                [styles['input-full-width']]: fullWidth,
                [styles['input-with-prefix']]: !!prefix || !!icon,
                [styles['input-with-suffix']]: !!suffix || allowClear,
            },
            className
        )

        const shouldShowClearButton = allowClear && localValue && !disabled

        const renderInput = () => (
            <div className={styles['input-container']}>
                {(prefix || icon) && (
                    <span className={styles['input-prefix']}>
                        {icon && <span className={styles['input-icon']}>{icon}</span>}
                        {prefix}
                    </span>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={styles['input-field']}
                    disabled={disabled}
                    value={value ?? localValue}
                    onChange={handleChange}
                    {...inputProps}
                />
                {(suffix || shouldShowClearButton) && (
                    <span className={styles['input-suffix']}>
                        {shouldShowClearButton && (
                            <button
                                type="button"
                                className={styles['input-clear-button']}
                                onClick={handleClear}
                                tabIndex={-1}
                                aria-label="Clear input"
                            >
                                ×
                            </button>
                        )}
                        {suffix}
                    </span>
                )}
            </div>
        )

        return (
            <div className={inputClassName}>
                {label && <label className={styles['input-label']}>{label}</label>}
                {renderInput()}
                {help && <div className={styles['input-help']}>{help}</div>}
            </div>
        )
    }
)

Input.displayName = 'Input' 