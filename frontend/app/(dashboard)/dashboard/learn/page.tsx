"use client";

import { useState } from "react";
import { GraduationCap, Trophy, Play, CheckCircle2, ChevronRight, ArrowLeft, Lightbulb, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What does a Temperature setting of 0.0 achieve in an LLM?",
    options: ["Maximum creativity and randomness", "Deterministic and focused outputs", "Faster generation speed", "Higher token usage"],
    correctAnswer: 1,
    explanation: "Temperature 0.0 flattens the probability distribution, making the model choose the most likely token every time, resulting in deterministic behavior."
  },
  {
    id: 2,
    question: "In RAG architecture, what is 'Semantic Chunking'?",
    options: ["Splitting text by fixed character count", "Splitting text based on structural HTML tags", "Splitting text where the meaning or topic changes", "Adding random overlaps between paragraphs"],
    correctAnswer: 2,
    explanation: "Semantic chunking uses the meaning of the text (often via embeddings) to find natural break points between different concepts."
  },
  {
    id: 3,
    question: "What is the 'Lost in the Middle' phenomenon?",
    options: ["When an agent enters an infinite loop", "When models lose accuracy for info placed in the center of long prompts", "When a vector database fails to find a match", "When tokens are dropped during transmission"],
    correctAnswer: 1,
    explanation: "Research shows that LLMs have a 'U-shaped' performance curve, recalling information better at the very beginning or end of a large context window."
  },
  {
    id: 4,
    question: "Which logic structure defines an autonomous agent's loop?",
    options: ["MVC (Model View Controller)", "FIFO (First In First Out)", "ReAct (Reason + Act)", "REST (Representational State Transfer)"],
    correctAnswer: 2,
    explanation: "The ReAct framework allows agents to alternate between reasoning steps ('Thought') and execution steps ('Action')."
  }
];

export default function LearnPage() {
  const [mode, setMode] = useState<"hub" | "quiz" | "results">("hub");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = () => {
    setMode("quiz");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setMode("results");
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] animate-in fade-in duration-500 pb-10">
      
      {mode === "hub" && (
        <>
          <header className="mb-10 px-4 sm:px-0">
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">Learning Hub</h1>
            <p className="text-sm sm:text-base text-zinc-500 font-medium">Master AI engineering through interactive labs and knowledge checks.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-sm group hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer relative overflow-hidden" onClick={startQuiz}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={80} />
              </div>
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 transition-transform group-hover:scale-110">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic mb-3">Mastery Quiz</h3>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Test your knowledge on Softmax functions, RAG pipelines, and Agentic loops based on the 'Nexus AI' book material.</p>
              <button className="flex items-center gap-2 text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic group-hover:gap-4 transition-all uppercase">
                Start Challenge <ChevronRight size={16} />
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-sm group opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic mb-3">Interactive Labs</h3>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Visualizing LLM probability distributions and vector embeddings in real-time. (Coming in v1.2)</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Under Development
              </div>
            </div>
          </div>
        </>
      )}

      {mode === "quiz" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
          <button 
            onClick={() => setMode("hub")}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors font-bold text-sm uppercase italic"
          >
            <ArrowLeft size={16} /> Back to Hub
          </button>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/5">
            <div className="flex justify-between items-center mb-8">
               <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                  Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
               </span>
               <div className="w-32 h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500" 
                    style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }} 
                  />
               </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-8 leading-tight italic">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-3 mb-8">
              {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={cn(
                    "w-full p-4 sm:p-5 text-left rounded-2xl border-2 transition-all font-bold text-sm flex items-center justify-between",
                    selectedOption === null 
                      ? "border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-900" 
                      : idx === QUIZ_QUESTIONS[currentQuestion].correctAnswer
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : selectedOption === idx
                          ? "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                          : "border-zinc-100 dark:border-zinc-900 opacity-50"
                  )}
                >
                  {option}
                  {selectedOption !== null && idx === QUIZ_QUESTIONS[currentQuestion].correctAnswer && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 animate-in zoom-in-95 duration-300">
                <h4 className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase italic mb-2">
                   <Sparkles size={14} /> Insight
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium italic">
                  {QUIZ_QUESTIONS[currentQuestion].explanation}
                </p>
                <button 
                  onClick={nextQuestion}
                  className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase italic shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Results"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "results" && (
        <div className="max-w-md mx-auto px-4 sm:px-0 text-center py-12 animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-600/40 rotate-6">
              <Trophy size={48} />
           </div>
           <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase italic italic mb-2 tracking-tighter">Mission Complete</h2>
           <p className="text-zinc-500 font-medium mb-8 italic italic">You've successfully analyzed the core engineering concepts.</p>
           
           <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-8">
              <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-2 italic">
                 {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%
              </div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Mastery Score</p>
              <div className="mt-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                 Correct Answers: <span className="font-black text-zinc-900 dark:text-white">{score} / {QUIZ_QUESTIONS.length}</span>
              </div>
           </div>

           <button 
             onClick={() => setMode("hub")}
             className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-base uppercase italic shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
           >
             Return to Hub
           </button>
        </div>
      )}
    </div>
  );
}
