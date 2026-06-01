export type User = {
  id: string;
  email: string;
  name: string;
  haspin: boolean;
  accName: string;
  accNo: string;
  adminRole: string;
  bankName: string;
  bvn?: string;
  phone: string;
  referralCode: string;
  referralLink: string;
  walletBalance: number;
  state: string;
};

export type NotificationType = {
  createdAt: string;
  id: string;
  isRead: boolean;
  message: string;
  type: string;
  title: string;
};

export type ReferralUser = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type referralData = {
  referral_code: string;
  referral_link: string;
  referred_users: ReferralUser[];
  share_message: string;
  total_earnings: number;
  total_referred: number;
};

export type ReferralStatsResponse = {
  status: string;
  data: referralData;
};
