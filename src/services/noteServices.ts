import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// ===================== fetchNotes =====================
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const res: AxiosResponse<FetchNotesResponse> = await api.get("", { params });
  return res.data; 
}

// ===================== createNote =====================
export interface CreateNoteDto {
  title: string;
  content?: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.post("", note);
  return res.data;
};

// ===================== deleteNote =====================
export const deleteNote = async (noteId: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.delete(`/${noteId}`);
  return res.data;
};
