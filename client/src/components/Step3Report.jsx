import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Step3Report({ report }) {
  const navigate = useNavigate();

  const handleDownloadPdf = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 14;
      let y = 16;

      const addWrappedText = (text, fontSize = 11, isBold = false) => {
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(String(text || ""), pageWidth - margin * 2);
        pdf.text(lines, margin, y);
        y += lines.length * 5 + 2;
      };

      const addSectionHeader = (text) => {
        if (y > 270) {
          pdf.addPage();
          y = 16;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(text, margin, y);
        y += 7;
      };

      pdf.setFillColor(16, 185, 129);
      pdf.rect(0, 0, pageWidth, 16, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Interview Analytics Report", margin, 10);

      pdf.setTextColor(17, 24, 39);
      y = 28;
      addWrappedText(`Final Score: ${finalScore}/10`, 13, true);
      addWrappedText(`Confidence: ${confidence}/10`, 11);
      addWrappedText(`Communication: ${communication}/10`, 11);
      addWrappedText(`Correctness: ${correctness}/10`, 11);
      addWrappedText(`Performance: ${performanceText}`, 11);
      addWrappedText(`Summary: ${shortTagline}`, 11);

      addSectionHeader("Question Breakdown");

      normalizedQuestionScores.forEach((q, index) => {
        if (y > 260) {
          pdf.addPage();
          y = 16;
        }

        addWrappedText(`Q${index + 1}: ${q?.question || "Question not available"}`, 11, true);
        addWrappedText(`Answer: ${q?.answer || "Answer not available"}`, 10);
        addWrappedText(`Score: ${q?.score || 0}/10`, 10);
        addWrappedText(`Feedback: ${q?.feedback || "No feedback available"}`, 10);
        y += 2;
      });

      const fileName = `interview-report-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF download failed. Please try again.");
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    questionWiseScores = [],
  } = report;

  const normalizedQuestionScores = Array.isArray(questionWiseScore) && questionWiseScore.length
    ? questionWiseScore
    : questionWiseScores;

  const questionScoreData = normalizedQuestionScores.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score?.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const percentage = (finalScore / 10) * 100;

  return (
    <div id="report-content" className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate("/history")}
            className="p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Interview Analytics Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              AI-powered performance insights
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl shadow-md transition-all duration-300 font-semibold"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side */}

        <div className="space-y-6">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-8 text-center"
          >
            <h3 className="text-gray-500 mb-6">
              Overall Performance
            </h3>

            <div className="w-32 h-32 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${finalScore}/10`}
                styles={buildStyles({
                  pathColor: "#10b981",
                  trailColor: "#e5e7eb",
                  textColor: "#111827",
                  textSize: "18px",
                })}
              />
            </div>

            <p className="text-gray-400 mt-4">
              Out of 10
            </p>

            <div className="mt-4">
              <p className="font-semibold text-gray-800">
                {performanceText}
              </p>

              <p className="text-gray-500 mt-1">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Skill Evaluation
            </h3>

            <div className="space-y-5">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span>{skill.label}</span>

                    <span className="font-semibold text-green-600">
                      {skill.value}/10
                    </span>
                  </div>

                  <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{
                        width: `${skill.value * 10}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Side */}

        <div className="lg:col-span-2">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Performance Trend
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    fill="#bbf7d0"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </motion.div>

                    <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Question Breakdown
            </h3>

            <div className="space-y-5">
              {(normalizedQuestionScores.length > 0
                ? normalizedQuestionScores
                : [{}, {}, {}, {}, {}]
              ).map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-gray-200 rounded-2xl p-5 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Question {i + 1}
                    </h4>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        (q.score || 0) >= 8
                          ? "bg-green-100 text-green-700"
                          : (q.score || 0) >= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {q.score || 0}/10
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-700">
                        Question
                      </p>

                      <p className="text-gray-600 mt-1">
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700">
                        Your Answer
                      </p>

                      <p className="text-gray-600 mt-1">
                        {q.answer || "Answer not available"}
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h5 className="font-semibold text-green-700 mb-2">
                        AI Feedback
                      </h5>

                      <p className="text-gray-700">
                        {q.feedback ||
                          "Feedback will appear here after interview analysis."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Step3Report;