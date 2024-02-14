import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import ThreadCard from '../cards/ThreadCard';
import { IThreadCard } from '@/types';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab: FC<ThreadsTabProps> = async ({
  currentUserId,
  accountId,
  accountType,
}) => {
  let response;

  if (accountType === 'Community') {
    response = await fetchCommunityPosts(accountId);
  } else {
    response = await fetchUserPosts(accountId);
  }
  if (!response) redirect('/');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {response.threads.map((thread: IThreadCard) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? { name: response.name, image: response.image, id: response.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
