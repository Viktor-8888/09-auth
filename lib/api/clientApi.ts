import type { Note, CreateNoteRequest } from '@/types/note';
import type { User } from '@/types/user';
import { nextServer } from './api';
import type { FetchNotesResponse } from '@/types/note';

export async function fetchNotes(
  search: string,
  page: number,
  tag: string | undefined
): Promise<FetchNotesResponse> {
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: { search, page, perPage: 12, tag },
  });
  return response.data;
}

export async function createNote(note: CreateNoteRequest): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

type CheckSessionResponse = {
  success: boolean;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionResponse>('/auth/session');
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export type EditRequest = {
  username: string;
};
export const updateMe = async ({ username }: EditRequest) => {
  const response = await nextServer.patch<User>('/users/me', { username });
  return response.data;
};
