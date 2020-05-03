import * as moment from 'moment-timezone';

const timezone = 'Asia/Seoul';

export const getDateFromUnix = (timestamp: string | number) =>
  moment.unix(Number(timestamp)).tz(timezone).format('YYYY-MM-DD');

export const getDateFromISOString = (isoString: string) =>
  moment(isoString).tz(timezone).format('YYYY-MM-DD');

export const checkDateFormat = (subject: string): boolean => moment(subject, 'YYYY-MM-DD', true).isValid();
