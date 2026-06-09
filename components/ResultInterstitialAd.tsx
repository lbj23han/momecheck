'use client';

import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';
import { useEffect, useRef } from 'react';

const AD_GROUP_ID = 'ait.v2.live.0e80f109fc6b4dc7';

export default function ResultInterstitialAd() {
  const shownRef = useRef(false);

  useEffect(() => {
    let showUnregister: (() => void) | undefined;
    let disposed = false;

    try {
      if (!loadFullScreenAd.isSupported() || !showFullScreenAd.isSupported()) return;
    } catch (error) {
      console.info('Toss fullscreen ad is not supported:', error);
      return;
    }

    const showAd = () => {
      if (disposed || shownRef.current) return;
      shownRef.current = true;

      showUnregister = showFullScreenAd({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === 'failedToShow') {
            console.info('Toss fullscreen ad failed to show');
          }
        },
        onError: (error) => {
          console.info('Toss fullscreen ad show error:', error);
        },
      });
    };

    const loadUnregister = loadFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          showAd();
        }
      },
      onError: (error) => {
        console.info('Toss fullscreen ad load error:', error);
      },
    });

    return () => {
      disposed = true;
      loadUnregister?.();
      showUnregister?.();
    };
  }, []);

  return null;
}
