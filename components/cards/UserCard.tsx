import { IUser } from '@/types';
import Image from 'next/image';
import { FC } from 'react';
import { Button } from '../ui/button';
import ViewProfileButton from '../shared/ViewProfileButton';

const UserCard: FC<{ user: IUser; personType: string }> = ({
  user,
  personType,
}) => {
  const { id, name, username, image } = user;

  return (
    <article className="user-card px-7">
      <div className="user-card_avatar">
        <Image
          src={image}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <ViewProfileButton userId={id} />
    </article>
  );
};

export default UserCard;
