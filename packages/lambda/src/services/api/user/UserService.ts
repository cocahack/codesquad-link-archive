import { DataMapper } from '@aws/dynamodb-data-mapper';
import { User } from 'lib/model/User';

export class UserService {
  constructor(private readonly mapper: DataMapper) {}

  getUserById(userId: string): Promise<User> {
    return this.mapper.get(Object.assign(new User(), { userId }));
  }
}
