import { Slack } from '../../types';
import SlackMessage = Slack.Conversation.SlackMessage;

/**
 * All data come from my private slack workspace.
 */

const combinedMessage = {
  client_msg_id: "efff7c41-aff4-482c-9795-118c027b8b2e",
  type: "message",
  text: "<https://m.blog.naver.com/PostView.nhn?blogId=femacu23&amp;logNo=220641564788&amp;proxyReferer=https%3A%2F%2Fwww.google.com%2F> <https://jestjs.io/docs/en/es6-class-mocks>\n<https://csapp.cs.cmu.edu/>",
  user: "UTEQ03GGN",
  ts: "1583166281.000400",
  team: "TTC4EK31A",
  attachments: [
    {
      service_name: "네이버 블로그 | 독립 출판사 와이넛북스(whynut books)입니다!",
      title: "소유격 관계 대명사란?",
      title_link: "https://m.blog.naver.com/PostView.nhn?blogId=femacu23&logNo=220641564788&proxyReferer=https%3A%2F%2Fwww.google.com%2F",
      text: "소유격 관계 대명사란? 앞에서는 who, whom, which의 용법에 대해 주로 알아봤어요. 그런데 of which와 who...",
      fallback: "네이버 블로그 | 독립 출판사 와이넛북스(whynut books)입니다!: 소유격 관계 대명사란?",
      image_url: "https://blogimgs.pstatic.net/nblog/mylog/post/og_default_image_160610.png",
      from_url: "https://m.blog.naver.com/PostView.nhn?blogId=femacu23&logNo=220641564788&proxyReferer=https%3A%2F%2Fwww.google.com%2F",
      image_width: 250,
      image_height: 250,
      image_bytes: 3605,
      service_icon: "https://m.blog.naver.com/mobileweb_icon_96.png?1",
      id: 1,
      original_url: "https://m.blog.naver.com/PostView.nhn?blogId=femacu23&amp;logNo=220641564788&amp;proxyReferer=https%3A%2F%2Fwww.google.com%2F"
    },
    {
      title: "ES6 Class Mocks · Jest",
      title_link: "https://jestjs.io/docs/en/es6-class-mocks",
      text: "Jest can be used to mock ES6 classes that are imported into files you want to test.",
      fallback: "ES6 Class Mocks · Jest",
      thumb_url: "https://jestjs.io/img/opengraph.png",
      from_url: "https://jestjs.io/docs/en/es6-class-mocks",
      thumb_width: 796,
      thumb_height: 416,
      service_icon: "https://jestjs.io/img/favicon/favicon.ico",
      service_name: "jestjs.io",
      id: 2,
      original_url: "https://jestjs.io/docs/en/es6-class-mocks"
    }
  ],
  blocks: [
    {
      type: "rich_text",
      block_id: "gpkyR",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            {
              type: "link",
              url: "https://m.blog.naver.com/PostView.nhn?blogId=femacu23&logNo=220641564788&proxyReferer=https%3A%2F%2Fwww.google.com%2F"
            },
            {
              type: "text",
              text: " "
            },
            {
              type: "link",
              url: "https://jestjs.io/docs/en/es6-class-mocks"
            },
            {
              type: "text",
              text: "\n"
            },
            {
              type: "link",
              url: "https://csapp.cs.cmu.edu/"
            }
          ]
        }
      ]
    }
  ]
};

const furledMessage = {
  client_msg_id: "55a8e701-fd36-4f8d-8eeb-f4ef8cd12cf7",
  type: "message",
  text: "<https://www.youtube.com/watch?v=7yQP4i5MH2I>",
  user: "UTEQ03GGN",
  ts: "1581942673.001600",
  team: "TTC4EK31A",
  blocks: [
    {
      type: "rich_text",
      block_id: "jSvI",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            {
              type: "link",
              url: "https://www.youtube.com/watch?v=7yQP4i5MH2I"
            }
          ]
        }
      ]
    }
  ]
};

const unfurledMessage = {
  client_msg_id: "c7ae6f13-0cd0-4598-8260-77bff3862671",
  type: "message",
  text: "<https://brunch.co.kr/@bettertmr/10>",
  user: "UTEQ03GGN",
  ts: "1581942056.001200",
  team: "TTC4EK31A",
  attachments: [
    {
      service_name: "brunch",
      title: "어려움 극복 사례 작성법",
      title_link: "https://brunch.co.kr/@bettertmr/10",
      text: "누구나 어렵고 힘든 일 있었잖아요? | 여태까지 살면서 어려운 일 한 번은 있으셨죠? 혹시 한번도 없으셨나요? 잘 생각해보세요. 아무리 짧더라도 인생이 별로 안 힘들었다고 할 수 있는 사람 몇이나 될까요? '별일 아니었어'라고 생각하는 건 지금 모든 상황이 다 종료되고 일이 잘 풀렸기 때문일 겁니다. ‘시간이 지나 보니 당시 힘든 건 아무것도 아니었구나’라고 생각해서 없다고 생각할 경우가",
      fallback: "brunch: 어려움 극복 사례 작성법",
      thumb_url: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/7AO5/image/5b3RvO1H1Y6uaYSt3G8YV8QyUAs.jpg",
      ts: 1575623880,
      from_url: "https://brunch.co.kr/@bettertmr/10",
      thumb_width: 1280,
      thumb_height: 773,
      service_icon: "http://t1.daumcdn.net/brunch/static/icon/ios/icon152.png",
      id: 1,
      original_url: "https://brunch.co.kr/@bettertmr/10"
    }
  ],
  blocks: [
    {
      type: "rich_text",
      block_id: "cIYxH",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            {
              type: "link",
              url: "https://brunch.co.kr/@bettertmr/10"
            }
          ]
        }
      ]
    }
  ]
};

const plainMessage = {
  client_msg_id: "2082edc3-ccf4-4c27-8ce7-3a2ed07abc21",
  type: "message",
  text: "안녕",
  user: "UTEQ03GGN",
  ts: "1580458850.000400",
  team: "TTC4EK31A",
  blocks: [
    {
      type: "rich_text",
      block_id: "3gh",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            {
              type: "text",
              text: "안녕"
            }
          ]
        }
      ]
    }
  ]
};

const systemMessage = {
  type: "message",
  subtype: "channel_join",
  ts: "1580458620.000200",
  user: "UTEQ03GGN",
  text: "<@UTEQ03GGN> has joined the channel"
};

const messageWrittenByBot = {
    bot_id: "BS96NKFMX",
    type: "message",
    text: "더그 엥겔바트(이)가 문을 열겠습니다.",
    user: "USKD8AFL5",
    ts: "1582885074.063600",
    team: "T74H5245A",
    bot_profile: {
      id: "BS96NKFMX",
      deleted: false,
      name: "bot",
      updated: 1578897892,
      app_id: "A0F7YS25R",
      icons: {
        image_36: "https://a.slack-edge.com/80588/img/services/bots_36.png",
        image_48: "https://a.slack-edge.com/80588/img/plugins/bot/service_48.png",
        image_72: "https://a.slack-edge.com/80588/img/services/bots_72.png"
      },
      team_id: "T74H5245A"
    }
};

const messageWrittenByBotAndHasLinks = {
  bot_id: "B9KMQ1KSN",
  type: "message",
  text: "",
  user: "B9KMQ1KSN",
  ts: "1583145232.007500",
  team: "B9KMQ1KSN",
  blocks: [
    {
      type: "rich_text",
      block_id: "cIYxH",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            {
              type: "link",
              url: "https://brunch.co.kr/@bettertmr/10"
            }
          ]
        }
      ]
    }
  ]
};

const testMessages: SlackMessage[] = [
  combinedMessage,
  furledMessage,
  messageWrittenByBot,
  messageWrittenByBotAndHasLinks,
  plainMessage,
  systemMessage,
  unfurledMessage,
];

export {
  combinedMessage,
  furledMessage,
  messageWrittenByBot,
  messageWrittenByBotAndHasLinks,
  plainMessage,
  systemMessage,
  testMessages,
  unfurledMessage,
};
