'use client';

import { Button } from '../ui/button';
import NavItem from './NavItem';
import { useRouter } from 'next/navigation';
import { signout } from '@/app/actions/apiServerActions';

const NavList = ({ currentUserEmail }: { currentUserEmail: string | undefined }) => {
  const router = useRouter();
  const handleSignout = async () => {
    await signout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex">
      {currentUserEmail ? (
        <form action={handleSignout}>
          <Button
            className="text-md p-3 h-[100%] transition:background duration-300 hover:bg-stone-500/20"
            variant="link">
            Logout
          </Button>
        </form>
      ) : (
        <NavItem href="/auth" text="Login" />
      )}
    </div>
  );
};

export default NavList;
