import UserCard from '@/components/cards/UserCard';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { profileTabs } from '@/constants';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';

export const metadata = {
  title: 'Threads - Search',
  description: 'Next.js 14 Meta Threads Application',
};

const Search = async () => {
  const authenticatedUser = await currentUser();
  if (!authenticatedUser) return null;

  const userInfo = await fetchUser(authenticatedUser.id);

  const response = await fetchUsers({
    userId: authenticatedUser.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {response.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <>
            {response.users.map(user => (
              <UserCard key={user.id} user={user} personType="User" />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Search;
