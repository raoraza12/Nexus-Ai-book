export interface ChapterContent {
  title: string;
  markdown: string;
}

export const ELITE_BOOK_CONTENT: Record<number, ChapterContent> = {
  1: {
    title: "The LLM Engine (Control & Precision)",
    markdown: `
# 1.1 The Science of Parameters: Control & Precision

Junior developers treat LLM parameters as "vibe modifiers." Senior Architects treat them as **deterministic control knobs** for probabilistic systems.

## Under the Hood: The Logit Sampling Mechanics
When an LLM generates text, it doesn't "know" words; it calculates a probability distribution over its entire vocabulary (Tokens). The raw scores (Logits) are passed through a **Softmax function** to generate probabilities. This is where your parameters intervene.

### 1.2 Professional Parameters: The Pro-Grade Comparison

| Parameter | Function | Pro-Tip: When to Use | Critical Warning |
|:---|:---|:---|:---|
| **Temperature** | Flattens or sharpens the probability distribution. | Use **0.0 for RAG** & Structured Data. Use **0.7+ for creative writing.** | High temperature (1.2+) in JSON tasks results in malformed tags. |
| **Top-P (Nucleus)** | Limits sampling to a cumulative probability "mass." | Better than Temp for maintaining "quality" in long-form generation. | Don't tune both Temp and Top-P simultaneously unless you want chaotic results. |
| **Top-K** | Limits sampling to the top *K* most likely tokens. | Use for keeping agents "on track" in specialized domains. | Setting K too low (e.g., < 10) causes the model to sound repetitive. |
| **Seed** | Forces the backend to use the same random noise. | Mandatory for **Unit Testing** and Reproducible Workflows. | Note: "Deterministic" is never 100% in multi-node GPU clusters. |

### Context Engineering: Structure vs. Length
**"Lost in the Middle" Phenomenon:** Models lose accuracy when critical info is in the center of a massive context window. 
- **Senior Move:** Prioritize "Needle in a Haystack" placement. Put core instructions at the **END** of the prompt for Recency Bias.

## Prompt Engineering (Senior Level)
Stop teach "Act as a...". Use **Few-Shot Prompting** and **Chain-of-Thought (CoT)**.

### Structured Output: The Pydantic Way
Never use "Give me JSON." Use Structured Outputs or Pydantic parsers.
\`\`\`python
# Senior Approach: Structured Output
class Analysis(BaseModel):
    sentiment: str
    confidence_score: float
    entities: List[str]

# Pass this to the model as a tool/schema
\`\`\`

## Junior vs Senior Perspective
> [!NOTE]
> **Junior:** Thinks high temperature makes the AI "smarter."
> **Senior:** Knows high temperature increases entropy, which is the enemy of production reliability.

---

## Production-Ready Code: The Precision Controller
\`\`\`python
import openai
from pydantic import BaseModel

class CodeReview(BaseModel):
    security_risk: bool
    efficiency_score: int
    refactor_suggestion: str

def get_expert_review(code_snippet):
    # Setting Temperature to 0.0 for technical reliability
    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a Senior Security Architect."},
            {"role": "user", "content": f"Review this: {code_snippet}"}
        ],
        response_format=CodeReview,
        temperature=0.0, # The Senior Choice
        seed=42 # For reproducibility
    )
    return response.choices[0].message.parsed
\`\`\`
`
  },
  2: {
    title: "Context Engineering & Data Injection",
    markdown: `
# 2.1 RAG Architecture: Retrieval vs. Long-Context

Junior developers think "Just dump it into the context window." Seniors understand the **Tokenomics** and **Retrieval Precision**.

## The RAG Pipeline: Under the Hood
1. **Extraction:** Cleaning raw PDFs/HTML.
2. **Chunking:** The art of "Contextual Preservation."
3. **Embedding:** Mapping text to high-dimensional vectors.
4. **Vector Search:** Finding the "Nearest Neighbors."

### Chunking Strategies
- **Recursive Character Split:** Good for general text.
- **Semantic Chunking:** Splits based on meaning changes (using LLM or embeddings).
- **Overlapping:** Always keep 10-15% overlap to maintain context between chunks.

| Strategy | Speed | Context Retention | Best For |
|:---|:---|:---|:---|
| Fixed-Size | High | Low | Simple Keyword Search |
| Semantic | Low | High | Complex Legal/Medical |
| Parent-Child | Medium | Very High | Large Technical Docs |

## Long Context vs. RAG: When to use what?
> [!WARNING]
> **Token Cost is Real.** A 128k context window isn't free. 
> 1. Use **Long Context** for global synthesis (e.g., "Summarize this whole book").
> 2. Use **RAG** for precision extraction (e.g., "Find the specific API call on page 42").

## Junior vs Senior Perspective
> [!IMPORTANT]
> **Junior:** Asks "Which Vector DB is the best?"
> **Senior:** Asks "How is the data being pre-processed and evaluated?" (RAG is 80% data cleaning).
`
  },
  3: {
    title: "Building Autonomous Agents (The Mastery)",
    markdown: `
# 3.1 The ReAct Logic: Reason + Act

Agents are not just "Automated Prompts." They are **Iterative Decision Engines.**

## The Agentic Loop
1. **Thought:** "I need to find the user's weather."
2. **Action:** Call \`get_weather(city="London")\`.
3. **Observation:** "It is raining."
4. **Final Response:** "It's raining in London, take an umbrella."

### Tool Integration (Function Calling)
Function calling isn't the model executing code; it's the model **predicting the JSON arguments** for your code to execute.

\`\`\`python
# Senior-Grade Tool Definition (LangChain Style)
from langchain.tools import tool

@tool
def research_topic(query: str):
    """Search the web for deep technical insights on a specific topic."""
    # Logic to call Serper or Brave Search
    return "Consolidated technical findings..."
\`\`\`

## Multi-Agent Orchestration
Building a team (Researcher + Writer + Reviewer). Use **CrewAI** or **LangGraph**.

### Senior Edge Case: The Infinite Loop
> [!CAUTION]
> **The Hallucination Loop:** When an agent gets an error from a tool and replies with the same wrong input. 
> **Senior Solution:** Implement a \`max_iterations=5\` limit and a "Self-Correction" prompt.

## Junior vs Senior Perspective
> [!NOTE]
> **Junior:** Thinks agents are "Auto-GPT" magic.
> **Senior:** Knows agents require strict monitoring, cost-caps, and human-in-the-loop triggers for high-stakes actions.
`
  }
};
