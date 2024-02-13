export interface IUser {
  id: string | undefined;
  objectId?: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

export interface IThread {
  text: string;
  author: string;
  communityId: string | null;
}
