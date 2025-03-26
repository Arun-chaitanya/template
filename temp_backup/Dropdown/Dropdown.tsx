'use client';

import clsx from 'clsx';

import { useEffect, useRef, useState } from 'react';

import styles from './Dropdown.module.scss';

interface DropdownOption {
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  buttonClassName?: string;
}

export function Dropdown({ label, options, buttonClassName }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button className={clsx(styles.button, buttonClassName)} onClick={() => setIsOpen(!isOpen)}>
        {label}
        <svg
          className={clsx(styles.arrow, isOpen && styles.open)}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className={styles.menu}>
          {options.map((option) => (
            <li key={option.value}>
              {option.href ? (
                <a href={option.href} onClick={() => setIsOpen(false)}>
                  {option.label}
                </a>
              ) : (
                <button
                  onClick={() => {
                    option.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
