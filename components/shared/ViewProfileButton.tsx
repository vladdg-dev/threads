'use client';

import { FC } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const ViewProfileButton: FC<{ userId: string | undefined }> = ({ userId }) => {
  const router = useRouter();

  return (
    <Button
      className="user-card_btn"
      onClick={() => router.push(`/profile/${userId}`)}
    >
      View
    </Button>
  );
};

export default ViewProfileButton;
