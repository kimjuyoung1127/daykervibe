/** @visibility public (ownerLabel is private-hidden) */
export interface Team {
  id: string;
  hackathonSlug?: string;
  name: string;
  intro: string;
  isOpen: boolean;
  lookingFor: string[];
  contactUrl?: string;
  memberCount: number;
  /** @visibility private-hidden — never render */
  ownerLabel?: string;
  createdAt: string;
  /** @visibility team-local */
  updatedAt?: string;
}

/** @visibility team-local */
export type TeamMemberStatus = 'active' | 'pending';

/** @visibility team-local */
export interface TeamMember {
  id: string;
  teamId: string;
  displayName: string;
  roleLabel?: string;
  status: TeamMemberStatus;
  /** @visibility private-hidden */
  isPrivateProfile: boolean;
}

/** @visibility team-local */
export type TeamInviteStatus = 'sent' | 'accepted' | 'rejected';

/** @visibility team-local */
export interface TeamInvite {
  id: string;
  teamId: string;
  inviteeLabel: string;
  status: TeamInviteStatus;
  createdAt: string;
}
