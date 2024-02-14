import CommunityCard from '@/components/cards/CommunityCard';
import { fetchCommunities } from '@/lib/actions/community.actions';
import { currentUser } from '@clerk/nextjs';

export const metadata = {
  title: 'Threads - Search',
  description: 'Next.js 14 Meta Threads Application',
};

const Communities = async () => {
  const authenticatedUser = await currentUser();
  if (!authenticatedUser) return null;

  const response = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {response.communities.length === 0 ? (
          <p className="no-result">No communities</p>
        ) : (
          <>
            {response.communities.map(community => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Communities;
