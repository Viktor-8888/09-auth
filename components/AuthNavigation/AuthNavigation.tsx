'use client';
import css from '@/components/AuthNavigation/AuthNavigation.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch {
      toast.error('Something went wrong, try again');
    }
  };
  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button onClick={handleLogout} className={css.logoutButton}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
