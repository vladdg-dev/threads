import { fetchActivity, fetchUser } from '@/lib/actions/user.actions';
import { IActivity } from '@/types';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Threads - Activity',
  description: 'Next.js 14 Meta Threads Application',
};

const Activity = async () => {
  const authenticatedUser = await currentUser();
  if (!authenticatedUser) return null;

  const userInfo = await fetchUser(authenticatedUser.id);

  const userId = userInfo._id.toString();

  const activities = await fetchActivity(userId);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          <>
            {activities.map((activity: IActivity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="profile picture"
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-small-semibold text-light-2">
                      {activity.author.name}
                    </span>{' '}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet.</p>
        )}
      </section>
    </section>
  );
};

export default Activity;
