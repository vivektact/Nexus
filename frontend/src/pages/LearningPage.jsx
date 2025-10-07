import React, { useState, useEffect, useMemo } from 'react';

const LearningPage = () => {
    const [fullWordList, setFullWordList] = useState([]);
    const [dailyWords, setDailyWords] = useState([]);
    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    // New states: 'score' for the summary and 'review' for the detailed breakdown
    const [quizState, setQuizState] = useState('intro'); // 'intro', 'active', 'score', 'review'
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [isVideosLoading, setIsVideosLoading] = useState(true);
    const [videoError, setVideoError] = useState(null);

    const wordOfTheDay = useMemo(() => dailyWords[0], [dailyWords]);
    const top5Vocab = useMemo(() => dailyWords.slice(1), [dailyWords]);

    useEffect(() => {
        const fetchAndProcessWords = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const wordListResponse = await fetch('https://api.datamuse.com/words?ml=knowledge&max=50');
                if (!wordListResponse.ok) throw new Error('Failed to fetch the word list from Datamuse.');
                const words = await wordListResponse.json();
                const wordStrings = words.map(w => w.word);

                const definitionPromises = wordStrings.map(word =>
                    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                        .then(res => {
                            if (!res.ok) {
                                if (res.status === 404) return { title: "No Definitions Found" };
                                throw new Error(`Failed to fetch definition for ${word} (Status: ${res.status})`);
                            }
                            return res.json();
                        })
                        .catch(err => {
                            console.warn(`Error fetching definition for ${word}:`, err.message);
                            return null;
                        })
                );

                const results = await Promise.all(definitionPromises);

                const formattedWords = results
                    .filter(result => result && !result.title)
                    .map(result => {
                        const wordData = result[0];
                        const meaning = wordData.meanings && wordData.meanings[0];
                        const definition = meaning?.definitions && meaning.definitions[0];

                        if (!definition || !definition.definition) return null;

                        return {
                            word: wordData.word,
                            partOfSpeech: meaning.partOfSpeech,
                            definition: definition.definition,
                            example: definition.example || "No example available."
                        };
                    })
                    .filter(Boolean);

                if (formattedWords.length < 6) {
                    throw new Error("Not enough valid words could be fetched for the page and quiz.");
                }

                setFullWordList(formattedWords);
                setDailyWords(formattedWords.slice(0, 6));

            } catch (err) {
                console.error("Error fetching vocabulary:", err);
                setError(`Could not load words: ${err.message}. Please try again later.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessWords();
    }, []);

    useEffect(() => {
        setYoutubeVideos([
            {
                title: "Advanced English Vocabulary Lesson",
                url: "https://www.youtube.com/watch?v=mgty3Bgu-YY",
            },
        ]);
        setIsVideosLoading(false);
        setVideoError(null);
    }, []);

    const generateQuiz = () => {
        if (fullWordList.length < 5) {
            setError("Not enough words available to generate a quiz. Please refresh the page.");
            return;
        }

        const shuffledWords = [...fullWordList].sort(() => 0.5 - Math.random());
        const wordsForQuiz = shuffledWords.slice(0, 5);

        const newQuizData = wordsForQuiz.map(correctWord => {
            let options = [correctWord];
            while (options.length < 4) {
                const randomIndex = Math.floor(Math.random() * shuffledWords.length);
                const randomWord = shuffledWords[randomIndex];
                if (randomWord && randomWord.definition && !options.some(opt => opt.word === randomWord.word)) {
                    options.push(randomWord);
                }
            }

            return {
                question: correctWord.word,
                options: options.map(opt => opt.definition).sort(() => 0.5 - Math.random()),
                correctAnswer: correctWord.definition,
            };
        });
        setQuizData(newQuizData);
    };

    const handleStartNewQuiz = () => {
        generateQuiz();
        setUserAnswers({});
        setScore(0);
        setQuizState('active');
    };

    const handleRetryQuiz = () => {
        setUserAnswers({});
        setScore(0);
        setQuizState('active');
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmitQuiz = () => {
        let currentScore = 0;
        quizData.forEach((item, index) => {
            if (userAnswers[index] === item.correctAnswer) {
                currentScore++;
            }
        });
        setScore(currentScore);
        // Set state to 'score' to show the summary first
        setQuizState('score');
    };

    const renderQuizContent = () => {
        switch (quizState) {
            case 'score': {
                const percentage = Math.round((score / quizData.length) * 100);
                let message = "Keep trying! You'll get there.";
                if (percentage > 80) message = "Excellent work! 🚀";
                else if (percentage > 50) message = "Good job! Keep practicing. 💪";

                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                        <p className="text-4xl font-bold text-indigo-400 mb-2">{score} / {quizData.length}</p>
                        <p className="text-slate-400">{message}</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <button onClick={() => setQuizState('review')} className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors">See Detailed Results</button>
                            <button onClick={handleStartNewQuiz} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">New Quiz</button>
                        </div>
                    </div>
                );
            }
            case 'review':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-center">Quiz Review</h3>
                        <div className="text-left mb-8 space-y-6">
                            {quizData.map((item, index) => (
                                <div key={index} className="p-4 rounded-lg border border-slate-700 bg-slate-700/50">
                                    <p className="font-semibold text-lg mb-2">{index + 1}. What is the definition of "<strong>{item.question}</strong>"?</p>
                                    <div className="space-y-2">
                                        {item.options.map((option, optIndex) => {
                                            const isCorrect = option === item.correctAnswer;
                                            const isUserAnswer = userAnswers[index] === option;
                                            const optionClasses = [
                                                "p-2 rounded-md transition-colors",
                                                isCorrect && "correct-answer",
                                                isUserAnswer && !isCorrect && "incorrect-answer",
                                                !isUserAnswer && !isCorrect && "bg-slate-700 text-slate-300"
                                            ].filter(Boolean).join(' ');

                                            return (
                                                <div key={optIndex} className={optionClasses}>
                                                    {option}
                                                    {isCorrect && <span className="ml-2 text-green-200"> (Correct Answer)</span>}
                                                    {isUserAnswer && !isCorrect && <span className="ml-2 text-red-200"> (Your Answer)</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={handleRetryQuiz} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors">Retry Quiz</button>
                            <button onClick={handleStartNewQuiz} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">New Quiz</button>
                        </div>
                    </div>
                );
            case 'active':
                return (
                    <div>
                        {quizData.map((item, index) => (
                            <div key={index} className="mb-6">
                                <p className="font-semibold text-lg mb-3">{index + 1}. What is the definition of "<strong>{item.question}</strong>"?</p>
                                <div className="space-y-2">
                                    {item.options.map((option, optIndex) => (
                                        <div key={optIndex} className="quiz-option">
                                            <input
                                                type="radio"
                                                id={`q${index}_opt${optIndex}`}
                                                name={`question${index}`}
                                                value={option}
                                                checked={userAnswers[index] === option}
                                                onChange={() => handleAnswerChange(index, option)}
                                            />
                                            <label htmlFor={`q${index}_opt${optIndex}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 flex justify-center">
                            <button onClick={handleSubmitQuiz} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors" disabled={Object.keys(userAnswers).length !== quizData.length}>Submit Answers</button>
                        </div>
                    </div>
                );
            case 'intro':
            default:
                return (
                    <div className="text-center py-10">
                        <p className="text-slate-400 mb-4">Test your knowledge of today's words. Are you ready?</p>
                        <button onClick={handleStartNewQuiz} disabled={isLoading || error || fullWordList.length < 5} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                            {isLoading ? 'Loading Words...' : 'Start New Quiz'}
                        </button>
                    </div>
                );
        }
    };

    const styles = `
        .font-serif-display { font-family: 'Lora', serif; }
        .quiz-option input[type="radio"] { display: none; }
        .quiz-option label { display: block; padding: 0.75rem 1.25rem; border: 1px solid #475569; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s ease-in-out; }
        .quiz-option input[type="radio"]:checked + label { background-color: #6366f1; color: white; border-color: #6366f1; }
        .quiz-option label:hover { border-color: #818cf8; background-color: #1e293b; }
        .quiz-option input[type="radio"]:checked + label:hover { background-color: #4f46e5; }
        .correct-answer { background-color: #0d9488 !important; color: white !important; border-color: #0d9488 !important; }
        .incorrect-answer { background-color: #be123c !important; color: white !important; border-color: #be123c !important; }
        .video-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
        }
        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="bg-slate-900 text-slate-300 font-sans min-h-screen p-4 md:p-8">
                <div className="container mx-auto max-w-5xl">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 font-serif-display">Word Wise Daily</h1>
                        <p className="text-slate-400 mt-2 text-lg">Your daily dose of vocabulary enrichment.</p>
                    </header>

                    {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center mb-8">{error}</div>}

                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                            <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                                <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Word of the Day</h2>
                                {isLoading ? (
                                    <p className="mt-3">Loading...</p>
                                ) : wordOfTheDay && (
                                    <div className="mt-3">
                                        <h3 className="text-3xl font-bold font-serif-display text-slate-100">{wordOfTheDay.word}</h3>
                                        <p className="text-slate-400 italic text-sm mb-2">{wordOfTheDay.partOfSpeech}</p>
                                        <p className="text-slate-300 mb-3">{wordOfTheDay.definition}</p>
                                        <p className="text-sm text-slate-400 border-l-2 border-indigo-500 pl-2"><em>"{wordOfTheDay.example}"</em></p>
                                    </div>
                                )}
                            </section>

                            <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                                <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Today's Top 5 Vocabulary</h2>
                                {isLoading ? (
                                    <p className="mt-4">Loading...</p>
                                ) : top5Vocab.length > 0 ? (
                                    <ul className="mt-4 space-y-4">
                                        {top5Vocab.map((item) => (
                                            <li key={item.word}>
                                                <p className="font-semibold text-slate-200">{item.word}</p>
                                                <p className="text-sm text-slate-400">{item.definition}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-4 text-slate-400">No top 5 words available.</p>
                                )}
                            </section>

                            <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                                <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">Learning Videos</h2>
                                {isVideosLoading ? (
                                    <p>Loading video...</p>
                                ) : videoError ? (
                                    <p className="text-red-300">{videoError}</p>
                                ) : youtubeVideos.length > 0 ? (
                                    <div className="space-y-6">
                                        {youtubeVideos.map(video => (
                                            <div key={video.url} className="video-item">
                                                <h3 className="font-semibold text-slate-200 mb-2">{video.title}</h3>
                                                <div className="video-container">
                                                    <iframe
                                                        src={video.url.replace("watch?v=", "embed/")}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        title={video.title}
                                                    ></iframe>
                                                </div>
                                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">Watch on YouTube</a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400">No learning videos available at the moment.</p>
                                )}
                            </section>
                        </div>

                        <div className="lg:col-span-2">
                            <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 min-h-[300px]">
                                <h2 className="text-2xl font-bold text-slate-100 mb-4">Vocabulary Quiz</h2>
                                {renderQuizContent()}
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default LearningPage;