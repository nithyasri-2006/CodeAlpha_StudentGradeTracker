
export interface Student {
  id: string;
  name: string;
  grade: number;
  subject: string;
  date: string;
}

export interface GradeStats {
  average: number;
  highest: number;
  lowest: number;
  total: number;
}

export interface AIInsights {
  summary: string;
  recommendations: string[];
  performanceLevel: 'Needs Improvement' | 'Satisfactory' | 'Exemplary';
}
