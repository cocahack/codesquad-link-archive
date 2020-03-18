import { attribute, hashKey, table } from "@aws/dynamodb-data-mapper-annotations";

@table('users')
export class User {

  @hashKey()
  userId: string;

  @attribute()
  userName: string;

  @attribute()
  userImage?: string;

  @attribute()
  email?: string;

}
