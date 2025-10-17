export interface SeoFactor {
  score: number;
  analysis: string;
  recommendation: string;
}

export interface OnPageSeo {
  titleTag: SeoFactor;
  metaDescription: SeoFactor;
  headings: SeoFactor;
  contentQuality: SeoFactor;
  keywordUsage: SeoFactor;
  imageSeo: SeoFactor;
}

export interface TechnicalSeo {
  mobileFriendliness: SeoFactor;
  urlStructure: SeoFactor;
  schemaMarkup: SeoFactor;
  httpsRedirect: SeoFactor;
  robotsTxt: SeoFactor;
}

export interface PerformanceSeo {
    coreWebVitals: SeoFactor;
    siteSpeed: SeoFactor;
    assetOptimization: SeoFactor;
    cachingPolicy: SeoFactor;
}

export interface Backlinks {
    backlinkProfileStrength: SeoFactor;
    domainAuthorityEstimation: SeoFactor;
}

export interface SocialPresence {
    socialLinks: SeoFactor;
    openGraphTags: SeoFactor;
}

export interface Recommendation {
  text: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

export interface SeoReportData {
  overallScore: number;
  onPageSeo: OnPageSeo;
  technicalSeo: TechnicalSeo;
  performanceSeo: PerformanceSeo;
  backlinks: Backlinks;
  socialPresence: SocialPresence;
  recommendations: Recommendation[];
}