import { attribute } from "@aws/dynamodb-data-mapper-annotations";

export class LinkMetadata {

  @attribute()
  serviceName?: string;

  @attribute()
  serviceIcon?: string;

  @attribute()
  title?: string;

  @attribute()
  text?: string;

  @attribute()
  imageUrl?: string;

}