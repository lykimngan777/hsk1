import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, Search, LayoutGrid, ChevronRight, ChevronLeft, RotateCcw, CheckCircle2, XCircle, Home, FileText, Download, Star, Volume2, MessageSquare, Send, Sparkles } from 'lucide-react';

import hskData from './data/hsk1.json';

// --- Header Component ---
const Header = ({ currentView, setView }) => (
  <header className="header glass-panel">
    <div className="logo" onClick={() => setView('home')}>
      <span className="logo-icon"><BookOpen size={20} /></span>
      <h1>HSK1 Master</h1>
    </div>
    <nav className="nav-links">
      <button className={`nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
        <Home size={18} /> <span className="nav-text">Home</span>
      </button>
      <button className={`nav-item ${currentView === 'quiz' ? 'active' : ''}`} onClick={() => setView('quiz')}>
        <CheckCircle2 size={18} /> <span className="nav-text">Quiz</span>
      </button>
      <button className={`nav-item ${currentView === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>
        <MessageSquare size={18} /> <span className="nav-text">Chat</span>
      </button>
      <button className={`nav-item ${currentView === 'file' ? 'active' : ''}`} onClick={() => setView('file')}>
        <FileText size={18} /> <span className="nav-text">Tài liệu</span>
      </button>
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

// --- Quiz Component ---
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

// --- Chat Component ---
const ChatView = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '你好！我是你的中文助手。你想聊什么？', pinyin: 'Nǐ hǎo! Wǒ shì nǐ de Zhōngwén zhùshǒu. Nǐ xiǎng liáo shénme?', translation: 'Xin chào! Tôi là trợ lý tiếng Trung của bạn. Bạn muốn nói về chủ đề gì?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

    setTimeout(() => {
      let botResponse = "";
      let feedback = "";
      let pinyin = "";
      let translation = "";


      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('你好') || lowerInput.includes('nǐ hǎo')) {
        botResponse = "你好！今天过得怎么样？";
        pinyin = "Nǐ hǎo! Jīntiān guò de zěnmeyàng?";
        translation = "Chào bạn! Hôm nay bạn thế nào?";
        feedback = "Chào rất tốt! Bạn có thể thử: '最近怎么样？' (Dạo này thế nào?)";
      } else if (lowerInput.includes('谢谢') || lowerInput.includes('xièxie')) {
        botResponse = "不客气！我很乐意帮助你。";
        pinyin = "Bú kèqi! Wǒ hěn lèyì bāngzhù nǐ.";
        translation = "Không có gì! Tôi rất vui được giúp bạn.";
        feedback = "Rất chuẩn! Trong khẩu ngữ cũng có thể nói: '没事' (méshì).";
      } else if (lowerInput.includes('再见') || lowerInput.includes('zàijiàn')) {
        botResponse = "再见！下次聊。";
        pinyin = "Zàijiàn! Xiàcì liáo.";
        translation = "Tạm biệt! Hẹn gặp lại lần sau.";
        feedback = "Tạm biệt chính xác! Người trẻ Trung Quốc hay nói '拜拜' (bàibài).";
      } else {
        botResponse = "听起来很有趣！你能多跟我说说吗？";
        pinyin = "Tīng qǐlái hěn yǒùqù! Nǐ néng duō gēn wǒ shuō shuō ma?";
        translation = "Nghe có vẻ thú vị đấy! Bạn có thể kể thêm cho tôi nghe không?";
        feedback = "Câu ổn. Hãy thử thêm các đại từ '我', '你' để tự nhiên hơn.";
      }


      const botMsg = { role: 'bot', content: botResponse, pinyin, translation, feedback };

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
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="msg-feedback">
                <Sparkles size={14} className="sparkle" /> {msg.feedback}
              </motion.div>
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Đối phương đang soạn tin...</div>}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Nhắn tin (Tiếng Trung/Pinyin)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-send" onClick={handleSend}><Send size={20} /></button>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
function App() {
  const [view, setView] = useState('home');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(null);

  const startFlashcards = (theme) => {
    setSelectedTheme(theme);
    setFlashcardIndex(0);
    setView('flashcards');
  };

  return (
    <div className="app">
      <Header currentView={view} setView={setView} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <HomeView key="home" themes={hskData} onSelectTheme={startFlashcards} />
          )}

          {view === 'file' && <FileView key="file" />}

          {view === 'chat' && <ChatView key="chat" />}

          {view === 'flashcards' && selectedTheme && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="view-header">
                <button className="btn-back" onClick={() => setView('home')}><ChevronLeft size={18} /> Home</button>
                <h2>{selectedTheme.theme.split('. ')[1]}</h2>
              </div>
              <Flashcard
                word={selectedTheme.words[flashcardIndex]}
                isFirst={flashcardIndex === 0}
                isLast={flashcardIndex === selectedTheme.words.length - 1}
                onNext={() => setFlashcardIndex(flashcardIndex + 1)}
                onPrev={() => setFlashcardIndex(flashcardIndex - 1)}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <button className="btn-secondary" onClick={() => setView('quiz')} style={{ gap: '8px' }}>
                  <CheckCircle2 size={18} /> Làm Quiz chủ đề này
                </button>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && (
            <div key="quiz">
              {quizScore === null ? (
                <>
                  <div className="view-header">
                    <button className="btn-back" onClick={() => setView('home')}><ChevronLeft size={18} /> Home</button>
                    <h2>Quiz: {selectedTheme?.theme?.split('. ')[1] || 'Tổng hợp'}</h2>
                  </div>
                  <QuizView
                    words={selectedTheme?.words || hskData[0].words}
                    onFinish={(score) => setQuizScore(score)}
                  />
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="results-panel glass-panel"
                >
                  <Star className="star-icon" size={48} />
                  <h2>Tuyệt vời!</h2>
                  <p className="score-text">Bạn đạt <span>{quizScore}</span> / {selectedTheme?.words.length} câu</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => setQuizScore(null)}><RotateCcw size={16} /> Thử lại</button>
                    <button className="btn-secondary" onClick={() => setView('home')}><Home size={16} /> Về Home</button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <p>HSK1 Master - Thú zị lên! ✨</p>
      </footer>
    </div>
  );
}

export default App;
