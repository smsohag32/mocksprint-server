"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHint = exports.abandonInterview = exports.submitInterview = exports.startInterview = exports.getInterviewById = exports.getInterviews = void 0;
const interview_service_1 = require("../services/interview.service");
/**
 * Get all interviews for the current user
 */
const getInterviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const interviews = yield interview_service_1.InterviewService.getInterviewsByUser(userId);
        res.status(200).json(interviews);
    }
    catch (error) {
        console.error("Error fetching interviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getInterviews = getInterviews;
/**
 * Get a specific interview by ID
 */
const getInterviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const interview = yield interview_service_1.InterviewService.getInterviewById(id, userId);
        res.status(200).json(interview);
    }
    catch (error) {
        console.error("Error fetching interview:", error);
        if (error.message === "Interview not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getInterviewById = getInterviewById;
/**
 * Start a new interview session
 */
const startInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { question_id } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!question_id) {
            return res.status(400).json({ message: "Question ID is required" });
        }
        const interview = yield interview_service_1.InterviewService.startInterview(userId, question_id);
        res.status(201).json(interview);
    }
    catch (error) {
        console.error("Error starting interview:", error);
        if (error.message === "Question not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.startInterview = startInterview;
/**
 * Submit an interview session
 */
const submitInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { code } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const interview = yield interview_service_1.InterviewService.submitInterview(id, userId, code);
        res.status(200).json(interview);
    }
    catch (error) {
        console.error("Error submitting interview:", error);
        if (error.message === "Interview not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Interview is already completed or abandoned") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.submitInterview = submitInterview;
/**
 * Abandon an interview session
 */
const abandonInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const interview = yield interview_service_1.InterviewService.abandonInterview(id, userId);
        res.status(200).json({ message: "Interview abandoned", interview });
    }
    catch (error) {
        console.error("Error abandoning interview:", error);
        if (error.message === "Interview not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Interview is already completed or abandoned") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.abandonInterview = abandonInterview;
/**
 * Get an AI-generated hint for the interview
 */
const getHint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { code } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = yield interview_service_1.InterviewService.generateHint(id, userId, code);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error generating hint:", error);
        if (error.message === "Interview not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getHint = getHint;
