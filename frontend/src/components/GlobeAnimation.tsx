import React from 'react';

import globeVideo from '@/assets/globe.webm';

interface GlobeAnimationProps {
  size?: number;
  className?: string;
}

export const GlobeAnimation: React.FC<GlobeAnimationProps> = ({
  size = 24,
  className = '',
}) => (
  <video
    src={globeVideo}
    autoPlay
    loop
    muted
    playsInline
    width={size}
    height={size}
    className={className}
    style={{ borderRadius: '50%' }}
  />
);
