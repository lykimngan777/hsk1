import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import blogData from '../data/blogData.json';

const BlogView = () => {
    const [activeSubTab, setActiveSubTab] = useState('characters'); // 'characters', 'grammar', 'practice'
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [lastFeedback, setLastFeedback] = useState(null);

    const handleQuizAnswer = (selectedOpt) => {
        const currentQ = blogData.practiceQuestions[currentQuizIndex];
        const isCorrect = selectedOpt === currentQ.ans;

        if (isCorrect) setQuizScore(prev => prev + 1);
        setLastFeedback(isCorrect ? "Chính xác! ✨" : `Sai rồi! Đáp án đúng là: ${currentQ.ans}`);

        setTimeout(() => {
            setLastFeedback(null);
            if (currentQuizIndex + 1 < blogData.practiceQuestions.length) {
                setCurrentQuizIndex(prev => prev + 1);
            } else {
                setIsQuizFinished(true);
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setCurrentQuizIndex(0);
        setQuizScore(0);
        setIsQuizFinished(false);
        setLastFeedback(null);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="blog-view">
            <section className="hero">
                <h2 className="hero-title">Blog <span className="highlight">Né Sai</span></h2>
                <p className="hero-subtitle">Mỗi mục bao gồm ít nhất 50 kiến thức tinh hoa giúp bạn học tiếng Trung chuẩn hơn.</p>
            </section>

            <div className="mode-tabs" style={{ marginBottom: '25px', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button className={`mode-tab ${activeSubTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveSubTab('characters')}>Chữ Hán hay nhầm ({blogData.confusedChars.length})</button>
                <button className={`mode-tab ${activeSubTab === 'grammar' ? 'active' : ''}`} onClick={() => setActiveSubTab('grammar')}>Lỗi ngữ pháp ({blogData.grammarMistakes.length})</button>
                <button className={`mode-tab ${activeSubTab === 'practice' ? 'active' : ''}`} onClick={() => setActiveSubTab('practice')}>Luyện tập né bẫy ({blogData.practiceQuestions.length})</button>
            </div>

            <div className="blog-content" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
                {activeSubTab === 'characters' && (
                    <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
                        {blogData.confusedChars.map((item, i) => (
                            <div key={i} className="dash-section glass-panel" style={{ minHeight: 'auto', marginBottom: '15px', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 className="chinese" style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: 0 }}>{item.pair}</h3>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>#{i + 1}</span>
                                </div>
                                <p style={{ color: 'var(--text-main)', marginTop: '10px', fontSize: '0.95rem' }}>{item.diff}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeSubTab === 'grammar' && (
                    <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
                        {blogData.grammarMistakes.map((item, i) => (
                            <div key={i} className="dash-section glass-panel" style={{ minHeight: 'auto', marginBottom: '15px', borderLeft: '4px solid var(--accent)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h3>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>#{i + 1}</span>
                                </div>
                                <p style={{ color: 'var(--text-dim)', marginTop: '10px', lineHeight: '1.6', fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeSubTab === 'practice' && (
                    <div className="quiz-container glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
                        {!isQuizFinished ? (
                            <div className="blog-practice-flow">
                                <div className="quiz-progress-bar" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '30px' }}>
                                    <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentQuizIndex) / blogData.practiceQuestions.length) * 100}%`, transition: 'width 0.3s' }}></div>
                                </div>

                                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Câu hỏi {currentQuizIndex + 1} / {blogData.practiceQuestions.length}</span>
                                <h3 style={{ margin: '20px 0', fontSize: '1.3rem', lineHeight: '1.5' }}>{blogData.practiceQuestions[currentQuizIndex].q}</h3>

                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                                    {blogData.practiceQuestions[currentQuizIndex].options.map(opt => (
                                        <button
                                            key={opt}
                                            className="btn-primary"
                                            style={{ padding: '12px 30px', minWidth: '120px' }}
                                            onClick={() => !lastFeedback && handleQuizAnswer(opt)}
                                            disabled={!!lastFeedback}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {lastFeedback && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ marginTop: '20px', fontWeight: 'bold', color: lastFeedback.includes('Chính xác') ? 'var(--primary)' : 'var(--accent)' }}
                                    >
                                        {lastFeedback}
                                    </motion.p>
                                )}
                            </div>
                        ) : (
                            <div className="results-panel">
                                <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                                <h2>Hoàn thành thử thách!</h2>
                                <div className="score-text" style={{ margin: '20px 0' }}>
                                    Bạn đã đúng <span>{quizScore}</span> / {blogData.practiceQuestions.length} câu.
                                </div>
                                <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>Kiến thức là sức mạnh! Hãy tiếp tục ôn tập nhé.</p>
                                <button className="btn-primary" onClick={resetQuiz} style={{ width: '200px' }}>Làm lại</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default BlogView;
