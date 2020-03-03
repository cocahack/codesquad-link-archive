import { Channel } from "../Channel";
import ChannelService from "../ChannelService";
import ChannelDao from "../ChannelDao";
import { WebClient } from "@slack/web-api";
jest.mock('../ChannelDao');
jest.mock('@slack/web-api');

describe('ChannelService', () => {

  let channelService;
  let channelDao;

  beforeAll(() => {
    channelDao = new ChannelDao(new WebClient());
    channelService = new ChannelService(channelDao);
  });

  it('should return lists of refined channels', async () => {
    channelDao.findAll = jest.fn().mockReturnValueOnce(slackChannelTestData);
    const channelLists = await channelService.getLists();

    channelLists.forEach((channel) => {
      expect(channel).toBeInstanceOf(Channel);
    });
  });

});

const slackChannelTestData = [
  {
    "id": "ZZ412498Z",
    "name": "Test Channel",
    "is_channel": true,
    "created": 1566884035,
    "is_archived": false,
    "is_general": false,
    "unlinked": 0,
    "creator": "YY442234Y",
    "name_normalized": "Test Channel",
    "is_shared": false,
    "is_org_shared": false,
    "is_member": true,
    "is_private": false,
    "is_mpim": false,
    "members": [
      "AA123456A",
      "BB456789B",
    ],
    "topic": {
      "value": "topic",
      "creator": "CC0139412C",
      "last_set": 1567495189
    },
    "purpose": {
      "value": "purpose",
      "creator": "DD598234D",
      "last_set": 1567495167
    },
    "previous_names": [

    ],
    "num_members": 19
  },
];