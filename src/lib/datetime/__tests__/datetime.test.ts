import { checkDateFormat, getDateFromISOString, getDateFromUnix } from '../index';

describe('Datetime functions - Timezone: Asia/Seoul', () => {
  describe('Function: getDateFromUnix', () => {
    it('should return date string', function() {
      const ts = '1584055000.059800';
      const actual = '2020-03-13';

      expect(getDateFromUnix(ts)).toEqual(actual);
    });
  });

  describe('Function: getDateFromISOString', () => {
    it('should return correct Date', function() {
      const isoString = '2020-03-16T22:50:57.093Z';
      const actual = '2020-03-17';

      expect(getDateFromISOString(isoString)).toEqual(actual);
    });
  });

  describe('Function: checkDateFormat', () => {
    it('should return true when a string of date is valid', () => {
      const validString = '2020-03-01';

      expect(checkDateFormat(validString)).toBeTruthy();
    });

    it('should return false when a string is invalid', () => {
      const invalidString = 'test';

      expect(checkDateFormat(invalidString)).not.toBeTruthy();
    });
  });
});
