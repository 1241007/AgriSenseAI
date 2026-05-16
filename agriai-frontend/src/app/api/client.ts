const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

interface ApiError {
  error: { code: string; message: string };
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options, false);
  }

  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({
      error: { code: "UNKNOWN", message: res.statusText },
    }));
    throw new Error(body.error?.message ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;
  try {
    const data = await request<{ access_token: string; refresh_token: string }>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
      false
    );
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return true;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return false;
  }
}

// ── Farm types ──────────────────────────────────────────────────────────────

export interface FarmResponse {
  farm_id: string;
  user_id: string;
  name: string;
  region: string | null;
  area_hectares: number;
  latitude: number | null;
  longitude: number | null;
  current_crop: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FarmCreate {
  name: string;
  region?: string;
  area_hectares: number;
  latitude?: number;
  longitude?: number;
  current_crop?: string;
}

export interface FarmUpdate {
  name?: string;
  region?: string;
  area_hectares?: number;
  latitude?: number;
  longitude?: number;
  current_crop?: string;
}

export interface SoilReportResponse {
  report_id: string;
  farm_id: string;
  ph_level: number | null;
  moisture_percent: number | null;
  nitrogen_ppm: number | null;
  phosphorus_ppm: number | null;
  potassium_ppm: number | null;
  organic_matter_percent: number | null;
  notes: string | null;
  reported_at: string;
  created_at: string;
}

export interface SoilReportCreate {
  ph_level?: number;
  moisture_percent?: number;
  nitrogen_ppm?: number;
  phosphorus_ppm?: number;
  potassium_ppm?: number;
  organic_matter_percent?: number;
  notes?: string;
}

export interface CropHistoryResponse {
  history_id: string;
  farm_id: string;
  crop_name: string;
  sown_date: string | null;
  harvest_date: string | null;
  yield_tons: number | null;
  season: string | null;
  created_at: string;
}

export interface CropHistoryCreate {
  crop_name: string;
  sown_date?: string;
  harvest_date?: string;
  yield_tons?: number;
  season?: string;
}

// ── Predictions ──────────────────────────────────────────────────────────────

export interface SoilPredictionResponse {
  soil_type: string;
  confidence: number;
  deficiencies: string[];
  recommendations: string[];
  prediction_id: string;
}

export interface SoilPredictionRequest {
  report_id?: string;
  inline_values?: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    moisture: number;
  };
}

// ── User types ───────────────────────────────────────────────────────────────

export interface UserResponse {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const api = {
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) =>
    request<UserResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  refresh: (refresh_token: string) =>
    request<TokenResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    }),

  logout: (refresh_token: string) =>
    request<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    }),

  me: () => request<UserResponse>("/auth/me"),

  updateProfile: (data: { full_name?: string; phone?: string }) =>
    request<UserResponse>("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ── Farms ──────────────────────────────────────────────────────────────────

  createFarm: (data: FarmCreate) =>
    request<FarmResponse>("/farms", { method: "POST", body: JSON.stringify(data) }),

  getFarms: (page = 1, pageSize = 20) =>
    request<FarmResponse[]>(`/farms?page=${page}&page_size=${pageSize}`),

  getFarm: (farmId: string) => request<FarmResponse>(`/farms/${farmId}`),

  updateFarm: (farmId: string, data: FarmUpdate) =>
    request<FarmResponse>(`/farms/${farmId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteFarm: (farmId: string) =>
    request<void>(`/farms/${farmId}`, { method: "DELETE" }),

  // ── Soil Reports ───────────────────────────────────────────────────────────

  createSoilReport: (farmId: string, data: SoilReportCreate) =>
    request<SoilReportResponse>(`/farms/${farmId}/soil-reports`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSoilReports: (farmId: string, page = 1, pageSize = 20) =>
    request<SoilReportResponse[]>(
      `/farms/${farmId}/soil-reports?page=${page}&page_size=${pageSize}`
    ),

  deleteSoilReport: (farmId: string, reportId: string) =>
    request<void>(`/farms/${farmId}/soil-reports/${reportId}`, { method: "DELETE" }),

  // ── Crop History ───────────────────────────────────────────────────────────

  addCropHistory: (farmId: string, data: CropHistoryCreate) =>
    request<CropHistoryResponse>(`/farms/${farmId}/crop-history`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCropHistory: (farmId: string, page = 1, pageSize = 20) =>
    request<CropHistoryResponse[]>(
      `/farms/${farmId}/crop-history?page=${page}&page_size=${pageSize}`
    ),

  // ── Predictions ────────────────────────────────────────────────────────────

  predictSoil: (data: SoilPredictionRequest) =>
    request<SoilPredictionResponse>("/predict/soil", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
