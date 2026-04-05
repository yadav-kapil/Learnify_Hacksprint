const LIMIT = 3;

export const getUsage = () => {
  const today = new Date().toDateString();

  const data = JSON.parse(localStorage.getItem("ai_usage")) || {
    count: 0,
    date: today,
  };

  // reset if new day
  if (data.date !== today) {
    const resetData = { count: 0, date: today };
    localStorage.setItem("ai_usage", JSON.stringify(resetData));
    return resetData;
  }

  return data;
};

export const canAsk = () => {
  const data = getUsage();
  return data.count < LIMIT;
};

export const incrementUsage = () => {
  const data = getUsage();
  data.count += 1;
  localStorage.setItem("ai_usage", JSON.stringify(data));
};

export const getRemaining = () => {
  const data = getUsage();
  return LIMIT - data.count;
};