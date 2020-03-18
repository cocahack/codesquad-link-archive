import MessageFilter from 'packages/lambda/src/services/crawler/conversation/MessageFilter';
import {
  combinedMessage,
  furledMessage,
  messageWrittenByBotAndHasLinks,
  testMessages,
  unfurledMessage,
} from 'packages/lambda/src/services/crawler/conversation/__mocks__/SlackMessageData';

describe('MessageFilter', () => {
  it('should return messages have a link element', () => {
    const messagesHaveLinksIncludeBotMessage = testMessages.filter(message =>
      MessageFilter.hasLink(message),
    );

    expect(messagesHaveLinksIncludeBotMessage).toEqual(
      expect.arrayContaining([
        combinedMessage,
        furledMessage,
        messageWrittenByBotAndHasLinks,
        unfurledMessage,
      ]),
    );
  });

  it('should return all messages have links except those written by the bot', function() {
    const messagesHaveLink = MessageFilter.filter(testMessages);

    expect(messagesHaveLink).toEqual(
      expect.arrayContaining([combinedMessage, furledMessage, unfurledMessage]),
    );
  });
});
