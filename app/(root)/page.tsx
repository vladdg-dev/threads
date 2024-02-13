import { fetchThreads } from '@/lib/actions/thread.actions';

export default async function Home() {
  const threads = await fetchThreads(1, 30);

  console.log(threads);

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
    </div>
  );
}
