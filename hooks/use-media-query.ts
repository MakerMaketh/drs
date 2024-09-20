import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Listener function that updates the state when the media query match changes
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Use addEventListener instead of addListener
    media.addEventListener('change', listener);

    // Cleanup function to remove the event listener
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
