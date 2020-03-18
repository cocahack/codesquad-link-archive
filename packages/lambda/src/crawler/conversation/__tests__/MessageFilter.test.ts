import MessageFilter from '../MessageFilter';
import {
  combinedMessage,
  furledMessage,
  messageWrittenByBotAndHasLinks,
  testMessages,
  unfurledMessage,
} from '../__mocks__/SlackMessageData';

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
