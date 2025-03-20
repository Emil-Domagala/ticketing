import { fetchCurrentUser } from '@/app/actions/apiServerActions';
import NavList from './NavList';
import Link from 'next/link';

const Nav = async () => {
  const data = await fetchCurrentUser();

  return (
    <div className="sticky">
      <nav className="flex w-full top-0 justify-between items-center px-10  backdrop-blur-xs  shadow-[inset_0px_-1px_0px_0px_rgb(87,_83,_77)] ">
        <Link href="/" className="text-white tracking-wide text-3xl font-bold py-2">
          Ticketing
        </Link>
        <NavList currentUserEmail={data.currentUser?.email} />
      </nav>
    </div>
  );
};

export default Nav;
