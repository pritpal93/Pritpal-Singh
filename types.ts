export type Language = 
  | 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' 
  | 'pt' | 'ru' | 'it' | 'ko' | 'hi' | 'ar' 
  | 'tr' | 'nl' | 'pl' | 'vi' | 'th' | 'id'
  | 'sv' | 'el';

export interface TimelineEvent {
  label: string;
  description: string;
  timeEstimate: string;
}

export interface Scenario {
  id: string;
  name: string;
  tagline: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  steps: string[];
  timeline: TimelineEvent[];
  pros: string[];
  cons: string[];
}

export interface SolutionData {
  title: string;
  summary: string;
  immediateAction: string;
  scenarios: Scenario[];
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export interface UserInput {
  problem: string;
  goal?: string;
  constraints?: string;
}

export interface TuningParams {
  riskTolerance: number; // 0-100
  velocity: number; // 0-100
  innovation: number; // 0-100
}

export enum ProblemType {
  PERSONAL = 'Personal',
  WORK = 'Work',
  MONEY = 'Money',
  DECISION = 'Decision',
  OTHER = 'Other'
}