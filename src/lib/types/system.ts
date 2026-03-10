/** @visibility public */
export type NoticeScope = 'global' | 'hackathon' | 'team';

/** @visibility public */
export type NoticeLevel = 'info' | 'warning' | 'error';

/** @visibility public */
export interface SystemNotice {
  id: string;
  scope: NoticeScope;
  hackathonSlug?: string;
  message: string;
  level: NoticeLevel;
}
