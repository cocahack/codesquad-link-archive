import UserService from '../UserService';
import UserDao from '../UserDao';
import { WebClient } from '@slack/web-api';
import { User } from 'model/User';

jest.mock('../UserDao');
jest.mock('@slack/web-api');

describe('UserService', () => {
  let userService;
  let userDao;

  beforeAll(() => {
    userDao = new UserDao(new WebClient());
    userService = new UserService(userDao);
  });

  it('should return lists of refined users', async () => {
    userDao.findAll = jest.fn().mockReturnValueOnce(slackUserTestData);
    const userLists = await userService.getLists();

    userLists.forEach(user => {
      expect(user).toBeInstanceOf(User);
    });
  });
});

const slackUserTestData = [
  {
    id: 'AA612312A',
    team_id: 'CAS3k4K!',
    name: 'Normal User',
    deleted: false,
    color: '9f69e7',
    real_name: 'Normal User',
    tz: 'Asia/Seoul',
    tz_label: 'Korea Standard Time',
    tz_offset: 32400,
    profile: {
      title: 'Master',
      phone: '',
      skype: '',
      real_name: 'User',
      real_name_normalized: 'user',
      display_name: 'User',
      display_name_normalized: 'User',
      status_text: 'Working remotely',
      status_emoji: ':house_with_garden:',
      status_expiration: 0,
      avatar_hash: 'testhash',
      is_custom_image: true,
      email: 'user@test.dev',
      first_name: 'Normal',
      last_name: 'User',
      status_text_canonical: 'Working remotely',
      team: 'T74H5245A',
    },
    is_admin: true,
    is_owner: true,
    is_primary_owner: true,
    is_restricted: false,
    is_ultra_restricted: false,
    is_bot: false,
    is_app_user: false,
    updated: 1577190244,
  },
];
