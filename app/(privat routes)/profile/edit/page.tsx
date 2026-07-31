'use client';
import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { useState } from 'react';
import { updateMe } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/api';

export default function EditProfilePage() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const [username, setUsername] = useState(user?.username ?? '');
  const [error, setError] = useState('');
  const router = useRouter();
  if (!user) return null;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }
  function handleCancel() {
    router.push('/profile');
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push('/profile');
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  }
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt={`${user.username} avatar`}
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleChange}
              className={css.input}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
