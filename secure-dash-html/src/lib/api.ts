const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type ModelType = 'nb' | 'lr' | 'both';

export type PredictionResult = {
  prediction: 'spam' | 'ham';
  confidence: number;
  model: 'NaiveBayes' | 'LogisticRegression';
};

export type PredictionResponse = PredictionResult | {
  results: PredictionResult[];
  agreement: boolean;
};

export type MetricsResponse = {
  naive_bayes: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
  logistic_regression: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
  totals: {
    scans: number;
    spam: number;
    ham: number;
    avg_confidence: number;
  };
};

export type FeatureImportance = {
  model: string;
  top_features: Array<{
    term: string;
    weight: number;
  }>;
};

export async function predictEmail(text: string, model: ModelType): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'ServerError', message: 'Network error' }));
    throw error;
  }

  return response.json();
}

export async function getMetrics(): Promise<MetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'ServerError', message: 'Failed to fetch metrics' }));
    throw error;
  }

  return response.json();
}

export async function getFeatureImportance(): Promise<FeatureImportance> {
  const response = await fetch(`${API_BASE_URL}/api/feature-importance`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'ServerError', message: 'Failed to fetch feature importance' }));
    throw error;
  }

  return response.json();
}
