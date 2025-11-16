export enum Feature {
    DeepResearch = 'DEEP_RESEARCH',
    Interpellation = 'INTERPELLATION',
    SpeechCorrection = 'SPEECH_CORRECTION',
    PositionPaperCorrection = 'POSITION_PAPER_CORRECTION',
    TopicBreakdown = 'TOPIC_BREAKDOWN',
    CreateImage = 'CREATE_IMAGE',
    DeepThinking = 'DEEP_THINKING',
    ContentAnalysis = 'CONTENT_ANALYSIS',
}

export interface ResearchResult {
    uri: string;
    title: string;
    description: string;
}