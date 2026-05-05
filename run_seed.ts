import { sequelize } from './app/config/dbConfig';
import { User } from './app/models/user.model';
import { Blog } from './app/models/blog.model';

async function seedBlogs() {
   try {
      await sequelize.authenticate();
      console.log('Connected to database.');

      const user = await User.findOne();
      if (!user) {
         console.error('No users found in the database. Please register a user first.');
         process.exit(1);
      }

      const blogsData = [
         {
            title: 'Mastering the System Design Interview: A Comprehensive Guide',
            slug: 'mastering-system-design-interview-comprehensive-guide',
            content: '# Mastering the System Design Interview\n\nSystem design interviews can be intimidating. Unlike algorithmic rounds, there isn\'t a single "correct" answer. Instead, interviewers evaluate your ability to navigate ambiguity, understand trade-offs, and design scalable architectures.\n\n## The Framework for Success\n\nWhen approaching any system design question (like "Design Twitter" or "Design a URL Shortener"), use the following framework:\n\n### 1. Requirements Clarification\nAlways start by asking questions. Do not jump into drawing boxes.\n- **Functional Requirements:** What should the system do? (e.g., users can post tweets, follow others, view timelines).\n- **Non-Functional Requirements:** Is it highly available or highly consistent? What is the expected read/write ratio? (e.g., Twitter is read-heavy, requires high availability).\n\n### 2. Back-of-the-Envelope Estimation\nCalculate the expected scale.\n- How many Daily Active Users (DAU)?\n- What is the expected storage size per year?\n- What is the network bandwidth requirement?\n\n### 3. High-Level Design\nDraw the core components. You\'ll typically need:\n- Load balancers\n- Web/App servers\n- Databases (SQL vs NoSQL)\n- Caching layer (Redis/Memcached)\n\n### 4. Deep Dive\nZoom into the bottlenecks. How do you handle a celebrity making a post? Do you use a push or pull model for the news feed? \n\n## Key Concepts to Know\n\nMake sure you are intimately familiar with:\n* **CAP Theorem** (Consistency, Availability, Partition Tolerance)\n* **Database Sharding and Partitioning**\n* **Consistent Hashing**\n* **Message Queues** (Kafka, RabbitMQ)\n* **Microservices vs Monoliths**\n\nPreparation is key. Start by reading architecture blogs from companies like Netflix, Uber, and Discord.',
            excerpt: 'System design interviews can be intimidating. Learn the definitive framework to tackle any scalable architecture question with confidence.',
            authorId: user.id,
            status: 'published' as 'published',
            tags: ["System Design", "Interview Prep", "Architecture"],
            coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
         },
         {
            title: '10 Most Common Algorithms Asked in FAANG Interviews',
            slug: '10-most-common-algorithms-asked-in-faang-interviews',
            content: '# Top 10 Algorithms for Tech Interviews\n\nTo land a job at top tech companies, you need a solid grasp of data structures and algorithms. After analyzing thousands of interview experiences, here are the most frequently tested concepts:\n\n## 1. Depth-First Search (DFS) & Breadth-First Search (BFS)\nThese are fundamental for traversing trees and graphs. You should be able to implement them recursively and iteratively.\n*Common problem: Number of Islands, Word Ladder.*\n\n## 2. Binary Search\nDon\'t just know how to search in a sorted array. Understand how to use binary search on the *answer space*.\n*Common problem: Find Peak Element, Koko Eating Bananas.*\n\n## 3. Sliding Window\nEssential for array and string problems where you need to find a subarray satisfying certain conditions.\n*Common problem: Longest Substring Without Repeating Characters.*\n\n## 4. Two Pointers\nOften used to optimize O(N^2) solutions down to O(N).\n*Common problem: 3Sum, Container With Most Water.*\n\n## 5. Dynamic Programming (DP)\nLearn to identify overlapping subproblems and optimal substructure. Start with memoization, then move to tabulation.\n*Common problem: Climbing Stairs, Longest Common Subsequence.*\n\n## 6. Backtracking\nUsed for exploring all potential solutions (permutations, combinations).\n*Common problem: N-Queens, Word Search.*\n\n## 7. Topological Sort\nCrucial for scheduling problems with dependencies.\n*Common problem: Course Schedule.*\n\n## 8. Trie (Prefix Tree)\nThe go-to data structure for string search and autocomplete features.\n*Common problem: Implement Trie, Word Search II.*\n\n## 9. Heap / Priority Queue\nUsed for finding the Kth largest/smallest element or merging sorted lists.\n*Common problem: Merge K Sorted Lists, Top K Frequent Elements.*\n\n## 10. Union Find (Disjoint Set)\nExcellent for graph cycle detection and connected components.\n*Common problem: Number of Connected Components in an Undirected Graph.*\n\nPractice these patterns rather than memorizing specific problems. Once you recognize the pattern, the code writes itself.',
            excerpt: 'A curated list of the top 10 algorithmic patterns you must master to pass technical interviews at FAANG companies.',
            authorId: user.id,
            status: 'published' as 'published',
            tags: ["Algorithms", "Data Structures", "FAANG"],
            coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
         },
         {
            title: 'The Ultimate Guide to Behavioral Interviews (STAR Method)',
            slug: 'ultimate-guide-to-behavioral-interviews-star-method',
            content: '# Conquering the Behavioral Interview\n\nMany engineers spend weeks grinding LeetCode but completely bomb the behavioral interview. Companies like Amazon value behavioral rounds just as heavily as technical ones. \n\nThe secret to success is the **STAR Method**.\n\n## What is the STAR Method?\n\nSTAR stands for **Situation, Task, Action, Result**. It\'s a structured manner of responding to a behavioral interview question.\n\n### Situation\nSet the scene. Provide the necessary context for your story. \n*Example: "At my previous company, our main database was experiencing severe latency spikes during peak traffic hours, causing timeouts for our users."*\n\n### Task\nDescribe your responsibility in that situation. What was the goal?\n*Example: "As the lead backend engineer, I was tasked with identifying the bottleneck and reducing the response time to under 200ms."*\n\n### Action\nExplain exactly what *you* did. Use "I", not "We". This is the most important part.\n*Example: "I analyzed the slow query logs and discovered that several complex joins were missing indexes. I implemented the missing indexes, but also introduced a Redis caching layer for the most frequently accessed, static data."*\n\n### Result\nShare the outcome of your actions. Quantify your success with real numbers whenever possible.\n*Example: "As a result, database CPU utilization dropped by 40%, and the average API response time decreased from 800ms to 120ms. We had zero downtime during the next peak traffic event."*\n\n## Common Behavioral Questions to Prepare For\nPrepare at least 4-5 versatile stories that can map to these common themes:\n1. Tell me about a time you had a conflict with a coworker.\n2. Describe a time you failed and what you learned.\n3. Tell me about a time you had to work under a tight deadline.\n4. Give an example of a time you showed initiative.\n\nRemember: Interviewers are looking for self-awareness, empathy, leadership, and a growth mindset. Practice your stories out loud until they sound natural.',
            excerpt: 'Don\'t let the behavioral round cost you the job offer. Learn how to structure your answers using the proven STAR method.',
            authorId: user.id,
            status: 'published' as 'published',
            tags: ["Behavioral Interview", "Career", "Soft Skills"],
            coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
         }
      ];

      await Blog.bulkCreate(blogsData);
      
      console.log('Successfully seeded the database with blogs!');
      process.exit(0);
   } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
   }
}

seedBlogs();
