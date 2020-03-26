export const formatDate = (date, withTime) => {
  const dateObj = new Date(date);

  const zeroFill = num => (num > 9 ? num : "0" + num);

  if (withTime) {
    return (
      zeroFill(dateObj.getHours()) +
      ":" +
      zeroFill(dateObj.getMinutes()) +
      " " +
      zeroFill(dateObj.getDate()) +
      "/" +
      zeroFill(dateObj.getMonth() + 1) +
      "/" +
      dateObj.getFullYear()
    );
  }

  return (
    zeroFill(dateObj.getDate()) +
    "/" +
    zeroFill(dateObj.getMonth() + 1) +
    "/" +
    dateObj.getFullYear()
  );
};
