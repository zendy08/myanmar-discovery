export type StoredReader = {
  id: string;
  name: string;
  email: string;
  password: string;
  savedPlaceIds: string[];
  createdAt: string;
};

export type Reader = {
  id: string;
  name: string;
  email: string;
  savedPlaceIds: string[];
};

export type AuthFormState = { error: string } | null;

export function toPublicReader(reader: StoredReader): Reader {
  return {
    id: reader.id,
    name: reader.name,
    email: reader.email,
    savedPlaceIds: [...reader.savedPlaceIds],
  };
}
