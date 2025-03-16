'use client';

import { apiService } from '@/lib/services/apiService';
import { Button } from '../ui/button';
import NavItem from './NavItem';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

const NavList = ({ cookie }: { cookie?: string }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookie);

  const router = useRouter();
  const handleSignout = async () => {
    // await fetch('http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/signout', {
    //   method: 'post',
    //   credentials: 'include',
    // });

    await apiService.signout();
    router.push('/');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiService.currentUser();
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      {isLoggedIn ? (
        <form
          action={() => {
            handleSignout();
          }}>
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
