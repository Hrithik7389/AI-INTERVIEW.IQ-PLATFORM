import { useState, useRef, useEffect, useCallback } from "react";
import malevideo from "../assets/Videos/male-ai.mp4";
import femalevideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";


function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions = [], userName = "" } = interviewData || {};

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const speechSupported = typeof window !== "undefined" && "webkitSpeechRecognition" in window;

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const isAIPlayingRef = useRef(isAIPlaying);
  const isMicOnRef = useRef(isMicOn);
  const answerRef = useRef(answer);

  const currentQuestion = questions?.[currentIndex];
  const timeLimit = currentQuestion?.timeLimit || 60;
  const timeLeft = Math.max(timeLimit - elapsed, 0);

  const startMic = useCallback(() => {
    if (recognitionRef.current && !isAIPlayingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
      }
    }
  }, []);

  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn((prev) => !prev);
  }, [isMicOn, startMic, stopMic]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      // Try Known female voices first
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try Known male voices
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource =
    voiceGender === "male" ? malevideo : femalevideo;

    /* ------------ SPEAK FUNCTION ------------- */
    const speakText = useCallback((text) => {
      return new Promise((resolve) => {
        setSubtitle(text);

        if (!window.speechSynthesis || !selectedVoice) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        // Add natural pauses after commas and periods
        const humanText = text
          .replace(/,/g, ", ... ")
          .replace(/\./g, ". ... ");

        const utterance = new SpeechSynthesisUtterance(humanText);

        utterance.voice = selectedVoice;

        // Human-like pacing
        utterance.rate = 0.92; // slightly slower than normal
        utterance.pitch = 1.05; // small warmth
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          videoRef.current?.play();
        };

        utterance.onend = () => {
          videoRef.current?.pause();
          videoRef.current.currentTime = 0;
          setIsAIPlaying(false);

          if (isMicOn) {
            startMic();
          }

          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        
        setSubtitle(text);

        window.speechSynthesis.speak(utterance);
      });
    }, [selectedVoice, isMicOn, startMic, stopMic]);

    useEffect(()=>{
      if(!selectedVoice){
        return;
      }
      const runIntro = async () => {
        if(isIntroPhase) {
          await speakText (
            `Hi ${userName}, it's a great to meet you today. I hope 
            you're feeling confident and ready.`
          );

          await speakText (
             "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
          );
           
          setIsIntroPhase(false)
        }else if(currentQuestion){
          await new Promise(r => setTimeout(r, 800));

          // If last question (hard level)
          if (currentIndex === questions.length - 1){
             await speakText("Alright, this one might be a bit more challenging.");
          }
          await speakText(currentQuestion.question);

          if (isMicOn) {
            startMic();
          }
        }
      } 

      runIntro()
    
    }, [selectedVoice, isIntroPhase, currentIndex, currentQuestion, isMicOn, questions.length, speakText, startMic, userName]);
    

    useEffect(()=>{
      if(isIntroPhase)return;
      if(!currentQuestion)return;
      if(isSubmitting)return;
      const timer = setInterval(() => {
        setElapsed((prev)=> prev + 1);
      }, 1000);

      return ()=>clearInterval(timer)

    }, [isIntroPhase, currentIndex, isSubmitting, currentQuestion]);

    useEffect(()=>{
      if (!("webkitSpeechRecognition" in window)) {
        return;
      }

      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript.trim();

        if (lastResult.isFinal) {
          const nextAnswer = [answerRef.current, transcript]
            .filter(Boolean)
            .join(" ");
          answerRef.current = nextAnswer;
          setAnswer(nextAnswer);
          return;
        }

        if (transcript) {
          const preview = [answerRef.current, transcript]
            .filter(Boolean)
            .join(" ");
          setAnswer(preview);
        }
      };

      recognition.onend = () => {
        if (isMicOnRef.current && !isAIPlayingRef.current) {
          try {
            recognition.start();
          } catch (err) {
            console.warn("Speech recognition restart failed:", err);
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setIsMicOn(false);
        }
      };

      recognitionRef.current = recognition;
    },[]);

    const resetAnswerState = useCallback(() => {
      setAnswer("");
      answerRef.current = "";
      setFeedback("");
      setElapsed(0);
    }, []);

    const submitAnswer = useCallback(async () => {
      if (isSubmitting) return;
      const currentAnswer = (answerRef.current ?? answer ?? "").trim();

      if (!currentAnswer) {
        setFeedback("Please speak or type your answer before submitting.");
        return;
      }

      stopMic();
      setIsSubmitting(true);
      setFeedback("");

      try {
        const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
          interviewId,
          questionIndex: currentIndex,
          answer: currentAnswer,
          timeTaken: Math.max(0, (currentQuestion?.timeLimit || 60) - timeLeft),
        }, { withCredentials: true });

        const feedbackText = result.data.feedback || "Answer submitted successfully.";
        setFeedback(feedbackText);
        await speakText(feedbackText);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit answer. Please try again.";
        setFeedback(message);
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }, [answer, currentIndex, currentQuestion, interviewId, isSubmitting, speakText, stopMic, timeLeft]);

    const handleNext = async () => {
      resetAnswerState();

      if (currentIndex + 1 >= questions.length) {
        finishInterview();
        return;
      }

      await speakText("Alright, let's move to the next question.");

      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => {
        if (isMicOn) startMic();
      }, 500);
    }

    const finishInterview = async () => {
      stopMic()
      setIsMicOn(false)
      try {
        const result = await axios.post(ServerUrl+ "/api/interview/finish" , {
          interviewId} , {withCredentials:true})
        
          console.log(result.data)
          onFinish(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      if (isIntroPhase) return;
      if (!currentQuestion) return;

      if (timeLeft === 0 && !isSubmitting && !feedback) {
        const submitTimeout = window.setTimeout(() => {
          submitAnswer();
        }, 0);

        return () => window.clearTimeout(submitTimeout);
      }
    }, [timeLeft, isIntroPhase, currentQuestion, isSubmitting, feedback, submitAnswer]);

    useEffect(() => {
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        }

        window.speechSynthesis.cancel();
      };
    }, []);

    if (!interviewData) {
      return (
        <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
          Loading...
        </div>
      );
    }





  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1400px] min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">

        {/* Video Section */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 border-r border-gray-200 gap-6">

          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              ref={videoRef}
              src={videoSource}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-auto object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Subtitle */}
          <div className="w-full max-w-md bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-gray-700">
              {subtitle || `Hello ${userName}, welcome to your AI interview.`}
            </p>
          </div>

          {/* Timer Area */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Interview Status
              </span>

              <span className="text-sm font-semibold text-emerald-600">
                {isAIPlaying ? "AI Speaking" : "Listening"}
               
              </span>
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">
                  Current Question
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-600">
                  {questions?.length || 0}
                </span>
                <span className="text-xs text-gray-400">
                  Total Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

         {!isIntroPhase &&  (<div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Question {currentIndex + 1} of {questions?.length || 0}
            </p>

            <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
              {currentQuestion?.question || "No Question Available"}
            </div>
          </div>)
}

          <textarea
            key={currentIndex}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              answerRef.current = e.target.value;
            }}
            placeholder={speechSupported ? "Type your answer or speak after the question is read aloud..." : "Speech recognition is not supported in this browser."}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800"
          />

         {!feedback ? ( <div className="flex items-center gap-4 mt-6">
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg"
            >
              {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20}/>}
            </motion.button>

            <motion.button
            onClick={submitAnswer}
            disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500">
              {isSubmitting?"Submitting...":"Submit Answer"}

            </motion.button>
          </div>) :(
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
               <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>

               <button
               onClick={handleNext}
               className='w-full bg-gradient-to-r from-emerald-600
               to-teal-500 text-white py-3 rounded-xl shadow-md
               hover:opacity-90 transition flex items-center justify-center gap-1'>
                Next Question <BsArrowRight size={18}/>
               </button>

            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Step2Interview; 