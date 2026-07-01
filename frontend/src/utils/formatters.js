export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};
export const formatScore = (correct, total) => {
  if (!total) return "0%";
  return `${Math.round((correct / total) * 100)}%`;
};
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
export const truncate = (str, maxLength = 80) =>
  str?.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
