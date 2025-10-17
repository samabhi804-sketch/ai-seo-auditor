import { GoogleGenAI, Type } from '@google/genai';
import type { SeoReportData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const seoFactorSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: 'A score from 0 to 100 for this specific SEO factor.',
    },
    analysis: {
      type: Type.STRING,
      description: 'A detailed, in-depth analysis of this factor, explaining its current state and why it matters for SEO.',
    },
    recommendation: {
      type: Type.STRING,
      description: 'A specific, actionable recommendation on how to improve this factor. Include code examples if relevant.',
    },
  },
  required: ['score', 'analysis', 'recommendation'],
};

const recommendationsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING, description: 'The actionable recommendation text.' },
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'The priority of the task.' },
            category: { type: Type.STRING, description: 'The SEO category this recommendation falls under (e.g., On-Page SEO, Performance).' }
        },
        required: ['text', 'priority', 'category'],
    },
    description: 'A list of the top 5 most actionable recommendations to improve the site\'s SEO, prioritized by impact.',
};


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: 'A comprehensive overall SEO score from 0 to 100, calculated based on all factors.',
    },
    onPageSeo: {
      type: Type.OBJECT,
      properties: {
        titleTag: seoFactorSchema,
        metaDescription: seoFactorSchema,
        headings: seoFactorSchema,
        contentQuality: seoFactorSchema,
        keywordUsage: seoFactorSchema,
        imageSeo: seoFactorSchema,
      },
      required: ['titleTag', 'metaDescription', 'headings', 'contentQuality', 'keywordUsage', 'imageSeo'],
    },
    technicalSeo: {
      type: Type.OBJECT,
      properties: {
        mobileFriendliness: seoFactorSchema,
        urlStructure: seoFactorSchema,
        schemaMarkup: seoFactorSchema,
        httpsRedirect: seoFactorSchema,
        robotsTxt: seoFactorSchema,
      },
       required: ['mobileFriendliness', 'urlStructure', 'schemaMarkup', 'httpsRedirect', 'robotsTxt'],
    },
    performanceSeo: {
        type: Type.OBJECT,
        properties: {
            coreWebVitals: seoFactorSchema,
            siteSpeed: seoFactorSchema,
            assetOptimization: seoFactorSchema,
            cachingPolicy: seoFactorSchema,
        },
        required: ['coreWebVitals', 'siteSpeed', 'assetOptimization', 'cachingPolicy'],
    },
    backlinks: {
        type: Type.OBJECT,
        properties: {
            backlinkProfileStrength: seoFactorSchema,
            domainAuthorityEstimation: seoFactorSchema,
        },
        required: ['backlinkProfileStrength', 'domainAuthorityEstimation'],
    },
    socialPresence: {
        type: Type.OBJECT,
        properties: {
            socialLinks: seoFactorSchema,
            openGraphTags: seoFactorSchema,
        },
        required: ['socialLinks', 'openGraphTags'],
    },
    recommendations: recommendationsSchema,
  },
  required: ['overallScore', 'onPageSeo', 'technicalSeo', 'performanceSeo', 'backlinks', 'socialPresence', 'recommendations'],
};

export const analyzeWebsiteSeo = async (url: string): Promise<SeoReportData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Perform an exhaustive SEO audit for the website at this URL: ${url}`,
      config: {
        systemInstruction: `You are a world-class SEO expert with over 20 years of experience. Analyze the provided URL and give an extremely comprehensive SEO review. Your analysis must be thorough, insightful, and highly actionable. Provide your response in the exact JSON format defined by the schema.

The review must cover these 5 pillars of SEO:
1.  **On-Page SEO**: Title Tags, Meta Descriptions, Headings (H1-H6 structure), Content Quality & Relevance, Keyword Usage & Density, Image SEO (alt tags).
2.  **Technical SEO**: Mobile-Friendliness, URL Structure (readability, canonicals), Schema Markup implementation, HTTPS Redirects, and Robots.txt validity.
3.  **Performance**: Core Web Vitals (LCP, INP, CLS), Overall Site Speed, Asset Optimization (image compression, CSS/JS minification), and Browser Caching policies.
4.  **Backlinks**: Provide a qualitative analysis. Since you cannot crawl live backlink data, make a reasonable estimation of the backlink profile strength and domain authority based on the website's niche, brand recognition, and content quality.
5.  **Social Presence**: Check for links to major social media platforms and the implementation of Open Graph tags for optimized social sharing.

For EACH specific factor within these pillars, you MUST provide:
- An accurate **score** from 0 to 100.
- A detailed **analysis** explaining the 'what' and 'why' of the current state.
- A specific, actionable **recommendation** for improvement. For technical items like Schema, provide corrected code examples.

Finally, calculate a fair **overall SEO score** from 0 to 100 and generate a list of the **top 5 most impactful, actionable recommendations**, each with a priority ('High', 'Medium', 'Low') and its corresponding category.

IMPORTANT: Do not browse the live web. Use your existing knowledge to simulate a realistic, expert-level audit as if you had crawled the site and had access to standard SEO tools.`,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as SeoReportData;
  } catch (error)
 {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get SEO analysis from Gemini API.');
  }
};