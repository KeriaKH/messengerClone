export type User = {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  friends: string[];
  isOnline: boolean;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
};
