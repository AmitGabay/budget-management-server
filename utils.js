export const trimText = (expenses) => {
  return expenses.map(({ date, data }) => ({
    date,
    data: data.map(({ card, category, sum }) => ({
      sum,
      category: category.trim(),
      card: card.trim(),
    })),
  }));
};
