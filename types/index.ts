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
  author: IAuthor | string;
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

export interface IThreadCard {
  _id: string;
  text: string;
  author: IAuthor;
  parentId: string;
  createdAt: string;
  children: IComments[];
  community: ICommunity;
}

export interface IActivity {
  _id: string;
  text: string;
  author: IAuthor;
  parentId: string;
  children: IComment[];
}
