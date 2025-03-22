'use server';

import axios, { AxiosResponse, AxiosError } from 'axios';
import { cookies } from 'next/headers';

//Handle all cookies automaticly
const setCookie = async (setCookieHeaders: string[] | undefined) => {
  if (!setCookieHeaders) return;

  const cookieStore = await cookies();

  for (const cookieStr of setCookieHeaders) {
    const cookieParts = cookieStr.split('; ');
    const [name, value] = cookieParts[0].split('=');
    const cookieOptions: {
      expires?: Date;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'lax' | 'strict' | 'none' | undefined;
      path?: string;
      domain?: string;
    } = {};

    let shouldDelete = false; // Flag to check if we should delete this cookie

    cookieParts.slice(1).forEach((attr) => {
      const [key, val] = attr.split('=');
      const lowerKey = key.toLowerCase();

      if (lowerKey === 'max-age' && parseInt(val, 10) <= 0) {
        shouldDelete = true; // Max-Age=0 means delete the cookie
      } else if (lowerKey === 'expires') {
        const expiresDate = new Date(val);
        cookieOptions.expires = expiresDate;

        if (expiresDate < new Date()) {
          shouldDelete = true; // Expired cookie should be deleted
        }
      } else if (lowerKey === 'httponly') {
        cookieOptions.httpOnly = true;
      } else if (lowerKey === 'secure') {
        cookieOptions.secure = true;
      } else if (lowerKey === 'samesite') {
        cookieOptions.sameSite = val as 'lax' | 'strict' | 'none' | undefined;
      } else if (lowerKey === 'path') {
        cookieOptions.path = val;
      } else if (lowerKey === 'domain') {
        cookieOptions.domain = val;
      }
    });

    if (shouldDelete) {
      console.log(`Deleting expired cookie: ${name}`);
      cookieStore.delete(name);
    } else {
      console.log(`Setting cookie: ${name}=${value}`);
      cookieStore.set(name, value, cookieOptions);
    }
  }
};

export interface ApiError {
  errors: [
    {
      field?: string;
      message: string;
    },
  ];
}

export interface currentUser {
  email: string;
  id: string;
}

export interface currentUserResponse {
  currentUser: currentUser | null;
}

const api = axios.create({
  baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api',
  headers: {
    'Content-Type': 'application/json',
    Host: 'ticketing.dev',
  },
  withCredentials: true,
});

// Handle errors globally
const handleError = (error: AxiosError): ApiError => {
  if (error.response?.data) {
    return error.response.data as ApiError;
  }
  return { errors: [{ message: 'An unexpected error occurred.' }] };
};

// AUTH ACTIONS

export async function signout(): Promise<void> {
  try {
    const response = await api.post('/users/signout');
    const setCookieHeaders = response.headers['set-cookie'];
    await setCookie(setCookieHeaders);
  } catch (error) {
    throw handleError(error as AxiosError);
  }
}

//Fetch user

export async function fetchCurrentUser(): Promise<currentUserResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    if (!token) {
      return { currentUser: null };
    }

    const response: AxiosResponse<currentUserResponse> = await api.get('/users/current-user', {
      headers: { Cookie: `jwt=${token}` },
    });
    const setCookieHeaders = response.headers['set-cookie'];
    await setCookie(setCookieHeaders);
    return response.data;
  } catch (error) {
    throw handleError(error as AxiosError);
  }
}
