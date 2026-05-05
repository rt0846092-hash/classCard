import { useState, useEffect, useRef } from 'react';

const FlipCard = ({ word = {}, onNext, onPin, isPinned }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        triggerFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const speak = (text) => {
    if (mutedRef.current || !text) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const triggerFlip = () => {
    speak(word?.word);
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(onNext, 80);
  };

  if (!word || !word._id) {
    return (
      <div className="card text-center">
        <p className="text-gray-400 mb-4">Word not available</p>
        <button className="btn btn-primary" onClick={onNext}>Next →</button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`flip-card${isFlipped ? ' flipped' : ''}`}
        onClick={triggerFlip}
        style={{ marginBottom: '20px', cursor: 'pointer' }}
      >
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front">
            {word.level && (
              <span className="badge badge-blue" style={{ marginBottom: '16px', fontSize: '10px' }}>
                {word.level}
              </span>
            )}
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {word.word}
            </div>
            <p style={{ marginTop: '20px', fontSize: '12px', color: '#4b5563' }}>tap anywhere to reveal</p>
          </div>

          {/* Back */}
          <div className="flip-card-back">
            <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>{word.word}</div>
            <div style={{ fontSize: '20px', color: '#60a5fa', marginBottom: '16px' }}>{word.meaning}</div>
            {word.example && (
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                fontStyle: 'italic',
                borderTop: '1px solid #2d3748',
                paddingTop: '14px',
                textAlign: 'center',
                lineHeight: '1.7'
              }}>
                "{word.example}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setMuted(prev => !prev)}
          className="btn"
          style={{
            background: muted ? 'rgba(239,68,68,0.15)' : 'transparent',
            border: `1px solid ${muted ? '#ef4444' : '#374151'}`,
            color: muted ? '#f87171' : '#6b7280',
            transition: 'all 0.2s'
          }}
        >
          {muted ? '🔇 Muted' : '🔊 Sound'}
        </button>

        <button
          onClick={() => onPin(word._id)}
          className="btn"
          style={{
            background: isPinned ? 'rgba(245,158,11,0.15)' : 'transparent',
            border: `1px solid ${isPinned ? '#f59e0b' : '#374151'}`,
            color: isPinned ? '#fcd34d' : '#6b7280',
            transition: 'all 0.2s'
          }}
        >
          {isPinned ? '📌 Pinned' : '📌 Pin'}
        </button>

        <button onClick={handleNext} className="btn btn-primary">
          Next →
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#4b5563', marginTop: '12px' }}>
        Space to flip · Enter or → to next
      </p>
    </div>
  );
};

export default FlipCard;