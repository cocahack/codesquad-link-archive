import { Slack } from 'services/crawler/types';
import SlackMessage = Slack.Conversation.SlackMessage;
import Block = Slack.Conversation.Block;
import Element = Slack.Conversation.Element;
import Attachment = Slack.Conversation.Attachment;
import * as moment from 'moment';
import { getDateFromUnix } from 'lib/datetime';
import { LinkMetadata } from 'lib/model/LinkMetadata';
import { Link } from 'lib/model/Link';

const makeLinks = (slackMessage: SlackMessage, channelId: string): Link[] => {
  const linkElements = extractLinkElements(slackMessage.blocks);

  return linkElements.map(
    (linkElement): Link => {
      const attachment = slackMessage.attachments?.find(
        a => a.from_url === linkElement.url,
      );

      const ts = Number(slackMessage.ts);

      return Object.assign<Link, Partial<Link>>(new Link(), {
        channelId,
        url: linkElement.url,
        userId: slackMessage.user,
        linkTimestamp: moment
          .unix(ts)
          .toDate()
          .toISOString(),
        date: getDateFromUnix(ts),
        metadata: getLinkMetadataFromAttachment(attachment),
        message: {
          messageId: slackMessage.client_msg_id,
          text: slackMessage.text,
        },
      });
    },
  );
};

const extractLinkElements = (blocks?: Block[]): Element[] => {
  const richTextBlocks = blocks?.filter(block => block.type === 'rich_text');
  const richTextSections = richTextBlocks
    ?.flatMap(block => block.elements)
    .filter(element => element.type === 'rich_text_section');

  return (
    richTextSections
      ?.flatMap(section => section.elements)
      .filter(element => element.type === 'link') || []
  );
};

const getLinkMetadataFromAttachment = (
  attachment: Attachment,
): LinkMetadata => {
  const title = attachment?.title;
  const text = attachment?.text;
  return {
    title,
    text,
    serviceName: attachment?.service_name,
    serviceIcon: attachment?.service_icon,
    imageUrl: attachment?.thumb_url || attachment?.image_url,
  };
};

export default makeLinks;
