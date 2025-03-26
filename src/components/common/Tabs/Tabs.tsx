import React, { ReactNode, useState, useEffect } from 'react'
import clsx from 'clsx'
import styles from './Tabs.module.scss'

export interface TabProps {
    /** Tab key (identifier) */
    key: string
    /** Tab label */
    label: ReactNode
    /** Tab content */
    content: ReactNode
    /** Optional icon to display before the label */
    icon?: ReactNode
    /** Whether tab is disabled */
    disabled?: boolean
    /** Extra CSS class names */
    className?: string
    /** Custom tooltip for the tab */
    tooltip?: string
    /** Extra content to display to the right of the label */
    extraContent?: ReactNode
    /** Badge content to display (e.g. count) */
    badge?: ReactNode
}

export interface TabsProps {
    /** List of tab items */
    tabs: TabProps[]
    /** Currently active tab key */
    activeKey?: string
    /** Callback when a tab is clicked */
    onChange?: (key: string) => void
    /** Whether to animate the tab transitions */
    animated?: boolean
    /** Whether to render tabs in mobile mode (stacked) */
    mobileMode?: boolean
    /** Tab size */
    size?: 'small' | 'medium' | 'large'
    /** CSS class name */
    className?: string
    /** Center tabs */
    centered?: boolean
    /** Stretch tabs to full width */
    fullWidth?: boolean
    /** Whether to use a bordered style */
    bordered?: boolean
    /** Content to display to the right of the tabs */
    tabsExtra?: ReactNode
}

/**
 * Tabs component for organizing content into separate sections.
 * Inspired by PostHog's Lemon UI Tabs component.
 */
export function Tabs({
    tabs,
    activeKey,
    onChange,
    animated = true,
    mobileMode = false,
    size = 'medium',
    className,
    centered = false,
    fullWidth = false,
    bordered = false,
    tabsExtra,
}: TabsProps): React.ReactElement {
    const [activeTabKey, setActiveTabKey] = useState<string>(activeKey || (tabs.length > 0 ? tabs[0].key : ''))

    useEffect(() => {
        if (activeKey !== undefined && activeKey !== activeTabKey) {
            setActiveTabKey(activeKey)
        }
    }, [activeKey, activeTabKey])

    const handleTabClick = (key: string, disabled: boolean = false) => {
        if (disabled) {
            return
        }
        setActiveTabKey(key)
        onChange?.(key)
    }

    const tabsClassName = clsx(
        styles.tabs,
        styles[`tabs-${size}`],
        {
            [styles['tabs-animated']]: animated,
            [styles['tabs-mobile']]: mobileMode,
            [styles['tabs-centered']]: centered,
            [styles['tabs-full-width']]: fullWidth,
            [styles['tabs-bordered']]: bordered,
        },
        className
    )

    const activeTabContent = tabs.find((tab) => tab.key === activeTabKey)?.content

    return (
        <div className={tabsClassName}>
            <div className={styles['tabs-header']}>
                <div className={styles['tabs-list']}>
                    {tabs.map((tab) => {
                        const isActive = tab.key === activeTabKey
                        const tabClassName = clsx(
                            styles.tab,
                            {
                                [styles['tab-active']]: isActive,
                                [styles['tab-disabled']]: tab.disabled,
                            },
                            tab.className
                        )

                        return (
                            <div
                                key={tab.key}
                                className={tabClassName}
                                onClick={() => handleTabClick(tab.key, tab.disabled)}
                                title={tab.tooltip}
                            >
                                {tab.icon && <span className={styles['tab-icon']}>{tab.icon}</span>}
                                <span className={styles['tab-label']}>{tab.label}</span>
                                {tab.badge && <span className={styles['tab-badge']}>{tab.badge}</span>}
                                {tab.extraContent && <span className={styles['tab-extra']}>{tab.extraContent}</span>}
                            </div>
                        )
                    })}
                </div>
                {tabsExtra && <div className={styles['tabs-extra']}>{tabsExtra}</div>}
            </div>
            <div className={styles['tabs-content']}>{activeTabContent}</div>
        </div>
    )
} 