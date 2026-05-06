import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DECK } from './lib/data';
import { TextWithVocab } from './components/TextWithVocab';

export default function App() {
  const [visited, setVisited] = useState<number[]>(() => {
    const saved = localStorage.getItem('cur100_visited');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isTR, setIsTR] = useState(false);

  useEffect(() => {
    localStorage.setItem('cur100_visited', JSON.stringify(visited));
  }, [visited]);

  const handleRoll = () => {
    const available = DECK.map(d => d.id).filter(id => !visited.includes(id));
    if (available.length === 0) {
      alert("Deck empty! You've completed all 100 questions. Resetting board...");
      handleReset();
      return;
    }
    
    // Mechanical Randomizer
    const nextId = available[Math.floor(Math.random() * available.length)];
    setCurrentId(nextId);
    setVisited([...visited, nextId]);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the entire deck?")) {
      setVisited([]);
      setCurrentId(null);
    }
  };

  const currentQ = DECK.find(q => q.id === currentId);
  const isChallenge = currentQ?.type === 'challenge';

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 max-w-5xl mx-auto">
      
      {/* Header Area */}
      <header className="flex justify-between items-center mb-8 border-b border-[#262626] pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tighter bg-[#262626] text-[#F5F5F5] px-2 py-1">CUR100</h1>
          <div className="hidden md:flex gap-1 text-xs items-center">
            <span className="bg-[#FF5733] w-3 h-3 rounded-full brutalist-border"></span>
            <span>= CHALLENGE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Switch */}
          <div className="flex items-center gap-2 text-sm font-bold bg-white brutalist-border p-1">
            <button 
              onClick={() => setIsTR(false)} 
              className={`px-3 py-1 transition-colors ${!isTR ? 'bg-[#262626] text-white' : 'text-[#262626] hover:bg-gray-200'}`}
            >
              ENG
            </button>
            <button 
              onClick={() => setIsTR(true)} 
              className={`px-3 py-1 transition-colors ${isTR ? 'bg-[#262626] text-white' : 'text-[#262626] hover:bg-gray-200'}`}
            >
              TR
            </button>
          </div>
          
          <button onClick={handleReset} className="text-xs uppercase tracking-widest underline hover:text-[#FF5733] font-bold">RESET</button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col justify-center items-center gap-8 w-full relative">

        {/* Single Card View */}
        <div className="w-full relative max-w-4xl">
          <AnimatePresence mode="wait">
            {currentQ ? (
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                transition={{ duration: 0.2 }}
                className={`w-full bg-white p-8 md:p-12 min-h-[300px] flex flex-col justify-center items-center text-center relative ${isChallenge ? 'border-4 border-[#FF5733] bg-[#fffcfb]' : 'brutalist-border-thick'}`}
              >
                <span className={`absolute top-4 left-4 font-bold ${isChallenge ? 'text-[#FF5733]' : 'text-gray-400'}`}>
                  Nº {currentQ.id.toString().padStart(3, '0')}
                </span>
                
                {isChallenge && (
                  <span className="absolute top-4 right-4 bg-[#FF5733] text-white text-xs px-2 py-1 uppercase tracking-widest font-bold">
                    ★ Challenge
                  </span>
                )}

                <h2 className="text-2xl md:text-4xl font-bold leading-tight mt-6">
                  {isTR ? currentQ.text_tr : <TextWithVocab text={currentQ.text_en} />}
                </h2>

              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="w-full bg-white brutalist-border-thick p-12 min-h-[300px] flex flex-col justify-center items-center text-center text-gray-400"
              >
                <h2 className="text-xl font-bold tracking-widest text-[#262626]">SYSTEM READY</h2>
                <p className="text-sm mt-2 font-mono">Awaiting initial roll sequence.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls & Roll Button */}
        <div className="w-full max-w-md mt-4 relative z-20">
          <button 
            onClick={handleRoll}
            className="w-full py-6 text-3xl font-bold synth-btn uppercase tracking-widest flex justify-center items-center gap-4"
          >
            <span className="w-4 h-4 bg-[#FF5733] rounded-full inline-block animate-pulse"></span>
            ROLL
            <span className="w-4 h-4 bg-[#FF5733] rounded-full inline-block animate-pulse"></span>
          </button>
        </div>
      </main>

      {/* Footer & LED Matrix */}
      <footer className="mt-12 flex flex-col md:flex-row justify-between items-end gap-6 border-t border-[#262626] pt-6 relative z-10 w-full">
        
        <div>
          <p className="text-xs uppercase tracking-widest mb-2 font-bold flex justify-between">
            <span>Progress Matrix</span>
            <span>{visited.length} / 100</span>
          </p>
          {/* 10x10 LED Tracker */}
          <div className="grid grid-cols-10 gap-1 bg-white p-2 brutalist-border w-max">
            {Array.from({length: 100}).map((_, i) => {
              const qId = i + 1;
              const isVisited = visited.includes(qId);
              return (
                <div 
                  key={qId} 
                  title={`Question ${qId}`}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${isVisited ? 'bg-[#FF5733] shadow-[0_0_4px_#FF5733]' : 'bg-[#E0E0E0] border border-gray-300'}`} 
                />
              )
            })}
          </div>
        </div>

        <div className="text-right text-xs text-gray-500 font-mono">
          <p>CUR100 ENGINE v1.0</p>
          <p>TEENAGE ENGINEERING AESTHETIC</p>
        </div>
      </footer>

    </div>
  );
}
