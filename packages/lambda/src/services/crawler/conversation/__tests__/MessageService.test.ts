import MessageService from 'packages/lambda/src/services/crawler/conversation/MessageService';
import MessageDao from 'packages/lambda/src/services/crawler/conversation/MessageDao';
import { WebClient } from '@slack/web-api';
import {
  combinedMessage,
  furledMessage,
  unfurledMessage,
} from 'packages/lambda/src/services/crawler/conversation/__mocks__/SlackMessageData';

jest.mock('../MessageDao');
jest.mock('@slack/web-api');

describe('MessageService', () => {
  let messageService;
  let messageDao;

  beforeAll(() => {
    messageDao = new MessageDao(new WebClient());
    messageService = new MessageService(messageDao);
  });

  it('should return links', async () => {
    const messages = [combinedMessage, unfurledMessage, furledMessage];
    messageDao.findAll = jest.fn().mockReturnValueOnce(messages);

    const links = await messageService.getLists('test channel');

    expect(links.length).toEqual(5);
    links.forEach(link => {
      expect(link.url).toBeDefined();
    });
  });
});
