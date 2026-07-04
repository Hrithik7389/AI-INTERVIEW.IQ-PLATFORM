import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  difficulty: String,
  timeLimit: Number,

  answer: {
    type: String,
    default: "",
  },

  score: {
    type: Number,
    default: 0,
  },

  confidence: {
    type: Number,
    default: 0,
  },

  communication: {
    type: Number,
    default: 0,
  },

  correctness: {
    type: Number,
    default: 0,
  },

  feedback: {
    type: String,
    default: "",
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      default: "",
    },

    questions: [questionSchema],

    finalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;