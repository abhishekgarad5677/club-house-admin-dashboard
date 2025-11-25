import { useMemo } from "react";

// Custom hook to generate unique id
export const generateUID = () =>
  "uid-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

// Custom hook to format date
export const useFormattedDate = (isoString) => {
  return useMemo(() => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [isoString]);
};

export const formatDateToReadableString = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  // Options for formatting
  const options = {
    year: "numeric",
    month: "short", // e.g. Oct
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Set to false for 24-hour format
  };

  return date.toLocaleString("en-US", options);
};
