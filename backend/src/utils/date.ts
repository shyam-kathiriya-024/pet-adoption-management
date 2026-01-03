import dayjs, { extend } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend dayjs with plugins
extend(customParseFormat);

const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
const ISO_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DISPLAY_FORMAT = "DD-MM-YYYY";
const DATE_FORMAT = "YYYY-MM-DD";
const TIME_FORMAT = "hh:mm A";
const SHORT_TIME_FORMAT = "HH:mm";
const SHORT_DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";
const FULL_DATE_FORMAT = "MMM DD, YYYY";
const YEAR_FORMAT = "YYYY";
const MONTH_FORMAT = "MM";

interface IDateOptions {
  date?: string;
  time?: string;
  amount?: number;
  unit?: dayjs.ManipulateType;
  start?: boolean;
  end?: boolean;
  format?: string;
  is_dayjs?: boolean;
  past?: boolean;
  future?: boolean;
  day?: boolean;
}

/**
 * Returns the current ISO date-time date.
 * @returns {Date} ISO Date of current date and time.
 */
const currentIsoDate = (): Date => {
  return new Date(dayjs().toISOString());
};

/**
 * Returns the current ISO date-time string.
 * @returns {string} ISO string of current date and time.
 */
const currentIsoDateString = (): string => {
  return dayjs().toISOString();
};

/**
 * Returns the ISO date for the start of the current day.
 * @returns {Date} ISO Date of start of the current day.
 */
const currentIsoStartDate = (): Date => {
  return new Date(dayjs().startOf("day").toISOString());
};

/**
 * Returns the current date formatted as `DATE_TIME_FORMAT`.
 * @returns {string} Formatted date string.
 */
const currentIsoDateFormat = (): string => {
  return dayjs().format(DATE_TIME_FORMAT);
};

/**
 * Combines a date and time string into a single string.
 * @param date - Date string in `YYYY-MM-DD` format.
 * @param time - Optional time string.
 * @returns {string} Combined date and time string.
 */
const combineDate = ({ date, time }: { date: string; time?: string }): string => {
  return `${date}${time ? " " + time.trim() : ""}`;
};

/**
 * Calculates a date with various options.
 *
 * @param date - Optional base date.
 * @param time - Optional base time.
 * @param amount - Amount to add/subtract.
 * @param unit - Unit of time (e.g. "day", "month").
 * @param start - If true, gets the start of the day.
 * @param end - If true, gets the end of the day.
 * @param format - Custom format for parsing. This format is not an output format but it is a format which define the format of your input to this function via "date" param.
 * @param past - If true, clamps to current date if result is in the future.
 * @param future - If true, clamps to current date if result is in the past.
 * @param day - If true, adds the day of the week in `day_format`.
 * @returns Object with various date formats and the dayjs instance.
 */
const getDate = ({ date, time, amount, unit, start, end, format, past, future, day }: IDateOptions = {}) => {
  let value =
    format && date
      ? dayjs(combineDate({ date, time }), format || (time ? SHORT_DATE_TIME_FORMAT : DATE_FORMAT))
      : dayjs(date ? combineDate({ date, time }) : undefined);

  if (!value.isValid()) {
    throw new Error(
      `Invalid date provided. Input: date="${date}", time="${time}", format="${format}". Please ensure the date string and format are correct.`,
    );
  }

  if (amount && unit) value = value.add(amount, unit);

  if (start) value = value.startOf("day");
  if (end) value = value.endOf("day");

  const current = dayjs();
  if (past && value.isAfter(current)) value = current;
  if (future && value.isBefore(current)) value = current;

  let day_format;
  if (day) day_format = value.format("dddd");

  return {
    dayjs: value,
    iso: value.toISOString(),
    date: value.toDate(),
    format: formatDayjsDate(value),
    short_format: shortFormatDayjsDate(value),
    display_format: displayFormatDayjsDate(value),
    time_format: formatDayjsTime(value),
    day_format,
    short_time_format: shortFormatDayjsTime(value),
    timestamp_range: {
      gte: value.startOf("second").toISOString(),
      lt: value.add(1, "second").startOf("second").toISOString(),
    },
  };
};

/**
 * Parses and optionally modifies a time string.
 *
 * @param time - Time string in `SHORT_TIME_FORMAT`.
 * @param amount - Amount to add to time.
 * @param unit - Unit of time (e.g. "minute", "hour").
 * @returns Object with various time formats.
 */
const getTime = ({ time, amount, unit }: { time: string; amount?: number; unit?: dayjs.ManipulateType }) => {
  let value = dayjs(time.trim(), SHORT_TIME_FORMAT);
  if (amount && unit) value = value.add(amount, unit);

  return {
    dayjs: value,
    iso: value.toISOString(),
    format: formatDayjsTime(value),
    short_format: shortFormatDayjsTime(value),
  };
};

/**
 * Formats a Dayjs object into full date-time format.
 * @param date - A dayjs object.
 * @returns {string} Formatted date.
 */
const formatDayjsDate = (date: dayjs.Dayjs = dayjs()): string => {
  return date.format(DATE_TIME_FORMAT);
};

/**
 * Formats a Dayjs object into short date format.
 * @param date - A dayjs object.
 * @returns {string} Short formatted date.
 */
const shortFormatDayjsDate = (date: dayjs.Dayjs = dayjs()): string => {
  return date.format(DATE_FORMAT);
};

/**
 * Formats a Dayjs object into display date format.
 * @param date - A dayjs object.
 * @returns {string} Display formatted date.
 */
const displayFormatDayjsDate = (date: dayjs.Dayjs = dayjs()): string => {
  return date.format(DISPLAY_FORMAT);
};

/**
 * Formats a Dayjs object into 12-hour time format.
 * @param date - A dayjs object.
 * @returns {string} Time in 12-hour format.
 */
const formatDayjsTime = (date: dayjs.Dayjs = dayjs()): string => {
  return date.format(TIME_FORMAT);
};

/**
 * Formats a Dayjs object into 24-hour short time format.
 * @param date - A dayjs object.
 * @returns {string} Time in 24-hour format.
 */
const shortFormatDayjsTime = (date: dayjs.Dayjs = dayjs()): string => {
  return date.format(SHORT_TIME_FORMAT);
};

/**
 * Formats a date or current date using a specified format string.
 *
 * @param date - A dayjs object (optional).
 * @param format - Format string.
 * @returns {string} Formatted date string.
 */
const formatDate = ({ date, format }: { date?: dayjs.Dayjs; format: string }): string => {
  return (date ?? dayjs()).format(format);
};

export {
  currentIsoDate,
  currentIsoDateFormat,
  currentIsoDateString,
  currentIsoStartDate,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  formatDate,
  FULL_DATE_FORMAT,
  getDate,
  getTime,
  ISO_DATE_FORMAT,
  MONTH_FORMAT,
  SHORT_DATE_TIME_FORMAT,
  SHORT_TIME_FORMAT,
  TIME_FORMAT,
  YEAR_FORMAT,
};
