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

export interface IAuthor {
  id: string;
  name: string;
  image: string;
}

export interface ICommunity extends IAuthor {}

export interface IComments {
  author: {
    image: string;
  }[];
  isComment?: boolean;
}

export interface IComment {
  text: string;
  author: string;
  parentId: string;
}
