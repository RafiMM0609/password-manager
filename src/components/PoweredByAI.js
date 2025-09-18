import React from 'react';
import './PoweredByAI.css';

const PoweredByAI = ({ 
  text = "Powered by Advanced AI",
  href = "#",
  className = "",
  showDot = true,
  dotColor = "#2ed3b7",
  textColor = "var(--text-primary)",
  backgroundColor = "var(--secondary)",
  borderGlow = true, // toggle border glow animation
  glowSpeed = "medium", // slow | medium | fast
  glowColor = "#2ed3b7" // color of the border glow
}) => {
  return (
    <div className={`powered-by-ai-container ${className}`}>
      <a 
        className={`powered-by-ai-badge ${borderGlow ? 'border-light border-light-' + glowSpeed : ''}`}
        href={href}
        style={{
          '--text-color': textColor,
          '--bg-color': backgroundColor,
          '--dot-color': dotColor,
          '--border-light-color': glowColor,
          '--border-light-size': '2px',
          '--border-radius': '24px'
        }}
      >
        <div className="stroke-effect"></div>
        
        <div className="background-fill"></div>
        
        {showDot && (
          <div className="animated-dot">
            <div className="dot-outer"></div>
            <div className="dot-inner"></div>
          </div>
        )}
        
        <div className="text-content">
          <p><span className="shimmer-text">{text}</span></p>
        </div>
      </a>
    </div>
  );
};

export default PoweredByAI;