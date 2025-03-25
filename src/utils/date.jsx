import moment from "moment";
const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export const convertToThaiLocalTimeRange = (startIso, endIso) => {
  if (!startIso || !endIso) return `08:00 น. - 16:00 น.`;
  const startTime = moment(startIso).utcOffset("+07:00").format("HH:mm");

  const endTime = moment(endIso).utcOffset("+07:00").format("HH:mm");

  return `${startTime} น. - ${endTime} น.`;
};

export const convertToThaiFullDateWithTime = (isoDate) => {
  if (!isoDate) return null;
  // Get moment object with UTC offset of +7 (Thai time zone)
  const date = moment(isoDate).utcOffset("+07:00");

  // Format the date part: day, month, and year
  const day = date.format("D");
  const monthIndex = date.month(); // Get the index of the month (0-11)
  const year = date.format("YYYY");

  // Get formatted time: HH:mm
  const time = date.format("HH:mm");

  // Map the English month name to Thai month name
  const monthInThai = thaiMonths[monthIndex];

  // Return the full formatted string in Thai format
  return `${day} ${monthInThai} ${year} เวลา ${time} น.`;
};
