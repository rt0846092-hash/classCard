import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuizCard from '../components/QuizCard';
import toast from 'react-hot-toast';

const PinnedQuiz = () => {
  const navigate = useNavigate();
  const [pinnedWords, setPinnedWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const loadPinnedWords = async () => {
      try {
        const res = await api.get('/pins');
        const words = res.data.map(p => p.wordId).filter(Boolean);
        setPinnedWords(words);
      } catch (err) {
        console.error('Pinned load error:', err);
        toast.error('Failed to load pinned words');
      } finally {
        setLoading(false);
      }
    };
    loadPinnedWords();
  }, []);

  // ✅ Lock options per question
  const options = useMemo(() => {
    if (!pinnedWords.length || index >= pinnedWords.length) return [];
    const current = pinnedWords[index];
    const others = pinnedWords
      .filter(w => w._id !== current._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [current.word, ...others.map(w => w.word)]
      .sort(() => Math.random() - 0.5);
  }, [index, pinnedWords]);

  const handleAnswer = async (isCorrect) => {
    try {
      await api.post('/progress', {
        wordId: pinnedWords[index]._id,
        correct: isCorrect,
        studyMode: 'quiz'
      });
    } catch (err) {
      console.error('Progress error:', err);
    }
    if (!isCorrect) setWrong(prev => prev + 1);
  };

  const handleNext = () => {
    if (index < pinnedWords.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Loading pinned words...</div>;

  if (!pinnedWords.length) {
    return (
      <div className="text-center py-12 fade-up">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📌</div>
        <h2 className="text-2xl font-bold mb-2">No Pinned Words</h2>
        <p className="text-gray-400 mb-6">Pin words while studying and they'll appear here.</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-warning">← Dashboard</button>
      </div>
    );
  }

  if (finished) {
    const correct = pinnedWords.length - wrong;
    const time = Math.floor((Date.now() - startTime.current) / 1000);
    return (
      <div className="text-center fade-up">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h1 className="text-2xl font-bold mb-4">📌 Pinned Quiz Complete!</h1>
        <p className="text-gray-300 mb-2">Score: {correct} / {pinnedWords.length}</p>
        <p className="text-gray-300 mb-2">Accuracy: {Math.round((correct / pinnedWords.length) * 100)}%</p>
        <p className="text-gray-400 mb-6">Time: {time}s</p>
        <div className="flex gap-3 justify-center">
          <button className="btn btn-warning" onClick={() => {
            setIndex(0);
            setWrong(0);
            setFinished(false);
            startTime.current = Date.now();
          }}>🔄 Retry</button>
          <button className="btn" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
        </div>
      </div>
    );
  }

  const pct = Math.round(((index + 1) / pinnedWords.length) * 100);

  return (
    <div style={{ maxWidth: '540px', margin: 'auto' }} className="fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
            ← Back
          </button>
          <h1 className="text-2xl font-bold">📌 Pinned Quiz</h1>
        </div>
        {/* ✅ counter uses index directly */}
        <span className="text-sm text-gray-400">{index + 1} / {pinnedWords.length}</span>
      </div>

      <div className="progress-bar-track mb-8">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#f59e0b' }} />
      </div>

      {/* ✅ NO key={index} — useEffect inside QuizCard handles reset */}
      <QuizCard
        word={pinnedWords[index]}
        options={options}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
};

export default PinnedQuiz;