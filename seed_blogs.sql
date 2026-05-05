-- Run this script in your MySQL database to seed the blogs table with professional software engineering articles.

SET @author_id = (SELECT id FROM users LIMIT 1);

INSERT INTO blogs (id, title, slug, content, excerpt, authorId, status, tags, coverImage, createdAt, updatedAt)
VALUES 
(
    UUID(),
    'Mastering the System Design Interview: A Comprehensive Guide',
    'mastering-system-design-interview-comprehensive-guide',
    '# Mastering the System Design Interview

System design interviews can be intimidating. Unlike algorithmic rounds, there isn''t a single "correct" answer. Instead, interviewers evaluate your ability to navigate ambiguity, understand trade-offs, and design scalable architectures.

## The Framework for Success

When approaching any system design question (like "Design Twitter" or "Design a URL Shortener"), use the following framework:

### 1. Requirements Clarification
Always start by asking questions. Do not jump into drawing boxes.
- **Functional Requirements:** What should the system do? (e.g., users can post tweets, follow others, view timelines).
- **Non-Functional Requirements:** Is it highly available or highly consistent? What is the expected read/write ratio? (e.g., Twitter is read-heavy, requires high availability).

### 2. Back-of-the-Envelope Estimation
Calculate the expected scale.
- How many Daily Active Users (DAU)?
- What is the expected storage size per year?
- What is the network bandwidth requirement?

### 3. High-Level Design
Draw the core components. You''ll typically need:
- Load balancers
- Web/App servers
- Databases (SQL vs NoSQL)
- Caching layer (Redis/Memcached)

### 4. Deep Dive
Zoom into the bottlenecks. How do you handle a celebrity making a post? Do you use a push or pull model for the news feed? 

## Key Concepts to Know

Make sure you are intimately familiar with:
* **CAP Theorem** (Consistency, Availability, Partition Tolerance)
* **Database Sharding and Partitioning**
* **Consistent Hashing**
* **Message Queues** (Kafka, RabbitMQ)
* **Microservices vs Monoliths**

Preparation is key. Start by reading architecture blogs from companies like Netflix, Uber, and Discord.',
    'System design interviews can be intimidating. Learn the definitive framework to tackle any scalable architecture question with confidence.',
    @author_id,
    'published',
    '["System Design", "Interview Prep", "Architecture"]',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    NOW(),
    NOW()
),
(
    UUID(),
    '10 Most Common Algorithms Asked in FAANG Interviews',
    '10-most-common-algorithms-asked-in-faang-interviews',
    '# Top 10 Algorithms for Tech Interviews

To land a job at top tech companies, you need a solid grasp of data structures and algorithms. After analyzing thousands of interview experiences, here are the most frequently tested concepts:

## 1. Depth-First Search (DFS) & Breadth-First Search (BFS)
These are fundamental for traversing trees and graphs. You should be able to implement them recursively and iteratively.
*Common problem: Number of Islands, Word Ladder.*

## 2. Binary Search
Don''t just know how to search in a sorted array. Understand how to use binary search on the *answer space*.
*Common problem: Find Peak Element, Koko Eating Bananas.*

## 3. Sliding Window
Essential for array and string problems where you need to find a subarray satisfying certain conditions.
*Common problem: Longest Substring Without Repeating Characters.*

## 4. Two Pointers
Often used to optimize O(N^2) solutions down to O(N).
*Common problem: 3Sum, Container With Most Water.*

## 5. Dynamic Programming (DP)
Learn to identify overlapping subproblems and optimal substructure. Start with memoization, then move to tabulation.
*Common problem: Climbing Stairs, Longest Common Subsequence.*

## 6. Backtracking
Used for exploring all potential solutions (permutations, combinations).
*Common problem: N-Queens, Word Search.*

## 7. Topological Sort
Crucial for scheduling problems with dependencies.
*Common problem: Course Schedule.*

## 8. Trie (Prefix Tree)
The go-to data structure for string search and autocomplete features.
*Common problem: Implement Trie, Word Search II.*

## 9. Heap / Priority Queue
Used for finding the Kth largest/smallest element or merging sorted lists.
*Common problem: Merge K Sorted Lists, Top K Frequent Elements.*

## 10. Union Find (Disjoint Set)
Excellent for graph cycle detection and connected components.
*Common problem: Number of Connected Components in an Undirected Graph.*

Practice these patterns rather than memorizing specific problems. Once you recognize the pattern, the code writes itself.',
    'A curated list of the top 10 algorithmic patterns you must master to pass technical interviews at FAANG companies.',
    @author_id,
    'published',
    '["Algorithms", "Data Structures", "FAANG"]',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
    NOW(),
    NOW()
),
(
    UUID(),
    'The Ultimate Guide to Behavioral Interviews (STAR Method)',
    'ultimate-guide-to-behavioral-interviews-star-method',
    '# Conquering the Behavioral Interview

Many engineers spend weeks grinding LeetCode but completely bomb the behavioral interview. Companies like Amazon value behavioral rounds just as heavily as technical ones. 

The secret to success is the **STAR Method**.

## What is the STAR Method?

STAR stands for **Situation, Task, Action, Result**. It''s a structured manner of responding to a behavioral interview question.

### Situation
Set the scene. Provide the necessary context for your story. 
*Example: "At my previous company, our main database was experiencing severe latency spikes during peak traffic hours, causing timeouts for our users."*

### Task
Describe your responsibility in that situation. What was the goal?
*Example: "As the lead backend engineer, I was tasked with identifying the bottleneck and reducing the response time to under 200ms."*

### Action
Explain exactly what *you* did. Use "I", not "We". This is the most important part.
*Example: "I analyzed the slow query logs and discovered that several complex joins were missing indexes. I implemented the missing indexes, but also introduced a Redis caching layer for the most frequently accessed, static data."*

### Result
Share the outcome of your actions. Quantify your success with real numbers whenever possible.
*Example: "As a result, database CPU utilization dropped by 40%, and the average API response time decreased from 800ms to 120ms. We had zero downtime during the next peak traffic event."*

## Common Behavioral Questions to Prepare For
Prepare at least 4-5 versatile stories that can map to these common themes:
1. Tell me about a time you had a conflict with a coworker.
2. Describe a time you failed and what you learned.
3. Tell me about a time you had to work under a tight deadline.
4. Give an example of a time you showed initiative.

Remember: Interviewers are looking for self-awareness, empathy, leadership, and a growth mindset. Practice your stories out loud until they sound natural.',
    'Don''t let the behavioral round cost you the job offer. Learn how to structure your answers using the proven STAR method.',
    @author_id,
    'published',
    '["Behavioral Interview", "Career", "Soft Skills"]',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
    NOW(),
    NOW()
);
