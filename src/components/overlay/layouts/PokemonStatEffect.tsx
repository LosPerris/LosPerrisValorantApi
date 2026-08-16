import React from 'react';

export function PokemonStatEffect({ type }: { type: 'up' | 'down' }) {
  // Arrow configuration: left position, animation delay, and scale
  const arrows = [
    { left: '15%', delay: '0s', scale: 1 },
    { left: '35%', delay: '0.3s', scale: 1.2 },
    { left: '50%', delay: '0.1s', scale: 0.9 },
    { left: '65%', delay: '0.4s', scale: 1.1 },
    { left: '85%', delay: '0.2s', scale: 0.8 },
  ];

  const isUp = type === 'up';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {arrows.map((arr, i) => (
        <div 
          key={i} 
          style={{ 
            position: 'absolute', 
            left: arr.left, 
            height: '100%', 
            transform: `scale(${arr.scale})` 
          }}
        >
          <div 
            className={`stat-chevron ${isUp ? 'stat-chevron-up' : 'stat-chevron-down'}`}
            style={{ animationDelay: arr.delay }}
          />
        </div>
      ))}
    </div>
  );
}
