import { useAuthStore } from '@/store/useAuthStore';
import { ref } from 'vue';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    'VITE_API_BASE_URL is missing! Check .env.* and start command.'
  );
}

function safeAuth() {
  try {
    return useAuthStore();
  } catch {
    return null;
  }
}

async function ensureAuthValid() {
  const auth = safeAuth();
  
  if (!auth) {
    throw new Error('Auth store not available');
  }

  // If token is expired, try to refresh
  if (!auth.isTokenValid) {
    const refreshed = await auth.refreshAccessToken();
    if (!refreshed) {
      throw new Error('Token refresh failed - please login again');
    }
  }

  return auth;
}

// request ที่รองรับทั้ง JSON และ FormData
async function request(
  path,
  { method = 'GET', headers = {}, body, attachAuth = true } = {}
) {
  //const auth = safeAuth();
  let auth = null;
  if (attachAuth) {
    auth = await ensureAuthValid();
  }
 
  const finalHeaders = { Accept: 'application/hal+json', ...headers };

  // ใส่ token ถ้ามี
  if (attachAuth && auth?.accessToken) {
    finalHeaders.Authorization = `Bearer ${auth.accessToken}`;
  }
  // ถ้า BE ใช้ X-USER-ID ด้วย ค่อยส่ง (ไม่จำเป็นก็ลบออกได้)
  if (auth?.user?.id != null) {
    finalHeaders['X-USER-ID'] = String(auth.user.id);
  }

  let payload = body;
  const hasBody = payload !== undefined && payload !== null;
  const callerSetCT = Object.keys(finalHeaders).some(
    (k) => k.toLowerCase() === 'content-type'
  );

  if (hasBody) {
    // ถ้าผู้เรียกยังไม่ได้ใส่ Content-Type
    if (!callerSetCT) {
      if (payload instanceof FormData) {
        // สำคัญ: ห้ามตั้ง Content-Type เอง
      } else if (typeof payload === 'string') {
        // ถ้าส่งเป็น string ตรง ๆ
        finalHeaders['Content-Type'] = 'text/plain;charset=UTF-8';
      } else if (
        payload instanceof Blob ||
        payload instanceof ArrayBuffer ||
        payload instanceof URLSearchParams ||
        (typeof ReadableStream !== 'undefined' &&
          payload instanceof ReadableStream)
      ) {
        // binary/stream ไม่ยุ่ง header
      } else {
        // object ปกติ -> ส่งเป็น JSON
        finalHeaders['Content-Type'] = 'application/json';
        payload = JSON.stringify(payload);
      }
    } else {
      // ผู้เรียกกำหนด Content-Type เองแล้ว
      // ถ้าเป็น JSON และ body ยังเป็น object ให้ stringify ให้
      if (
        finalHeaders['Content-Type']?.includes('application/json') &&
        typeof payload === 'object' &&
        !(payload instanceof FormData)
      ) {
        payload = JSON.stringify(payload);
      }
    }
  }

  // const res = await fetch(`${API_BASE_URL}${path}`, {
  //   method,
  //   headers: finalHeaders,
  //   body: payload,
    
  // });
  // return res;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
    credentials: 'include', // ✅ Include cookies (for refresh_token)
  });

   if (res.status === 401 && attachAuth && auth) {
    console.warn('Received 401, attempting token refresh...');
    const refreshed = await auth.refreshAccessToken();
    
    if (refreshed) {
      // Retry the request with new token
      finalHeaders.Authorization = `Bearer ${auth.accessToken}`;
      return fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: payload,
        credentials: 'include',
      });
    } else {
      // Refresh failed - return original 401 response
      return res;
    }
  }

  return res;
}

// apiClient
export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),

  postJson: (path, data, opts) =>
    request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
      body: JSON.stringify(data ?? {}),
      ...opts,
    }),

  postForm: (path, formData, opts) =>
    request(path, { method: 'POST', body: formData, ...opts }),

  putJson: (path, data, opts) =>
    request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
      body: JSON.stringify(data ?? {}),
      ...opts,
    }),

  putFormData: (path, formData, opts) =>
    request(path, {
      method: 'PUT',
      body: formData,
      ...opts,
    }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
