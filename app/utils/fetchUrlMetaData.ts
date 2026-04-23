import axios from "axios";
import * as cheerio from "cheerio";

interface Metadata {
   title: string;
   description: string;
   image: string;
   duration?: string;
}

// Extract YouTube video ID
const extractYouTubeId = (url: string): string | null => {
   try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
   } catch {
      return null;
   }
};

// Fetch YouTube metadata using noembed.com (works on Vercel)
const fetchYouTubeMetadata = async (videoId: string): Promise<Partial<Metadata>> => {
   try {
      const response = await axios.get(
         `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
         {
            timeout: 8000,
         }
      );

      const { title, thumbnail_url, author_name } = response.data;

      return {
         title: title || "Unknown Title",
         image: thumbnail_url || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
         description: `Video by ${author_name || "Unknown"}`,
      };
   } catch (error) {
      console.error("Error fetching YouTube metadata via noembed:", error);
      return {
         title: "Unknown Title",
         image: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
         description: "YouTube Video",
      };
   }
};

// Fetch Vimeo metadata using noembed.com
const fetchVimeoMetadata = async (vimeoId: string): Promise<Partial<Metadata>> => {
   try {
      const response = await axios.get(
         `https://noembed.com/embed?url=https://vimeo.com/${vimeoId}`,
         {
            timeout: 8000,
         }
      );

      const { title, thumbnail_url, author_name } = response.data;

      return {
         title: title || "Unknown Title",
         image: thumbnail_url || "",
         description: `Video by ${author_name || "Unknown"}`,
      };
   } catch (error) {
      console.error("Error fetching Vimeo metadata via noembed:", error);
      return {
         title: "Unknown Title",
         description: "Vimeo Video",
      };
   }
};

// Fetch generic webpage metadata
const fetchGenericMetadata = async (url: string): Promise<Partial<Metadata>> => {
   try {
      const { data } = await axios.get<string>(url, {
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

      const title =
         $('meta[property="og:title"]').attr("content") ||
         $('meta[name="title"]').attr("content") ||
         $("title").text() ||
         "Unknown Title";

      const description =
         $('meta[property="og:description"]').attr("content") ||
         $('meta[name="description"]').attr("content") ||
         "No description available";

      const image = $('meta[property="og:image"]').attr("content") || "";

      return {
         title: title.replace(/\s*-\s*YouTube$/, "").trim(),
         description: description.substring(0, 200),
         image,
      };
   } catch (error) {
      console.error("Error fetching generic metadata:", error);
      return {
         title: "Unknown Title",
         description: "Unable to fetch description",
      };
   }
};

export const fetchMetadata = async (url: string): Promise<Metadata> => {
   try {
      // Check if it's a YouTube URL
      const youtubeId = extractYouTubeId(url);
      if (youtubeId) {
         const metadata = await fetchYouTubeMetadata(youtubeId);
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
         const metadata = await fetchVimeoMetadata(vimeoId);
         return {
            title: metadata.title || "Unknown Title",
            description: metadata.description || "Vimeo Video",
            image: metadata.image || "",
         };
      }

      // Fallback to generic metadata fetching
      const metadata = await fetchGenericMetadata(url);
      return {
         title: metadata.title || "Unknown Title",
         description: metadata.description || "No description available",
         image: metadata.image || "",
      };
   } catch (error) {
      console.error("Error in fetchMetadata:", error);
      return {
         title: "Unknown Title",
         description: "Unable to fetch metadata",
         image: "",
      };
   }
};

// Optional: Export utility function for URL detection
export const detectUrlType = (url: string): "youtube" | "vimeo" | "generic" => {
   if (extractYouTubeId(url)) return "youtube";
   if (url.match(/(?:vimeo\.com\/)(\d+)/)) return "vimeo";
   return "generic";
};
