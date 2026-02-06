import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, Search, LayoutGrid, ChevronRight, ChevronLeft, RotateCcw, CheckCircle2, XCircle, Home, FileText, Download, Star, Volume2, MessageSquare, Send, Sparkles, BarChart3, History, Plus, BookMarked, Languages } from 'lucide-react';

import hskData from './data/hsk1.json';
import lessonsData from './data/lessons.json';
import BlogView from './components/BlogView';

// --- Header Component ---
const Header = ({ currentView, setView, totalPoints }) => (
  <header className="header glass-panel">
    <div className="logo" onClick={() => setView('home')}>
      <span className="logo-icon"><BookOpen size={20} /></span>
      <h1>HSK1 Master</h1>
    </div>
    <nav className="nav-links">
      <button className={`nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
        <Home size={18} /> <span className="nav-text">Home</span>
      </button>
      <button className={`nav-item ${currentView === 'practice' ? 'active' : ''}`} onClick={() => setView('practice')}>
        <Brain size={18} /> <span className="nav-text">Luyện tập</span>
      </button>
      <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
        <BarChart3 size={18} /> <span className="nav-text">Thống kê</span>
      </button>
      <button className={`nav-item ${currentView === 'blog' ? 'active' : ''}`} onClick={() => setView('blog')}>
        <MessageSquare size={18} /> <span className="nav-text">Blog né sai</span>
      </button>
      <button className={`nav-item ${currentView === 'file' ? 'active' : ''}`} onClick={() => setView('file')}>
        <FileText size={18} /> <span className="nav-text">Tài liệu</span>
      </button>
      <div className="points-display nav-item" style={{ cursor: 'default', color: 'var(--accent)', fontWeight: '800', border: '1px solid rgba(244, 114, 182, 0.2)', padding: '8px 12px', background: 'rgba(244, 114, 182, 0.05)' }}>
        <Star size={16} fill="var(--accent)" /> {totalPoints}
      </div>
    </nav>
  </header>
);

// --- Home View ---
const HomeView = ({ themes, onSelectTheme }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="view-container"
  >
    <section className="hero">
      <motion.h2
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="hero-title"
      >
        Làm chủ HSK1 theo cách <span className="highlight">thú vị nhất</span>
      </motion.h2>
      <p className="hero-subtitle">Chọn một chủ đề để bắt đầu học nhé!</p>
    </section>

    <div className="theme-grid">
      {themes.map((theme, idx) => (
        <motion.div
          key={idx}
          whileTap={{ scale: 0.96 }}
          className="theme-card glass-panel"
          onClick={() => onSelectTheme(theme)}
        >
          <div className="theme-icon">
            <LayoutGrid size={24} />
          </div>
          <div className="theme-info">
            <h3>{theme.theme.split('. ')[1] || theme.theme}</h3>
            <p>{theme.words.length} từ vựng</p>
          </div>
          <ChevronRight className="arrow" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- File View ---
const FileView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="file-view-container"
  >
    <div className="view-header">
      <h2>Tài liệu gốc (PDF)</h2>
      <a href="/Tong_hop_HSK1.pdf" download className="btn-secondary" style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: '0.8rem' }}>
        <Download size={14} style={{ marginRight: '6px' }} /> Tải về
      </a>
    </div>
    <iframe
      src="/Tong_hop_HSK1.pdf"
      className="pdf-viewer glass-panel"
      title="HSK1 Original Document"
    />
  </motion.div>
);

// --- Flashcard Component ---
const Flashcard = ({ word, onNext, onPrev, isFirst, isLast }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  const speak = (e) => {
    if (e) e.stopPropagation();
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.hanzi);

    // Find a Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.includes('zh-CN')) ||
      voices.find(v => v.lang.includes('zh')) ||
      voices[0];

    if (zhVoice) utterance.voice = zhVoice;
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="card-face card-front glass-panel">
          <span className="card-label">Hanzi</span>
          <button className="btn-audio-mini" onClick={speak}>
            <Volume2 size={24} />
          </button>
          <h2 className="chinese text-huge">{word.hanzi}</h2>
          <p className="hint">Chạm để xem nghĩa</p>
        </div>
        <div className="card-face card-back glass-panel">
          <div className="card-back-content">
            <button className="btn-audio-mini" onClick={speak}>
              <Volume2 size={24} />
            </button>
            <div className="info-group">
              <span className="card-label">Pinyin</span>
              <p className="pinyin text-large">{word.pinyin}</p>
            </div>
            <div className="info-group" style={{ marginTop: '15px' }}>
              <span className="card-label">Nghĩa</span>
              <p className="meaning text-large">{word.meaning}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>({word.hanviet})</p>
            </div>
            {word.example && (
              <p className="example text-italic">"{word.example}"</p>
            )}
          </div>
          <p className="hint">Chạm để quay lại</p>
        </div>
      </div>

      <div className="card-controls">
        <button disabled={isFirst} onClick={(e) => { e.stopPropagation(); onPrev(); }} className="btn-secondary">
          <ChevronLeft size={18} />
        </button>
        <button onClick={speak} className="btn-primary" style={{ padding: '12px' }}>
          <Volume2 size={22} />
        </button>
        <button disabled={isLast} onClick={(e) => { e.stopPropagation(); onNext(); }} className="btn-primary">
          Tiếp theo <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Quiz View ---
const QuizView = ({ words, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    generateOptions();
  }, [currentIndex]);

  const generateOptions = () => {
    const currentWord = words[currentIndex];
    let otherOptions = [...words]
      .filter(w => w.hanzi !== currentWord.hanzi)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [...otherOptions, currentWord].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleSelect = (word) => {
    if (isAnswered) return;
    setSelectedOption(word);
    setIsAnswered(true);

    // Auto-play pronunciation
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(words[currentIndex].hanzi);
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.includes('zh-CN')) ||
        voices.find(v => v.lang.includes('zh'));
      if (zhVoice) utterance.voice = zhVoice;
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }

    if (word.hanzi === words[currentIndex].hanzi) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(score);
    }
  };

  const currentWord = words[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="quiz-container glass-panel"
    >
      <div className="quiz-header">
        <span>Câu {currentIndex + 1} / {words.length}</span>
        <span>Điểm: {score}</span>
      </div>

      <div className="quiz-question">
        <h3>"{currentWord.meaning}" là:</h3>
        {isAnswered && <p className="pinyin-hint">{currentWord.pinyin}</p>}
      </div>

      <div className="quiz-options">
        {options.map((opt, idx) => {
          let statusClass = '';
          if (isAnswered) {
            if (opt.hanzi === currentWord.hanzi) statusClass = 'correct';
            else if (selectedOption.hanzi === opt.hanzi) statusClass = 'wrong';
          }

          return (
            <button
              key={idx}
              className={`quiz-opt ${statusClass} ${selectedOption?.hanzi === opt.hanzi ? 'selected' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              <span className="chinese" style={{ fontSize: '1.4rem' }}>{opt.hanzi}</span>
              {isAnswered && (
                opt.hanzi === currentWord.hanzi ? <CheckCircle2 size={18} /> :
                  (selectedOption.hanzi === opt.hanzi ? <XCircle size={18} /> : null)
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button className="btn-primary" onClick={handleNext} style={{ width: '100%' }}>
          {currentIndex + 1 === words.length ? 'Xem kết quả' : 'Câu tiếp theo'}
        </button>
      )}
    </motion.div>
  );
};

// --- Chat View ---
const ChatView = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '你好！我是 your 中文助手. Bạn muốn luyện tập gì hôm nay?', pinyin: 'Nǐ hǎo! Wǒ shì nǐ de Zhōngwén zhùshǒu. Nǐ xiǎng liànxí shénme jīntiān?', translation: 'Xin chào! Tôi là trợ lý tiếng Trung của bạn. Hôm nay bạn muốn luyện tập gì?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRiddleMode, setIsRiddleMode] = useState(false);
  const [currentRiddle, setCurrentRiddle] = useState(null);

  const startRiddle = () => {
    setIsRiddleMode(true);
    const allWords = hskData.flatMap(t => t.words);
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];

    let riddleText = `Đây là một từ vựng trong chủ đề "${hskData.find(t => t.words.includes(randomWord)).theme.split('. ')[1]}".\nNó có nghĩa là: "${randomWord.meaning}".`;
    if (randomWord.example) {
      riddleText += `\nVí dụ sử dụng: "${randomWord.example.split(' (')[0]}".`;
    }
    riddleText += `\nBạn hãy viết từ này bằng tiếng Trung (hoặc Pinyin) nhé!`;

    setCurrentRiddle(randomWord);
    const botMsg = {
      role: 'bot',
      content: riddleText,
      translation: 'Hãy đoán xem đây là từ gì?'
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.includes('zh-CN')) ||
      voices.find(v => v.lang.includes('zh'));
    if (zhVoice) utterance.voice = zhVoice;
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (isRiddleMode && currentRiddle) {
      setTimeout(() => {
        const isCorrect = input.trim().toLowerCase() === currentRiddle.hanzi.toLowerCase() ||
          input.trim().toLowerCase() === currentRiddle.pinyin.toLowerCase().replace(/\s/g, '');

        let botResponse = "";
        let feedback = "";

        if (isCorrect) {
          botResponse = `太棒了! Đúng rồi, đó chính là "${currentRiddle.hanzi}".`;
          feedback = `Bạn giỏi lắm! ${currentRiddle.hanviet ? `Hán Việt: ${currentRiddle.hanviet}.` : ''}`;
        } else {
          botResponse = `Không đúng rồi! Đáp án là "${currentRiddle.hanzi}" (${currentRiddle.pinyin}).`;
          feedback = `Đừng buồn, luyện tập thêm nhé!`;
        }

        const botMsg = {
          role: 'bot',
          content: botResponse,
          feedback,
          translation: isCorrect ? 'Tuyệt vời! Bạn đã trả lời đúng.' : 'Tiếc quá, hãy thử lại nhé.'
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        setIsRiddleMode(false);
        setCurrentRiddle(null);
        speak(botResponse);
      }, 1000);
      return;
    }

    setTimeout(() => {
      let botResponse = "聽起來很有趣！你能多跟我说说吗？";
      let pinyin = "Tīng qǐlái hěn yǒùqù! Nǐ néng duō gēn wǒ shuō shuō ma?";
      let translation = "Nghe có vẻ thú vị đấy! Bạn có thể kể thêm cho tôi nghe không?";

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('你好')) {
        botResponse = "你好！今天过得怎么样？";
        pinyin = "Nǐ hǎo! Jīntiān guò de zěnmeyàng?";
        translation = "Chào bạn! Hôm nay bạn thế nào?";
      }

      const botMsg = { role: 'bot', content: botResponse, pinyin, translation };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      speak(botResponse);
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-container glass-panel">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className={`message-bubble ${msg.role}`}>
              <p className={msg.role === 'bot' ? 'chinese' : ''}>{msg.content}</p>
              {msg.pinyin && <p className="msg-pinyin">{msg.pinyin}</p>}
              {msg.translation && <p className="msg-translation">{msg.translation}</p>}
              {msg.role === 'bot' && (
                <button className="msg-audio" onClick={() => speak(msg.content)}>
                  <Volume2 size={14} />
                </button>
              )}
            </div>
            {msg.feedback && (
              <div className="msg-feedback"><Sparkles size={14} /> {msg.feedback}</div>
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Đang soạn tin...</div>}
      </div>
      <div className="chat-input-area">
        <button className={`btn-mode ${isRiddleMode ? 'active' : ''}`} onClick={startRiddle}>
          <Brain size={16} /> Đố vui
        </button>
        <input
          type="text"
          placeholder="Nhắn tin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-send" onClick={handleSend}><Send size={20} /></button>
      </div>
    </motion.div>
  );
};

// --- Dashboard View ---
const DashboardView = ({ stats, mistakes, onAddMistakeToFlashcards }) => {
  const correctCount = stats.correct || 0;
  const totalCount = stats.total || 0;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard">
      <section className="hero">
        <h2 className="hero-title">Tiến trình <span className="highlight">của bạn</span></h2>
        <p className="hero-subtitle">Theo dõi kết quả luyện tập và cải thiện điểm yếu.</p>
      </section>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <span className="stat-val">{stats.totalPoints || 0}</span>
          <span className="stat-label">Tổng Điểm</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-val">{accuracy}%</span>
          <span className="stat-label">Độ chính xác</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-val">{totalCount}</span>
          <span className="stat-label">Câu đã làm</span>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dash-section glass-panel">
          <h3><Star size={20} color="var(--primary)" /> Điểm mạnh</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            Bạn đang làm rất tốt ở các từ vựng chủ đề gia đình và số đếm.
          </p>
        </div>

        <div className="dash-section glass-panel">
          <h3><History size={20} color="var(--accent)" /> Chỗ hay sai ({mistakes.length})</h3>
          <div className="mistake-list">
            {mistakes.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginTop: '40px' }}>Chưa có bài sai nào. Cố gắng phát huy nhé!</p>
            ) : (
              mistakes.slice(-5).reverse().map((m, i) => (
                <div key={i} className="mistake-item">
                  <div className="mistake-info">
                    <span className="mistake-hanzi chinese">{m.hanzi}</span>
                    <span className="mistake-pinyin">{m.pinyin}</span>
                  </div>
                  <button className="btn-mini-action" onClick={() => onAddMistakeToFlashcards(m)}>
                    <Plus size={14} /> Flashcard
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Practice View ---
const PracticeView = ({ onUpdateStats, onSaveMistake }) => {
  const [practiceType, setPracticeType] = useState(null); // 'vocabulary' or 'lesson'
  const [selectionPhase, setSelectionPhase] = useState(true);
  const [mode, setMode] = useState('pinyin'); // 'pinyin' or 'vietnamese'
  const [practiceData, setPracticeData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [revealedInfo, setRevealedInfo] = useState(false);

  const startPractice = (type, specificLesson = null) => {
    setPracticeType(type);
    setSelectionPhase(false);

    if (type === 'vocabulary') {
      const allWords = hskData.flatMap(t => t.words);
      const selected = allWords.sort(() => 0.5 - Math.random()).slice(0, 10);
      setPracticeData(selected);
    } else {
      if (specificLesson === 'random') {
        const random = lessonsData[Math.floor(Math.random() * lessonsData.length)];
        setPracticeData([random]);
      } else if (specificLesson) {
        setPracticeData([specificLesson]);
      } else {
        setPracticeData(lessonsData);
      }
    }
    setCurrentIndex(0);
    setUserInput('');
    setFeedback(null);
    setScore(0);
    setSessionPoints(0);
    setIsFinished(false);
    setRevealedInfo(false);
  };

  const handleCheck = () => {
    if (!userInput.trim()) return;
    setIsGrading(true);
    const currentItem = practiceData[currentIndex];

    // Simulate AI Grading delay
    setTimeout(() => {
      const normalizedInput = userInput.trim().replace(/\s/g, '');
      const targetHanzi = currentItem.hanzi.replace(/\s/g, '');

      let isCorrect = normalizedInput === targetHanzi;
      let gradingFeedback = "";
      let gradingScore = 0;
      let aiComment = null;

      if (practiceType === 'vocabulary') {
        if (mode === 'pinyin') {
          gradingFeedback = isCorrect ? "Rất chính xác!" : `Chưa đúng. Hãy xem đáp án bên dưới.`;
          gradingScore = isCorrect ? 100 : 0;
        } else {
          if (isCorrect) {
            gradingScore = 100;
            gradingFeedback = "Hoàn hảo! Bạn viết đúng rồi.";
            aiComment = {
              text: "Cách dùng từ rất tự nhiên. Bạn đã nắm vững chữ Hán này!",
              suggestion: "Thử đặt câu với từ này để nhớ lâu hơn."
            };
          } else if (currentItem.hanzi.includes(userInput.trim()) || userInput.trim().includes(currentItem.hanzi)) {
            isCorrect = true;
            gradingScore = 80;
            gradingFeedback = "Gần đúng! Bạn đang đi đúng hướng.";
            aiComment = {
              text: "Bạn đã nhớ được bộ thủ chính, chỉ cần cẩn thận hơn một chút ở nét vẽ.",
              suggestion: "Chú ý thứ tự các nét để chữ viết cân đối hơn."
            };
          } else {
            gradingScore = 0;
            gradingFeedback = `Chưa đúng rồi. Hãy luyện tập thêm nhé.`;
            aiComment = {
              text: "Có vẻ bạn đang nhầm lẫn với một từ khác có âm tương tự.",
              suggestion: "Gợi ý: Từ này có bộ nhân đứng ở bên trái."
            };
          }
        }
      } else {
        // Lesson grading logic (paragraph)
        if (isCorrect) {
          gradingScore = 100;
          gradingFeedback = "Tuyệt vời! Bạn đã gõ chính xác toàn bộ đoạn văn.";
          aiComment = {
            text: "Kỹ năng gõ và nhận diện mặt chữ của bạn rất xuất sắc.",
            suggestion: "Hãy thử tập đọc to đoạn văn này để luyện ngữ điệu."
          };
        } else {
          const similarity = calculateSimilarity(normalizedInput, targetHanzi);
          if (similarity > 0.8) {
            isCorrect = true;
            gradingScore = 90;
            gradingFeedback = "Rất tốt! Bạn chỉ sai một vài chỗ nhỏ thôi.";
            aiComment = {
              text: "Gần như hoàn hảo. Các cấu trúc ngữ pháp bạn dùng đều ổn.",
              suggestion: "Lưu ý các dấu câu và khoảng cách nếu có."
            };
          } else if (similarity > 0.5) {
            isCorrect = true;
            gradingScore = 60;
            gradingFeedback = "Khá tốt! Bạn đã nắm được phần lớn đoạn văn.";
            aiComment = {
              text: "Nội dung cơ bản đã đủ, nhưng còn thiếu một vài chi tiết bổ trợ.",
              suggestion: "Xem lại phần tân ngữ trong câu để diễn đạt mượt mà hơn."
            };
          } else {
            isCorrect = false;
            gradingScore = 20;
            gradingFeedback = "Cố gắng lên! Có vẻ bạn cần ôn tập kỹ hơn đoạn này.";
            aiComment = {
              text: "Đoạn văn này có nhiều từ vựng mới, đừng quá lo lắng.",
              suggestion: "Gợi ý: Hãy chia nhỏ đoạn văn ra để luyện từng câu một."
            };
          }
        }
      }

      const finalFeedback = {
        isCorrect,
        text: gradingFeedback,
        score: gradingScore,
        original: currentItem.hanzi,
        pinyin: currentItem.pinyin,
        meaning: currentItem.meaning,
        aiComment
      };

      setFeedback(finalFeedback);
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        onSaveMistake(currentItem);
      }
      setIsGrading(false);
    }, 1000);
  };

  const calculateSimilarity = (s1, s2) => {
    let matches = 0;
    const len = Math.min(s1.length, s2.length);
    for (let i = 0; i < len; i++) {
      if (s1[i] === s2[i]) matches++;
    }
    return matches / Math.max(s1.length, s2.length);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.includes('zh-CN')) || voices.find(v => v.lang.includes('zh'));
    if (zhVoice) utterance.voice = zhVoice;
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex + 1 < practiceData.length) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setFeedback(null);
      setRevealedInfo(false);
    } else {
      // Calculate final points: Accuracy % as points, min 10%
      const accuracy = (score / practiceData.length) * 100;
      const pointsToAdd = accuracy >= 10 ? Math.round(accuracy) : 0;

      onUpdateStats(pointsToAdd, score, practiceData.length);
      setSessionPoints(pointsToAdd); // Use this to show final points in result
      setIsFinished(true);
    }
  };

  if (selectionPhase) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="practice-selection">
        <h2 className="selection-title">Bạn muốn luyện tập gì?</h2>
        <div className="selection-grid">
          <motion.div whileHover={{ scale: 1.02 }} className="selection-card glass-panel" onClick={() => startPractice('vocabulary')}>
            <div className="sel-icon vocab"><BookOpen size={32} /></div>
            <h3>Từ vựng ngẫu nhiên</h3>
            <p>Luyện 10 từ vựng HSK1 ngẫu nhiên từ thư viện.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="selection-card glass-panel">
            <div className="sel-icon lesson"><Brain size={32} /></div>
            <h3>Luyện Bài khóa</h3>
            <p>Luyện gõ các đoạn văn ngắn từ bài học.</p>
            <div className="lesson-sub-menu">
              <button className="btn-mini-choice" onClick={() => startPractice('lesson', 'random')}>Ngẫu nhiên 1 bài</button>
              <div className="lesson-list-scroll">
                {lessonsData.map(l => (
                  <button key={l.id} className="lesson-item-btn" onClick={() => startPractice('lesson', l)}>
                    {l.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-panel glass-panel">
        <Sparkles size={48} className="sparkle" />
        <h2>Hoàn thành!</h2>
        <div className="score-text">
          {practiceType === 'vocabulary' ? (
            <>Bạn đúng <span>{score}</span> / {practiceData.length}</>
          ) : (
            <>Bạn đã luyện xong bài khóa!</>
          )}
          <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>Kết quả: <span style={{ color: 'var(--accent)' }}>{Math.round(sessionPoints / practiceData.length)} / 100</span></p>
        </div>
        <button className="btn-primary" onClick={() => setSelectionPhase(true)} style={{ marginTop: '20px', width: '100%' }}>
          Quay lại chọn chế độ
        </button>
      </motion.div>
    );
  }

  const currentItem = practiceData[currentIndex];
  if (!currentItem) return <div className="loading">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="practice-view">
      <div className="practice-header-nav glass-panel">
        <button className="btn-back-selection" onClick={() => setSelectionPhase(true)}>
          <ChevronLeft size={16} /> Thoát
        </button>
        <div className="mode-tabs">
          <button className={`mode-tab ${mode === 'pinyin' ? 'active' : ''}`} onClick={() => { setMode('pinyin'); setFeedback(null); }}>Pinyin Mode</button>
          <button className={`mode-tab ${mode === 'vietnamese' ? 'active' : ''}`} onClick={() => { setMode('vietnamese'); setFeedback(null); }}>Vietnamese Mode</button>
        </div>
        <div className="header-stats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div className="counter">Câu {currentIndex + 1} / {practiceData.length}</div>
          <div className="points-badge" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            Đúng: {score} ({Math.round((score / practiceData.length) * 100) || 0}%)
          </div>
        </div>
      </div>

      <div className={`practice-card-main glass-panel ${practiceType === 'lesson' ? 'wide' : ''}`}>
        <div className="q-section">
          <span className="q-label">{mode === 'pinyin' ? 'Gõ chữ Hán cho Pinyin:' : 'Gõ chữ Hán cho nghĩa:'}</span>
          <h2 className={`q-text ${practiceType === 'lesson' ? 'lesson-text' : 'chinese'}`}>
            {mode === 'pinyin' ? currentItem.pinyin : currentItem.meaning}
          </h2>
          {practiceType === 'vocabulary' && mode === 'pinyin' && <p className="q-sub">({currentItem.meaning})</p>}
        </div>

        <div className="i-section">
          {practiceType === 'lesson' ? (
            <textarea
              className="big-chinese-input lesson-textarea chinese"
              placeholder="Gõ toàn bộ đoạn văn vào đây..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={!!feedback || isGrading}
              autoFocus
            />
          ) : (
            <input
              type="text"
              className="big-chinese-input chinese"
              placeholder="Gõ chữ Hán..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !feedback && !isGrading && handleCheck()}
              disabled={!!feedback || isGrading}
              autoFocus
            />
          )}

          <div className="i-actions">
            {!feedback ? (
              <button className="btn-primary" onClick={handleCheck} disabled={!userInput.trim() || isGrading} style={{ width: '100%' }}>
                {isGrading ? <RotateCcw size={18} className="spin" /> : 'Kiểm tra'}
              </button>
            ) : (
              <button className="btn-primary" onClick={handleNext} style={{ width: '100%' }}>
                {currentIndex + 1 === practiceData.length ? 'Xong' : 'Tiếp theo'} <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`feedback-box ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
              <div className="fb-top">
                <div className="fb-icon">{feedback.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}</div>
                <div className="fb-info">
                  <span className="fb-status">{feedback.isCorrect ? 'Tốt!' : 'Cần cố gắng'}</span>
                  <p className="fb-detail">{feedback.text}</p>
                </div>
                <div className="fb-score">+{feedback.score}</div>
              </div>
              <div className="fb-answer">
                <div className="ans-tag">Đáp án chuẩn:</div>
                <div className="ans-val chinese">{feedback.original}</div>
                <button className="btn-audio-mini" onClick={() => speak(feedback.original)}><Volume2 size={16} /></button>

                {mode === 'pinyin' && (
                  <>
                    {!revealedInfo ? (
                      <button className="btn-mini-action" onClick={() => setRevealedInfo(true)}>
                        <Languages size={14} /> Dịch tiếng Việt
                      </button>
                    ) : (
                      <div className="ans-revealed">Nghĩa: {feedback.meaning}</div>
                    )}
                  </>
                )}

                {mode === 'vietnamese' && (
                  <>
                    {!revealedInfo ? (
                      <button className="btn-mini-action" onClick={() => setRevealedInfo(true)}>
                        <Volume2 size={14} /> Hiện Pinyin
                      </button>
                    ) : (
                      <div className="ans-revealed">Pinyin: {feedback.pinyin}</div>
                    )}
                  </>
                )}

                <button className="btn-mini-action" onClick={() => onSaveMistake({ ...practiceData[currentIndex], forceFlash: true })}>
                  <Plus size={14} /> Thêm vào Flashcard
                </button>
              </div>

              {mode === 'vietnamese' && feedback.aiComment && (
                <div className="ai-comment-box">
                  <div className="ai-comment-title"><Sparkles size={12} /> AI Nhận xét</div>
                  <div className="ai-comment-text">{feedback.aiComment.text}</div>
                  <div className="suggest-tag">Gợi ý: {feedback.aiComment.suggestion}</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- App Component ---
function App() {
  const [view, setView] = useState('home');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(null);

  // Stats and Mistakes state
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('hsk_stats');
    return saved ? JSON.parse(saved) : { total: 0, correct: 0, totalPoints: 0 };
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('hsk_mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  const updateStats = (points, sessionCorrect, sessionTotal) => {
    const newStats = {
      total: stats.total + sessionTotal,
      correct: stats.correct + sessionCorrect,
      totalPoints: stats.totalPoints + points
    };
    setStats(newStats);
    localStorage.setItem('hsk_stats', JSON.stringify(newStats));
  };

  const saveMistake = (word) => {
    // Avoid duplicates
    if (mistakes.some(m => m.hanzi === word.hanzi) && !word.forceFlash) return;

    const newMistakes = [...mistakes, word];
    setMistakes(newMistakes);
    localStorage.setItem('hsk_mistakes', JSON.stringify(newMistakes));

    if (word.forceFlash) {
      alert("Đã thêm vào Flashcard ôn tập!");
    }
  };

  const addMistakeToFlashcards = (word) => {
    // This could open a specialized themed session, for now just show alert
    alert(`Từ "${word.hanzi}" đã sẵn sàng để ôn tập trong Flashcards!`);
  };

  const startFlashcards = (theme) => {
    setSelectedTheme(theme);
    setFlashcardIndex(0);
    setView('flashcards');
  };

  return (
    <div className="app">
      <Header currentView={view} setView={setView} totalPoints={stats.totalPoints} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView themes={hskData} onSelectTheme={startFlashcards} />}
          {view === 'flashcards' && selectedTheme && (
            <Flashcard
              word={selectedTheme.words[flashcardIndex]}
              onNext={() => setFlashcardIndex(prev => prev + 1)}
              onPrev={() => setFlashcardIndex(prev => prev - 1)}
              isFirst={flashcardIndex === 0}
              isLast={flashcardIndex === selectedTheme.words.length - 1}
            />
          )}
          {view === 'quiz' && (
            <QuizView
              words={hskData.flatMap(t => t.words).sort(() => 0.5 - Math.random()).slice(0, 10)}
              onFinish={score => { setQuizScore(score); setView('results'); }}
            />
          )}
          {view === 'results' && (
            <div className="results-panel glass-panel">
              <CheckCircle2 size={48} color="var(--primary)" />
              <h2>Hoàn thành!</h2>
              <div className="score-text">Điểm: <span>{quizScore}</span> / 10</div>
              <button className="btn-primary" onClick={() => setView('home')}>Home</button>
            </div>
          )}
          {view === 'chat' && <ChatView />}
          {view === 'practice' && <PracticeView onUpdateStats={updateStats} onSaveMistake={saveMistake} />}
          {view === 'dashboard' && <DashboardView stats={stats} mistakes={mistakes} onAddMistakeToFlashcards={addMistakeToFlashcards} />}
          {view === 'blog' && <BlogView />}
          {view === 'file' && <FileView />}
        </AnimatePresence>
      </main>
      <footer className="footer"><p>HSK1 Master © 2024</p></footer>
    </div>
  );
}

export default App;
