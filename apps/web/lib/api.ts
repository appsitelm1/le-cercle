const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export type ListingSummary = {
  id: number;
  ref: string;
  title: string;
  price: string;
  currencyCode: string;
  transaction: 'SALE' | 'RENT';
  featured: boolean;
  surface?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  typeId?: number | null;
  cityId?: number | null;
  city?: { name: string } | null;
  type?: { name: string } | null;
  images?: { url: string; isPrimary: boolean }[];
};

export type ListingDetail = ListingSummary & {
  description?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  neighborhood?: { name: string } | null;
  region?: { name: string } | null;
  country?: { name: string } | null;
  features?: { value: string; feature: { name: string } }[];
};

export async function getListings(
  params: Record<string, string | number | undefined> = {},
): Promise<{ items: ListingSummary[]; total: number; page: number; limit: number }> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  }
  try {
    const res = await fetch(`${API_URL}/listings?${qs.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page: 1, limit: 12 };
    return res.json();
  } catch {
    return { items: [], total: 0, page: 1, limit: 12 };
  }
}

export async function getListing(id: string): Promise<ListingDetail | null> {
  try {
    const res = await fetch(`${API_URL}/listings/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAgents(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/professionals/agents`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getAgencies(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/professionals/agencies`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getDevelopers(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/professionals/developers`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCities(): Promise<{ id: number; name: string; regionId: number; countryId: number }[]> {
  try {
    const res = await fetch(`${API_URL}/geo/cities`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCitiesByCountry(countryId: number): Promise<{ id: number; name: string; regionId: number; countryId: number }[]> {
  try {
    const res = await fetch(`${API_URL}/geo/cities?countryId=${countryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCountries(): Promise<{ id: number; name: string; code: string }[]> {
  try {
    const res = await fetch(`${API_URL}/geo/countries`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getLabels(): Promise<{ id: number; slug: string; nameFr: string; nameEn: string; nameEs: string; nameAr: string }[]> {
  try {
    const res = await fetch(`${API_URL}/labels`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function apiSetLabels(id: number, labelIds: number[], token: string): Promise<any> {
  const res = await fetch(`${API_URL}/listings/${id}/labels`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ labelIds }),
  });
  if (!res.ok) throw new Error('labels_failed');
  return res.json();
}

export async function apiUploadMedia(file: File, token: string): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_URL}/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error('upload_failed');
  return res.json();
}

export function apiMyListings(token: string): Promise<any[]> {
  return getAuth('/listings/mine', token);
}

export function apiCreateListing(dto: unknown, token: string): Promise<any> {
  return postAuth('/listings', token, dto);
}

export async function apiUpdateListing(id: number, dto: unknown, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('update_failed');
  return res.json();
}

export async function apiDeleteListing(id: number, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('delete_failed');
  return res.json();
}

export async function apiDuplicateListing(id: number, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/listings/${id}/duplicate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('duplicate_failed');
  return res.json();
}

export async function apiSetListingStatus(id: number, status: string, featured: boolean | undefined, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/listings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, featured }),
  });
  if (!res.ok) throw new Error('status_failed');
  return res.json();
}

export function apiMineStats(token: string): Promise<any> {
  return getAuth('/listings/mine/stats', token);
}

export async function apiUpdateProfile(dto: unknown, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/professionals/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('profile_update_failed');
  return res.json();
}

export async function apiChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  locale: string,
): Promise<{ reply: string }> {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, locale }),
  });
  if (!res.ok) throw new Error('chat_failed');
  return res.json();
}

// ---- client (auth + favoris) ----

export async function apiLogin(
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('login_failed');
  return res.json();
}

export async function apiRegisterPro(dto: unknown): Promise<{ ok: boolean; pending: boolean }> {
  const res = await fetch(`${API_URL}/auth/register-pro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('register_failed');
  return res.json();
}

export async function apiToggleFavorite(
  listingId: number,
  token: string,
): Promise<{ favorited: boolean }> {
  const res = await fetch(`${API_URL}/favorites/${listingId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('favorite_failed');
  return res.json();
}

export async function apiGetFavorites(token: string): Promise<{ listing: ListingSummary }[]> {
  const res = await fetch(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

// ---- client (professionnels) ----

function postAuth(path: string, token: string, body?: unknown) {
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) throw new Error(`${path}_failed`);
    return res.json();
  });
}

export function apiRegisterAgent(dto: unknown, token: string) {
  return postAuth('/professionals/agent', token, dto);
}
export function apiRegisterAgency(dto: unknown, token: string) {
  return postAuth('/professionals/agency', token, dto);
}
export function apiRegisterDeveloper(dto: unknown, token: string) {
  return postAuth('/professionals/developer', token, dto);
}
export function apiAcceptContract(contractId: number, token: string) {
  return postAuth(`/professionals/contracts/${contractId}/accept`, token, {});
}
export function apiPay(subscriptionId: number, token: string) {
  return postAuth(`/professionals/subscriptions/${subscriptionId}/pay`, token, {});
}

export async function apiMyProfessional(token: string): Promise<any> {
  const res = await fetch(`${API_URL}/professionals/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { agent: null, agencies: [], developers: [] };
  return res.json();
}

// ---- client (communication) ----

export async function apiCreateLead(dto: unknown): Promise<any> {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('lead_failed');
  return res.json();
}

export async function getAuth(path: string, token: string): Promise<any> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export function apiListConversations(token: string) {
  return getAuth('/messages/conversations', token);
}
export function apiGetConversation(token: string, id: number) {
  return getAuth(`/messages/conversations/${id}`, token);
}
export async function apiSendMessage(
  token: string,
  dto: { listingId?: number; toUserId?: number; body: string },
) {
  return postAuth('/messages', token, dto);
}
export async function apiReply(token: string, id: number, body: string) {
  return postAuth(`/messages/conversations/${id}`, token, { body });
}
export function apiListNotifications(token: string) {
  return getAuth('/notifications', token);
}
export function apiMarkAllRead(token: string) {
  return postAuth('/notifications/read-all', token, {});
}

// ---- client (admin) ----

async function adminFetch(path: string, token: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('admin_failed');
  return res.json();
}

export function apiAdminStats(token: string) {
  return adminFetch('/admin/stats', token);
}
export function apiAdminListings(token: string, status?: string) {
  return adminFetch(`/admin/listings${status ? `?status=${status}` : ''}`, token);
}
export function apiAdminProfessionals(token: string) {
  return adminFetch('/admin/professionals', token);
}
export function apiAdminUsers(token: string) {
  return adminFetch('/admin/users', token);
}
export function apiAdminUser(token: string, id: number) {
  return adminFetch(`/admin/users/${id}`, token);
}
export function apiAdminCreateUser(token: string, dto: { email: string; password: string; firstName?: string; lastName?: string; role: string }) {
  return adminFetch('/admin/users', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}
export function apiAdminDeleteUser(token: string, id: number) {
  return adminFetch(`/admin/users/${id}`, token, { method: 'DELETE' });
}
export function apiAdminSetUserStatus(token: string, id: number, status: string) {
  return adminFetch(`/admin/users/${id}/status`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
export function apiAdminUpdateUser(token: string, id: number, dto: { firstName?: string; lastName?: string; email?: string }) {
  return adminFetch(`/admin/users/${id}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}
export function apiAdminSetStatus(token: string, id: number, status: string) {
  return adminFetch(`/admin/listings/${id}/status`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
export function apiSetProfessionalStatus(token: string, type: string, id: number, status: string) {
  return adminFetch(`/admin/professionals/${type}/${id}/status`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export function apiGetSettings(token: string) {
  return adminFetch('/admin/settings', token);
}
export function apiPatchSettings(token: string, patch: Record<string, unknown>) {
  return adminFetch('/admin/settings', token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}
