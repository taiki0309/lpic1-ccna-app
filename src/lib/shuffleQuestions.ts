export interface ShufflableQuestion {
  id: string | number;
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * 問題リストをランダムシャッフルし、さらに各問題の選択肢（A〜D）の順序および正解インデックスもシャッフルする
 */
export function shuffleQuestions<T extends ShufflableQuestion>(questions: T[]): T[] {
  if (!questions || questions.length === 0) return [];

  // 1. 各問題の選択肢順序をシャッフル
  const processed = questions.map((q) => {
    if (!q.choices || q.choices.length < 2) return { ...q };

    // インデックス配列 [0, 1, 2, 3...] をシャッフル
    const indices = q.choices.map((_, idx) => idx);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const newChoices = indices.map((idx) => q.choices[idx]);
    const newCorrectIndex = indices.indexOf(q.correctIndex);

    return {
      ...q,
      choices: newChoices,
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    };
  });

  // 2. 問題自体の出題順序をシャッフル (Fisher-Yates)
  const shuffled = [...processed];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
