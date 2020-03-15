import { DataMapper } from '@aws/dynamodb-data-mapper';
import { User } from './User';

export class UserService {
  constructor(private readonly mapper: DataMapper) {}

  getUserById(userId: string): Promise<User> {
    return this.mapper.get(Object.assign(new User(), { userId }));
  }
}
