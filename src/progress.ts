const KEY = 'ai-course-progress-v1';

export type Progress = Record<string, boolean>;

export function loadProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function markComplete(slug: string) {
  const p = loadProgress();
  p[slug] = true;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event('progress-update'));
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('progress-update'));
}
