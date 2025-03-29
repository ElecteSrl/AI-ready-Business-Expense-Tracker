import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (event: KeyboardEvent) => void;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          options.onEscape?.();
          break;
        case 'Enter':
          options.onEnter?.();
          break;
        case 'ArrowUp':
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          options.onArrowRight?.();
          break;
        case 'Tab':
          options.onTab?.(event);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options]);
}