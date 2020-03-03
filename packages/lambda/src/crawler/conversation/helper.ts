import { Slack } from "../types";
import SlackMessage = Slack.Conversation.SlackMessage;
import { Link } from "./Link";
import Block = Slack.Conversation.Block;
import Element = Slack.Conversation.Element;
import Attachment = Slack.Conversation.Attachment;
import * as moment from "moment";
import { LinkMetadata } from "./LinkMetadata";

const makeLinks = (slackMessage: SlackMessage, channelId: string): Link[] => {
  const linkElements = extractLinkElements(slackMessage.blocks);

  return linkElements.map((linkElement): Link => {
    const attachment = slackMessage.attachments?.find(a => a.from_url === linkElement.url);
    return {
      channelId,
      url: linkElement.url,
      userId: slackMessage.user,
      linkTimestamp: moment.unix(Number(slackMessage.ts)).toDate(),
      metadata: getLinkMetadataFromAttachment(attachment),
      message: {
        messageId: slackMessage.client_msg_id,
        text: slackMessage.text,
      }
    };
  });
};

const extractLinkElements = (blocks?: Block[]): Element[] => {
  const richTextBlocks = blocks?.filter(block => block.type === 'rich_text');
  const richTextSections = richTextBlocks?.flatMap(block => block.elements).filter(element => element.type === 'rich_text_section');

  return richTextSections?.flatMap(section => section.elements).filter(element => element.type === 'link') || [];
};

const getLinkMetadataFromAttachment = (attachment: Attachment): LinkMetadata => {
  return {
    title: attachment?.title,
    serviceName: attachment?.service_name,
    serviceIcon: attachment?.service_icon,
    imageUrl: attachment?.thumb_url || attachment?.image_url,
    text: attachment?.text,
  }
};

export default makeLinks;