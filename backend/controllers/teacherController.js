import User from '../models/User.js';
import Progress from '../models/Progress.js';

// ✅ GET ALL STUDENTS FOR TEACHER
export const getStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const students = await User.find({
      teacherId,
      role: 'student'
    }).select('-password');

    res.json(students);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET SINGLE STUDENT DETAILS
export const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params; // ✅ FIXED

    const student = await User.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const progress = await Progress.find({ userId: studentId })
      .populate('wordId', 'word meaning');

    // ✅ CALCULATE STATS
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const correctCount = progress.reduce((sum, p) => sum + p.correctCount, 0);
    const wrongCount = progress.reduce((sum, p) => sum + p.wrongCount, 0);
    const totalTime = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    const accuracy = (correctCount + wrongCount) > 0
      ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
      : 0;

    // ✅ WEAK WORDS
    const weakWords = progress
      .filter(p => p.wrongCount > p.correctCount)
      .map(p => ({
        word: p.wordId?.word,
        meaning: p.wordId?.meaning,
        wrongCount: p.wrongCount
      }));

    res.json({
      student,
      progress: {
        totalAttempts,
        correctCount,
        wrongCount,
        totalTime,
        accuracy,
        weakWords
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};