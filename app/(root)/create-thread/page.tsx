import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Threads - Create Thread',
  description: 'Next.js 14 Meta Threads Application',
};

const CreateThread = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const id = userInfo._id.toString();

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={id} />
    </>
  );
};

export default CreateThread;
