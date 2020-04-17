import { attribute } from "@aws/dynamodb-data-mapper-annotations";

export class Message {

  @attribute()
  messageId: string;

  @attribute()
  text: string;

}