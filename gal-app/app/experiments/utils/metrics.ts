/**
 * Text Quality Metrics Calculator
 * Calculates coherence, readability, completeness, and structure scores for LLM responses
 */

interface MetricsResult {
  coherence: number;
  readability: number;
  completeness: number;
  structure: number;
  overall: number;
}

/**
 * Calculate text quality metrics
 */
export function calculateMetrics(text: string, prompt: string): MetricsResult {
  const coherence = calculateCoherence(text);
  const readability = calculateReadability(text);
  const completeness = calculateCompleteness(text, prompt);
  const structure = calculateStructure(text);
  
  const overall = (coherence + readability + completeness + structure) / 4;
  
  return {
    coherence: Math.round(coherence),
    readability: Math.round(readability),
    completeness: Math.round(completeness),
    structure: Math.round(structure),
    overall: Math.round(overall * 100) / 100
  };
}

/**
 * Coherence: Measures logical flow and topic consistency
 * Based on: transition words, sentence connectivity, repetition, topic consistency
 */
function calculateCoherence(text: string): number {
  if (!text || text.length < 10) return 30;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return 50;
  
  // Transition words score (higher = better flow)
  const transitionWords = [
    'however', 'therefore', 'moreover', 'furthermore', 'additionally', 'consequently',
    'thus', 'hence', 'meanwhile', 'subsequently', 'similarly', 'likewise',
    'first', 'second', 'third', 'finally', 'in conclusion', 'in summary',
    'for example', 'for instance', 'specifically', 'in particular'
  ];
  
  const transitionCount = transitionWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (text.match(regex) || []).length;
  }, 0);
  
  const transitionScore = Math.min(100, (transitionCount / sentences.length) * 30 + 40);
  
  // Sentence length variation (consistency)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
  const consistencyScore = Math.max(0, 100 - (variance / avgLength) * 20);
  
  // Repetition penalty (check for excessive word repetition)
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 3) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });
  
  const maxRepetition = Math.max(...Object.values(wordFreq));
  const repetitionPenalty = Math.max(0, 100 - (maxRepetition / words.length) * 200);
  
  // Combine scores
  const coherence = (transitionScore * 0.4 + consistencyScore * 0.3 + repetitionPenalty * 0.3);
  return Math.min(100, Math.max(0, coherence));
}

/**
 * Readability: Based on Flesch Reading Ease and sentence structure
 * Higher score = easier to read
 */
function calculateReadability(text: string): number {
  if (!text || text.length < 10) return 30;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 50;
  
  // Average sentence length (fewer words per sentence = better)
  const avgSentenceLength = words.length / sentences.length;
  const sentenceLengthScore = Math.max(0, 100 - (avgSentenceLength - 15) * 2);
  
  // Average word length (shorter words = better)
  const avgWordLength = words.reduce((sum, word) => sum + word.replace(/[^\w]/g, '').length, 0) / words.length;
  const wordLengthScore = Math.max(0, 100 - (avgWordLength - 4.5) * 10);
  
  // Syllable approximation (1-2 syllables per word = better)
  const syllableCount = words.reduce((sum, word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length <= 3) return sum + 1;
    return sum + cleanWord.replace(/[aeiouy]+/g, ' ').split(' ').filter(s => s).length;
  }, 0);
  const avgSyllables = syllableCount / words.length;
  const syllableScore = Math.max(0, 100 - (avgSyllables - 1.5) * 30);
  
  // Punctuation usage (proper punctuation = better)
  const punctuationCount = (text.match(/[.,;:!?]/g) || []).length;
  const punctuationScore = Math.min(100, (punctuationCount / sentences.length) * 20);
  
  // Combine scores (Flesch-like formula)
  const readability = (
    sentenceLengthScore * 0.3 +
    wordLengthScore * 0.3 +
    syllableScore * 0.2 +
    punctuationScore * 0.2
  );
  
  return Math.min(100, Math.max(0, readability));
}

/**
 * Completeness: Evaluates how thoroughly the prompt was addressed
 * Based on: response length, content depth, keyword coverage
 */
function calculateCompleteness(text: string, prompt: string): number {
  if (!text || text.length < 10) return 20;
  
  // Length score (adequate response length)
  const textLength = text.split(/\s+/).length;
  const promptLength = prompt.split(/\s+/).length;
  const lengthRatio = textLength / Math.max(promptLength, 1);
  
  // Good responses are 2-10x longer than prompt
  let lengthScore = 100;
  if (lengthRatio < 1) lengthScore = 30;
  else if (lengthRatio < 2) lengthScore = 50 + (lengthRatio - 1) * 20;
  else if (lengthRatio > 15) lengthScore = 100 - (lengthRatio - 15) * 2;
  
  // Keyword coverage (extract important words from prompt)
  const promptWords = prompt.toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^\w]/g, ''))
    .filter(w => w.length > 3 && !isCommonWord(w));
  
  const textLower = text.toLowerCase();
  const coveredKeywords = promptWords.filter(word => textLower.includes(word)).length;
  const keywordScore = promptWords.length > 0 
    ? (coveredKeywords / promptWords.length) * 100 
    : 70;
  
  // Content depth (paragraphs, lists, explanations)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const hasLists = /^[\s]*[-*•]\s|^\d+\.\s/m.test(text);
  const hasQuestions = text.includes('?');
  const hasExplanations = text.match(/because|since|due to|as a result/gi)?.length || 0;
  
  const depthScore = Math.min(100, 
    paragraphs.length * 15 + 
    (hasLists ? 10 : 0) + 
    (hasQuestions ? 5 : 0) + 
    Math.min(20, hasExplanations * 5)
  );
  
  // Combine scores
  const completeness = (
    lengthScore * 0.4 +
    keywordScore * 0.3 +
    depthScore * 0.3
  );
  
  return Math.min(100, Math.max(0, completeness));
}

/**
 * Structure: Analyzes formatting, paragraphs, and organization
 * Based on: paragraph structure, headings, formatting, organization
 */
function calculateStructure(text: string): number {
  if (!text || text.length < 10) return 30;
  
  // Paragraph count and structure
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphScore = Math.min(100, paragraphs.length * 15 + 30);
  
  // Heading/formatting detection (bold, italic, markdown headers)
  const hasHeadings = /^#{1,6}\s|^\*\*.*\*\*|^__.*__/m.test(text);
  const hasBold = /\*\*.*?\*\*|__.*?__/g.test(text);
  const hasFormatting = hasHeadings || hasBold;
  const formattingScore = hasFormatting ? 90 : 60;
  
  // List structure
  const hasLists = /^[\s]*[-*•]\s|^\d+\.\s/m.test(text);
  const listScore = hasLists ? 85 : 60;
  
  // Sentence structure variety
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceTypes = {
    declarative: (text.match(/\./g) || []).length,
    interrogative: (text.match(/\?/g) || []).length,
    exclamatory: (text.match(/!/g) || []).length
  };
  const varietyScore = Math.min(100, 
    50 + 
    (sentenceTypes.interrogative > 0 ? 15 : 0) +
    (sentenceTypes.exclamatory > 0 ? 10 : 0) +
    (sentenceTypes.declarative > 3 ? 25 : sentenceTypes.declarative * 5)
  );
  
  // Organization (transitions, flow)
  const hasIntro = /introduction|overview|summary|in summary/i.test(text.substring(0, 200));
  const hasConclusion = /conclusion|in conclusion|to summarize|in summary/i.test(text.substring(text.length - 200));
  const organizationScore = (hasIntro ? 10 : 0) + (hasConclusion ? 10 : 0) + 70;
  
  // Combine scores
  const structure = (
    paragraphScore * 0.25 +
    formattingScore * 0.25 +
    listScore * 0.15 +
    varietyScore * 0.15 +
    organizationScore * 0.2
  );
  
  return Math.min(100, Math.max(0, structure));
}

/**
 * Check if word is a common/stop word
 */
function isCommonWord(word: string): boolean {
  const commonWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
    'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
    'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
  ];
  return commonWords.includes(word.toLowerCase());
}


