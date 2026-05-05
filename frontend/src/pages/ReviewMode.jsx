import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuizCard from '../components/QuizCard';

// ✅ FIX: Use buildOptions pattern (same as ReviewQuiz/QuizMode)
// The old useMemo + setIndex(prev => prev+1) caused a race condition
// where options recalculated before index updated → wrong options shown
const buildOptions = (words, currentIndex) => {
  const current = words[currentIndex];
  const others = words
    .filter((_, i) => i !== currentIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [current.word, ...others.map(w => w.word)]
    .sort(() => Math.random() - 0.5);
};

const ReviewMode = () => {
  const navigate = useNavigate();

  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const startTime = useRef(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/review');
        const data = res.data.map(p => p.wordId).filter(Boolean);
        setWords(data);
        // ✅ Set options immediately together with words — no race condition
        if (data.length > 0) setOptions(buildOptions(data, 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAnswer = (isCorrect) => {
    // ✅ FIX: Track wrong words properly so they appear in review
    if (!isCorrect) setWrong(prev => [...prev, words[index]._id]);
    api.post('/progress', {
      wordId: words[index]._id,
      correct: isCorrect,
      studyMode: 'review'
    }).catch(console.error);
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < words.length) {
      // ✅ Update index AND options together — no race condition
      setIndex(nextIndex);
      setOptions(buildOptions(words, nextIndex));
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const correct = words.length - wrong.length;
    return (
      <div className="text-center fade-up">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔁</div>
        <h1 className="text-2xl font-bold mb-4">Review Complete!</h1>
        <p className="text-gray-300 mb-2">{correct} / {words.length} correct</p>
        <p className="text-gray-400 mb-6">
          Time: {Math.floor((Date.now() - startTime.current) / 1000)}s
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button className="btn btn-primary" onClick={() => {
            setIndex(0);
            setOptions(buildOptions(words, 0));
            setWrong([]);
            setFinished(false);
            startTime.current = Date.now();
          }}>🔄 Retry</button>
          <button className="btn" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center text-gray-400 py-12">Loading review words...</div>;
  if (!words.length) return <div className="text-center text-gray-400 py-12">No review words 🎉</div>;

  const pct = Math.round(((index + 1) / words.length) * 100);

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }} className="fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
            ← Back
          </button>
          <h1 className="text-2xl font-bold">🔁 Review Quiz</h1>
        </div>
        <span className="text-sm text-gray-400">{index + 1} / {words.length}</span>
      </div>

      <div className="progress-bar-track mb-8">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#ef4444' }} />
      </div>

      <QuizCard
        word={words[index]}
        options={options}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
};

export default ReviewMode;