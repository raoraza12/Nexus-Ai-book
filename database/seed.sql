-- ============================================================
-- AI Book Platform — Seed Data for Master AI Book
-- Run this in your Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- 1. Create the Master AI Book
INSERT INTO public.books (id, title, author, description, genre, cover_url)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Fixed UUID for 'master-ai-book'
  'Mastering Agentic AI',
  'AI Mastery Team',
  'A comprehensive roadmap from Python basics to autonomous multi-agent systems.',
  'Artificial Intelligence',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create chapters for the roadmap
INSERT INTO public.chapters (book_id, chapter_number, title, content_md)
VALUES 
(
  '00000000-0000-0000-0000-000000000000', 
  1, 
  'Introduction to Agentic AI', 
  '# Introduction to Agentic AI\n\nWelcome to the future of software. Agentic AI is not just about chatbots; it is about systems that can **reason**, **plan**, and **execute** tasks autonomously.\n\n### In this chapter, we will cover:\n- What are AI Agents?\n- The difference between LLMs and Agents.\n- Why Agentic workflows are the next big thing.\n\n> "The transition from prompt engineering to agentic engineering is the most significant shift in AI development today."'
),
(
  '00000000-0000-0000-0000-000000000000', 
  2, 
  'LLM Fundamentals for Agents', 
  '# LLM Fundamentals\n\nBefore building agents, you must understand the engine driving them. Large Language Models (LLMs) provide the reasoning core.\n\n### Key Concepts:\n1. **Tokenization**: How models read text.\n2. **Context Window**: The memory limit of your agent.\n3. **Temperature**: Controlling creativity vs. precision.'
),
(
  '00000000-0000-0000-0000-000000000000', 
  3, 
  'Prompt Engineering & Few-Shot Learning', 
  '# Advanced Prompt Engineering\n\nAgents rely on high-quality instructions. In this chapter, we dive into **Chain-of-Thought (CoT)** and **Few-Shot Prompting**.\n\n### Examples:\n- Constructing System Prompts.\n- Defining tool-use instructions.\n- Error handling via prompts.'
),
(
  '00000000-0000-0000-0000-000000000000', 
  4, 
  'RAG Systems (Retrieval-Augmented)', 
  '# RAG Systems\n\nAgents need knowledge beyond their training data. Retrieval-Augmented Generation (RAG) connects your agent to external documents.\n\n### The RAG Pipeline:\n- Document Indexing.\n- Embedding Generation.\n- Context Injection.'
),
(
  '00000000-0000-0000-0000-000000000000', 
  5, 
  'Vector Databases Deep Dive', 
  '# Vector Databases\n\nTo search through millions of documents in milliseconds, we use Vector Databases like Pinecone, Weaviate, or Supabase pgvector.\n\n### Learning Objectives:\n- Semantic similarity vs. Keyword search.\n- Indexing strategies (HNSW, IVFFlat).\n- Scalability in Production.'
),
(
  '00000000-0000-0000-0000-000000000000', 
  6, 
  'Building Autonomous Agents', 
  '# Building Autonomous Agents\n\nThis is where it gets exciting. We combine LLMs, Memory, and Tools to create a system that can complete complex tasks without human intervention.\n\n### Agent Architecture:\n- **Perception**: Reading the world.\n- **Brain**: Planning the next step.\n- **Action**: Using a tool (e.g., Python, Search, API).'
),
(
  '00000000-0000-0000-0000-000000000000', 
  7, 
  'Multi-Agent Orchestration', 
  '# Multi-Agent Orchestration\n\nOne agent is powerful; a team of agents is revolutionary. Learn how to build "Crew" systems where agents specialize in different roles.\n\n### Frameworks:\n- CrewAI\n- AutoGen\n- LangGraph'
),
(
  '00000000-0000-0000-0000-000000000000', 
  8, 
  'Deployment & Production CI/CD', 
  '# Deployment and Scale\n\nTaking an agent from your laptop to the cloud. We discuss latency, costs, and monitoring agent reliability.\n\n### Checklist:\n- Rate limiting.\n- Cost tracking (Token usage).\n- Safety guardrails (Human-in-the-loop).'
)
ON CONFLICT (book_id, chapter_number) DO UPDATE SET 
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md;
