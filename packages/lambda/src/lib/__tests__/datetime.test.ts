import { getDateFromISOString, getDateFromUnix } from '../datetime';

describe('Datetime functions', () => {
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
});
