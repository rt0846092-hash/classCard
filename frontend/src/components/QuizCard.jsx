import { useState, useEffect, useRef } from 'react';

/* ── Web Speech API ────────────────────────────────── */
const speak = (text) => {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.92;
  utt.pitch = 1.05;
  window.speechSynthesis.speak(utt);
};

/* ── Web Audio API: tonal beep ─────────────────────── */
const beep = (type = 'correct') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(195, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.38);
    }
  } catch (e) { /* silent fail */ }
};

const QuizCard = ({ word, options, onAnswer, onNext }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const answeredRef = useRef(false);
  const soundRef    = useRef(true);

  useEffect(() => { answeredRef.current = answered; }, [answered]);
  useEffect(() => { soundRef.current = soundOn; }, [soundOn]);

  // ✅ Reset when word changes
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    answeredRef.current = false;
  }, [word?._id]);

  // ✅ Keyboard — reads ref, no stale closure
  useEffect(() => {
    const handleKey = (e) => {
      if (answeredRef.current) {
        if (e.code === 'Enter' || e.code === 'ArrowRight') {
          e.preventDefault();
          onNext();
        }
        return;
      }
      const num = parseInt(e.key);
      if (num >= 1 && num <= options.length) {
        e.preventDefault();
        handleSelect(options[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [options, onNext]);

  const handleSelect = (option) => {
    if (answeredRef.current) return;
    const isCorrect = option === word.word;
    setSelected(option);
    setAnswered(true);
    answeredRef.current = true;

    if (soundRef.current) {
      beep(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) setTimeout(() => speak(word.word), 320);
    }

    onAnswer(isCorrect);
  };

  const numberSymbols = ['①', '②', '③', '④'];

  return (
    <div className="quiz-card card">

      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
        <p style={{ fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
          뜻에 맞는 영단어를 고르세요
        </p>
        <button
          onClick={() => setSoundOn(p => !p)}
          title={soundOn ? 'Sound ON' : 'Sound OFF'}
          style={{
            background: soundOn ? 'rgba(79,142,247,0.1)' : 'transparent',
            border: `1px solid ${soundOn ? 'var(--accent-blue)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: soundOn ? 'var(--accent-blue)' : 'var(--text-muted)',
            padding: '0.28rem 0.7rem',
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'var(--transition)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span>{soundOn ? '🔊' : '🔇'}</span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.05em' }}>
            {soundOn ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Meaning + speak trigger */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', marginBottom:'1.8rem' }}>
        <h2 style={{
          fontSize:'1.65rem', fontWeight:800, color:'var(--accent-yellow)',
          letterSpacing:'-0.025em', fontFamily:'var(--font-display)', lineHeight:1.2,
          textAlign:'center',
        }}>
          {word.meaning}
        </h2>
        <button
          onClick={() => speak(word.meaning)}
          title="한국어 발음 듣기"
          style={{
            background:'transparent',
            border:'1px solid var(--border)',
            borderRadius:'50%',
            width:'30px', height:'30px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'0.8rem', color:'var(--text-muted)',
            cursor:'pointer', transition:'var(--transition)', flexShrink:0,
          }}
        >
          ▶
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-6">
        {options.map((option, i) => {
          let stateClass = '';
          if (answered) {
            if (option === word.word) stateClass = ' correct';
            else if (selected === option) stateClass = ' wrong';
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`quiz-option${stateClass}`}
            >
              {/* Circle number symbol */}
              <span style={{
                fontSize: '1rem',
                marginRight: '0.7rem',
                opacity: answered ? 0.5 : 1,
                flexShrink: 0,
                color: 'var(--text-muted)',
              }}>
                {numberSymbols[i] || i + 1}
              </span>

              <span style={{ flex: 1 }}>{option}</span>

              {/* Result icon */}
              {answered && option === word.word && (
                <span style={{ fontSize:'1.2rem', marginLeft:'auto', paddingLeft:'0.5rem' }}>✔</span>
              )}
              {answered && selected === option && option !== word.word && (
                <span style={{ fontSize:'1.2rem', marginLeft:'auto', paddingLeft:'0.5rem' }}>✖</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback + next */}
      {answered && (
        <div style={{ textAlign:'center', animation:'fadeUp 0.3s ease forwards' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'0.5rem',
            padding:'0.45rem 1.1rem', borderRadius:'99px', marginBottom:'0.9rem',
            background: selected === word.word ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${selected === word.word ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
            fontSize:'0.88rem', fontWeight:600,
            color: selected === word.word ? 'var(--accent-green)' : 'var(--accent-red)',
          }}>
            {selected === word.word
              ? <> <span>✅</span> <span>정답!</span> </>
              : <> <span>❌</span> <span>정답:&nbsp;<strong style={{ fontFamily:'var(--font-display)' }}>{word.word}</strong></span> </>
            }
            <button
              onClick={() => speak(word.word)}
              title="Hear the word"
              style={{
                background:'transparent', border:'none', cursor:'pointer',
                fontSize:'0.95rem', padding:'0', color:'inherit', opacity:0.8,
              }}
            >
              🔊
            </button>
          </div>

          <button onClick={onNext} className="btn btn-primary w-full">
            다음 →
          </button>
        </div>
      )}

      {/* Keyboard hint */}
      {!answered && (
        <p style={{ textAlign:'center', fontSize:'11px', color:'var(--text-muted)', marginTop:'0.5rem', letterSpacing:'0.04em' }}>
          ① ② ③ ④ 키로 선택 &nbsp;·&nbsp; Enter 또는 → 다음
        </p>
      )}

    </div>
  );
};

export default QuizCard;