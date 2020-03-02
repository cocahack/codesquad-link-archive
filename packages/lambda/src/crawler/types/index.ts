import { WebAPICallResult } from "@slack/web-api";

export declare namespace Slack {

  export interface SlackObject {}

  namespace Channel {

    export interface ChannelListsResponse extends WebAPICallResult {
      channels?: SlackChannel[];
    }

    export interface SlackChannel extends SlackObject{
      id: string;
      name: string;
      is_channel: boolean,
      created: number,
      is_archived: boolean,
      is_general: boolean,
      unlinked: number,
      creator: string;
      name_normalized: string;
      is_shared: boolean;
      is_org_shared: boolean;
      is_member: boolean;
      is_private: boolean;
      is_mpim: boolean;
      members: string[];
      topic: Topic;
      purpose: Purpose;
      previous_names: string[];
      num_members: number;
    }

    export interface Topic {
      value: string;
      creator: string;
      last_set: number;
    }
    export interface Purpose {
      value: string;
      creator: string;
      last_set: number;
    }

  }

  namespace User {

    interface UserListsResponse extends WebAPICallResult {
      members?: SlackUser[];
    }

    interface SlackUser {
      id: string;
      team_id: string;
      name: string;
      deleted: false,
      color: string;
      real_name: string;
      tz: string;
      tz_label: string;
      tz_offset: number;
      profile: Profile;
      is_admin: boolean;
      is_owner: boolean;
      is_primary_owner: boolean;
      is_restricted: boolean;
      is_ultra_restricted: boolean;
      is_bot: boolean;
      is_app_user: boolean;
      updated: number;
    }

    interface Profile {
      title?: string;
      phone?: string;
      skype?: string;
      real_name?: string;
      real_name_normalized?: string;
      display_name?: string;
      display_name_normalized?: string;
      status_text?: string;
      status_emoji: string;
      status_expiration: number;
      avatar_hash: string;
      image_original?: string;
      is_custom_image: boolean;
      email: string;
      first_name?: string;
      last_name?: string;
      image_24?: string;
      image_32?: string;
      image_48?: string;
      image_72?: string;
      image_192?: string;
      image_512?: string;
      image_1024?: string;
      status_text_canonical: string;
      team: string;
    }
  }

  namespace Message {

    export interface ConversationHistoryResponse extends WebAPICallResult {
      messages?: SlackMessage[];
      has_more?: boolean;
      pin_count?: 3;
      channel_actions_ts?: string;
      channel_actions_count?: number;
    }

    interface SlackMessage {

      client_msg_id: string;
      type: string;
      text?: string;
      user: string;
      ts: number;
      team: string;
      attachments?: Attachment[];
      blocks: Block[]; 
      reactions: Reaction[];
    }

    interface Attachment {
      service_name?: string;
      title?: string;
      title_link?: string;
      text?: string;
      fallback?: string;
      thumb_url?: string;
      ts?: number;
      from_url?: string;
      thumb_width?: number;
      thumb_height?: number;
      service_icon?: string;
      id: number;
      original_url?: string;
    }

    interface Block {
      type: string;
      block_id: string;
      elements: Element[];
    }

    interface Element {
      type: string;
      url?: string;
      text?: string;
      elements?: Element[];
    }
    
    interface Reaction {
      name: string;
      users: string[];
      count: number;
    }

  }

}

export declare namespace Crawler {
}
