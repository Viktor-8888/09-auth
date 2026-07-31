import { cookies } from 'next/headers';
import type { FetchNotesResponse, Note } from '@/types/note';
import type { User } from '@/types/user';
import { nextServer } from './api';

export async function fetchNotes(
  search: string,
  page: number,
  tag: string | undefined
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: { search, page, perPage: 12, tag },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
