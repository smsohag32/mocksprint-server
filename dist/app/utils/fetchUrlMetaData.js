"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectUrlType = exports.fetchMetadata = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
// Extract YouTube video ID
const extractYouTubeId = (url) => {
    try {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }
    catch (_a) {
        return null;
    }
};
// Fetch YouTube metadata using noembed.com (works on Vercel)
const fetchYouTubeMetadata = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`, {
            timeout: 8000,
        });
        const { title, thumbnail_url, author_name } = response.data;
        return {
            title: title || "Unknown Title",
            image: thumbnail_url || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            description: `Video by ${author_name || "Unknown"}`,
        };
    }
    catch (error) {
        console.error("Error fetching YouTube metadata via noembed:", error);
        return {
            title: "Unknown Title",
            image: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            description: "YouTube Video",
        };
    }
});
// Fetch Vimeo metadata using noembed.com
const fetchVimeoMetadata = (vimeoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://noembed.com/embed?url=https://vimeo.com/${vimeoId}`, {
            timeout: 8000,
        });
        const { title, thumbnail_url, author_name } = response.data;
        return {
            title: title || "Unknown Title",
            image: thumbnail_url || "",
            description: `Video by ${author_name || "Unknown"}`,
        };
    }
    catch (error) {
        console.error("Error fetching Vimeo metadata via noembed:", error);
        return {
            title: "Unknown Title",
            description: "Vimeo Video",
        };
    }
});
// Fetch generic webpage metadata
const fetchGenericMetadata = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                Connection: "keep-alive",
            },
            timeout: 10000,
            maxRedirects: 5,
        });
        const $ = cheerio.load(data);
        const title = $('meta[property="og:title"]').attr("content") ||
            $('meta[name="title"]').attr("content") ||
            $("title").text() ||
            "Unknown Title";
        const description = $('meta[property="og:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "No description available";
        const image = $('meta[property="og:image"]').attr("content") || "";
        return {
            title: title.replace(/\s*-\s*YouTube$/, "").trim(),
            description: description.substring(0, 200),
            image,
        };
    }
    catch (error) {
        console.error("Error fetching generic metadata:", error);
        return {
            title: "Unknown Title",
            description: "Unable to fetch description",
        };
    }
});
const fetchMetadata = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if it's a YouTube URL
        const youtubeId = extractYouTubeId(url);
        if (youtubeId) {
            const metadata = yield fetchYouTubeMetadata(youtubeId);
            return {
                title: metadata.title || "Unknown Title",
                description: metadata.description || "YouTube Video",
                image: metadata.image || `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
            };
        }
        // Check if it's a Vimeo URL
        const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
        if (vimeoMatch) {
            const vimeoId = vimeoMatch[1];
            const metadata = yield fetchVimeoMetadata(vimeoId);
            return {
                title: metadata.title || "Unknown Title",
                description: metadata.description || "Vimeo Video",
                image: metadata.image || "",
            };
        }
        // Fallback to generic metadata fetching
        const metadata = yield fetchGenericMetadata(url);
        return {
            title: metadata.title || "Unknown Title",
            description: metadata.description || "No description available",
            image: metadata.image || "",
        };
    }
    catch (error) {
        console.error("Error in fetchMetadata:", error);
        return {
            title: "Unknown Title",
            description: "Unable to fetch metadata",
            image: "",
        };
    }
});
exports.fetchMetadata = fetchMetadata;
// Optional: Export utility function for URL detection
const detectUrlType = (url) => {
    if (extractYouTubeId(url))
        return "youtube";
    if (url.match(/(?:vimeo\.com\/)(\d+)/))
        return "vimeo";
    return "generic";
};
exports.detectUrlType = detectUrlType;
