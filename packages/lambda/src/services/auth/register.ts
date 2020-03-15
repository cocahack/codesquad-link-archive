import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../api/user/User';
import { ScanOptions } from '@aws/dynamodb-data-mapper';
import { InvitationStrategy } from './strategy/InvitationStrategy';
import mapper from 'lib/mapper';
import { slackClient } from 'lib/slack';

export const register: APIGatewayProxyHandler = async (event, _context) => {
  const loginInput = JSON.parse(event.body);
  const baseUrl = process.env.BASE_URL;
  const invitationStrategy = new InvitationStrategy(process.env.LINK_SECRET);

  try {
    const scanOption: ScanOptions = {
      filter: {
        type: 'Equals',
        subject: 'email',
        object: loginInput.email,
      },
    };

    let user: User;

    for await (const persistedUser of mapper.scan(User, scanOption)) {
      user = persistedUser;
      break;
    }

    if(!user) {
      throw new Error('Email not registered.');
    }

    const dmChannel = await slackClient.conversations.open({
      users: user.userId,
    });

    const invitation = await invitationStrategy.sign(user.userId);

    await slackClient.chat.postMessage({
      unfurl_links: false,
      username: 'Jake(BE) Bot',
      text: `Codesquad 링크 저장소 <${baseUrl}/enter?invitation=${invitation}|초대 링크>
:warning: 주의: 10분 후 링크가 만료됩니다.`,
      // @ts-ignore
      channel: dmChannel.channel.id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Check Slack App and click the link!',
          input: event,
        },
        null,
        2,
      ),
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: e.statusCode ? e.statusCode : 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          message: e.message,
        },
        null,
        2,
      ),
    };
  }
};
