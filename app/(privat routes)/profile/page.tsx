import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi';
import Image from 'next/image';
import css from './ProfilePage.module.css';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  return {
    title: `${user.username} Profile | NoteHub`,
    description: `View user profile ${user.username}.`,
    openGraph: {
      title: `${user.username} Profile | NoteHub`,
      description: `View user profile ${user.username}.`,
      url: `/profile`,
      images: [
        {
          url: user.avatar,
          alt: `${user.username} avatar`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function Profile() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt={`${user.username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
