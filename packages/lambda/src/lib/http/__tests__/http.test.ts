import { getCookie } from "../index";

describe('Module: Http', () => {
  const cookieString = 'TOKEN=TEST; SESSIONID=ABCD';

  it('should return Cookie value when key given', () => {
    expect(getCookie(cookieString, 'TOKEN')).toEqual('TEST');
    expect(getCookie(cookieString, 'SESSIONID')).toEqual('ABCD');
    expect(getCookie(cookieString, 'NONEXIST')).toBeNull();
  });

});
