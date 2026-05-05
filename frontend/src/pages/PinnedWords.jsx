import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FlipCard from '../components/FlipCard';
import toast from 'react-hot-toast';

// ✅ This is the STUDY mode for pinned words (FlipCards, not quiz)
const PinnedWords = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pinnedWords, setPinnedWords] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/pins');
        const data = res.data.map(p => p.wordId).filter(Boolean);
        setWords(data);
        // Pre-populate the pinned set (all are already pinned)
        const ids = data.map(w => w._id);
        setPinnedWords(new Set(ids));
      } catch (err) {
        console.error('Pinned load error:', err);
        toast.error('Failed to load pinned words');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePin = async (wordId) => {
    try {
      if (pinnedWords.has(wordId)) {
        await api.delete(`/pins/${wordId}`);
        setPinnedWords(prev => { const n = new Set(prev); n.delete(wordId); return n; });
        toast.success('Word unpinned');
      } else {
        await api.post('/pins', { wordId });
        setPinnedWords(prev => new Set([...prev, wordId]));
        toast.success('Word pinned! 📌');
      }
    } catch (err) {
      console.error('Pin error:', err);
      toast.error('Failed to update pin');
    }
  };

  const handleNext = async () => {
    try {
      await api.post('/progress', {
        wordId: words[currentIndex]._id,
        correct: true,
        timeSpent: 0,
        studyMode: 'study'
      });
    } catch (err) {
      console.error('Progress save error:', err);
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const t = Math.floor((Date.now() - startTimeRef.current) / 1000);
      toast.success(`Done! ${Math.floor(t / 60)}m ${t % 60}s 🎉`);
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Loading pinned words...</div>;

  if (!words.length) {
    return (
      <div className="text-center py-12 fade-up">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📌</div>
        <h2 className="text-2xl font-bold mb-2">No Pinned Words</h2>
        <p className="text-gray-400 mb-6">Pin words while studying and they'll appear here.</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-warning">← Dashboard</button>
      </div>
    );
  }

  const pct = Math.round(((currentIndex + 1) / words.length) * 100);

  return (
    <div style={{ maxWidth: '540px', margin: 'auto' }} className="fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
            ← Back
          </button>
          <h1 className="text-2xl font-bold">📌 Pinned Words</h1>
        </div>
        <span className="text-sm text-gray-400">{currentIndex + 1} / {words.length}</span>
      </div>

      <div className="progress-bar-track mb-8">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#f59e0b' }} />
      </div>

      <FlipCard
        key={currentIndex}
        word={words[currentIndex]}
        onNext={handleNext}
        onPin={handlePin}
        isPinned={pinnedWords.has(words[currentIndex]?._id)}
      />
    </div>
  );
};

export default PinnedWords;