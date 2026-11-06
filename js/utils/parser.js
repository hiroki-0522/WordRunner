export function parseMemo(memo) {
  const errors = [];
  const cards = [];
  const blocks = memo.replace(/\r/g, '').split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  if (!blocks.length && memo.trim()) errors.push('カードを解析できません。');
  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(line => line.trim());
    if (lines.length !== 2 || !lines[0].startsWith('Q：') || !lines[1].startsWith('A：')) {
      errors.push(`${index + 1}枚目の書式が正しくありません（Q：とA：を使用してください）。`); return;
    }
    const question = lines[0].slice(2).trim(); const answer = lines[1].slice(2).trim();
    if (!question || !answer) errors.push(`${index + 1}枚目の問題または答えが空です。`);
    else cards.push({ id: `${index}-${question}`, question, answer, order: index });
  });
  return { cards, errors };
}
export const template = 'Q：\nA：\n\n';
