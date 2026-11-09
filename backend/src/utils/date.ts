const getIndianTime = () => {
  const options = { timeZone: "Asia/Kolkata", hour12: false };
  const timestamp = new Date().toLocaleString("en-IN", options);
  return timestamp;
};

export default getIndianTime;