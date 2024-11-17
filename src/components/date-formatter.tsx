export const DateFormatter = ({ timestamp }) => {
  const formatDate = (ts) => {
    try {
      if (!ts) return "N/A";

      const timeMs = typeof ts === "string" ? parseInt(ts, 10) : ts;

      if (isNaN(timeMs)) return "Invalid Date";

      const date = new Date(timeMs);

      if (date.toString() === "Invalid Date") return "Invalid Date";

      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error";
    }
  };

  return <p className="text-sm">Deactivated at: {formatDate(timestamp)}</p>;
};
