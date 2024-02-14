import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreads } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';

export const metadata = {
  title: 'Threads - Home',
  description: 'Next.js 14 Meta Threads Application',
};

export default async function Home() {
  const user = await currentUser();
  const response = await fetchThreads(1, 30);

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {response.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {response.threads.map(thread => (
              <ThreadCard
                key={thread.id}
                id={thread.id}
                currentUserId={user?.id || ''}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.comments}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
