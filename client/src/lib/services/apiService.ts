import { FormAuthSchema } from '@/lib/validation';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface ApiError {
  errors: [
    {
      field?: string;
      message: string;
    },
  ];
}

export interface currentUser {
  currentUser: string | null;
}

export interface authResponse {
  email: string;
  id: string;
}

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      },
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return { errors: [{ message: 'An unexpected Error occured.' }] };
  }

  //AUTH

  public async signup(credentials: FormAuthSchema): Promise<authResponse> {
    const response: AxiosResponse<authResponse> = await this.api.post('/users/signup', credentials);

    return response.data;
  }
  public async signin(credentials: FormAuthSchema): Promise<authResponse> {
    const response: AxiosResponse<authResponse> = await this.api.post('/users/signin', credentials);

    return response.data;
  }
}

export const apiService = ApiService.getInstance();
