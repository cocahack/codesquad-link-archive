import * as moment from 'moment';

export const getDateFromUnix = (timestamp: string | number) =>
  moment.unix(Number(timestamp)).format('YYYY-MM-DD');

export const getDateFromISOString = (isoString: string) =>
  moment(isoString).format('YYYY-MM-DD');
