'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook to manage Learn Mode state
 * Persists to both URL query params and localStorage
 */
export function useLearnMode(): {
  isLearnMode: boolean;
  toggleLearnMode: () => void;
  setLearnMode: (enabled: boolean) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const [isLearnMode, setIsLearnMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from URL or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLearn = urlParams.get('learn');
    const urlValue = urlLearn === '1' || urlLearn === 'true';
    
    if (urlValue) {
      setIsLearnMode(true);
      localStorage.setItem('learnMode', '1');
      setIsInitialized(true);
    } else {
      // Check localStorage if URL doesn't have it
      const stored = localStorage.getItem('learnMode');
      if (stored === '1') {
        setIsLearnMode(true);
        // Sync to URL
        urlParams.set('learn', '1');
        const newUrl = `${pathname}?${urlParams.toString()}`;
        router.replace(newUrl);
      } else {
        setIsLearnMode(false);
      }
      setIsInitialized(true);
    }
  }, [router, pathname]);

  const setLearnMode = (enabled: boolean) => {
    if (typeof window === 'undefined') return;
    
    setIsLearnMode(enabled);
    localStorage.setItem('learnMode', enabled ? '1' : '0');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (enabled) {
      urlParams.set('learn', '1');
    } else {
      urlParams.delete('learn');
    }
    
    const newUrl = urlParams.toString() 
      ? `${pathname}?${urlParams.toString()}`
      : pathname;
    router.replace(newUrl);
  };

  const toggleLearnMode = () => {
    setLearnMode(!isLearnMode);
  };

  return {
    isLearnMode: isInitialized ? isLearnMode : false,
    toggleLearnMode,
    setLearnMode,
  };
}
