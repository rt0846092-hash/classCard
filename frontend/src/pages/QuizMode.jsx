import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import QuizCard from '../components/QuizCard';

const buildOptions = (words, currentIndex) => {
  const current = words[currentIndex];
  const others = words
    .filter((_, i) => i !== currentIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [current.word, ...others.map(w => w.word)]
    .sort(() => Math.random() - 0.5);
};

const QuizMode = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const count = parseInt(params.get('count')) || 10;

  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const startTime = useRef(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/vocabulary?level=${level}`);
        const shuffled = [...res.data].sort(() => Math.random() - 0.5);
        const sliced = shuffled.slice(0, count);
        setWords(sliced);
        if (sliced.length > 0) setOptions(buildOptions(sliced, 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [level, count]);

  const handleAnswer = (isCorrect) => {
    if (!isCorrect) setWrong(prev => prev + 1);
    api.post('/progress', {
      wordId: words[index]._id,
      correct: isCorrect,
      studyMode: 'quiz'
    }).catch(console.error);
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < words.length) {
      // ✅ Update both together so word and options are always in sync
      setIndex(nextIndex);
      setOptions(buildOptions(words, nextIndex));
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;
  if (!words.length) return <div className="text-center text-gray-400 py-12">No words found for this level.</div>;

  if (finished) {
    const correct = words.length - wrong;
    const time = Math.floor((Date.now() - startTime.current) / 1000);
    return (
      <div className="text-center fade-up">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h1 className="text-2xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-gray-300 mb-2">Score: {correct} / {words.length}</p>
        <p className="text-gray-300 mb-2">Accuracy: {Math.round((correct / words.length) * 100)}%</p>
        <p className="text-gray-400 mb-6">Time: {time}s</p>
        <div className="flex gap-3 justify-center mt-4">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>🔄 Retry</button>
          <button className="btn" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
        </div>
      </div>
    );
  }

  const pct = Math.round(((index + 1) / words.length) * 100);

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }} className="fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
            ← Back
          </button>
          <h1 className="text-2xl font-bold">🧠 {level}</h1>
        </div>
        <span className="text-sm text-gray-400">{index + 1} / {words.length}</span>
      </div>

      <div className="progress-bar-track mb-8">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#3b82f6' }} />
      </div>

      {/* ✅ No key={index} — QuizCard resets itself when word._id changes */}
      <QuizCard
        word={words[index]}
        options={options}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
};

export default QuizMode;