const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// Auth
export const api = {
  auth: {
    sendOtp: (phone: string) =>
      request<{ message: string }>("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
    verifyOtp: (phone: string, code: string) =>
      request<{ message: string }>("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      }),
    register: (name: string, phone: string, password: string) =>
      request<{ user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, phone, password }),
      }),
    login: (phone: string, password: string) =>
      request<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      }),
    logout: () =>
      request<{ message: string }>("/api/auth/logout", { method: "POST" }),
    me: () => request<{ user: User }>("/api/auth/me"),
  },
  products: {
    list: () => request<{ products: Product[] }>("/api/products"),
    get: (slug: string) => request<{ product: Product }>(`/api/products/${slug}`),
  },
  addresses: {
    list: () => request<{ addresses: Address[] }>("/api/addresses"),
    create: (data: AddressInput) =>
      request<{ address: Address }>("/api/addresses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: AddressInput) =>
      request<{ address: Address }>(`/api/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/addresses/${id}`, { method: "DELETE" }),
  },
  orders: {
    create: (data: CreateOrderInput) =>
      request<{ order: Order }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    cancel: (id: string) =>
      request<{ order: Order }>(`/api/orders/${id}/cancel`, {
        method: "POST",
      }),
    list: () => request<{ orders: Order[] }>("/api/orders"),
    get: (id: string) => request<{ order: Order }>(`/api/orders/${id}`),
  },
  admin: {
    stats: () => request<{ stats: AdminStats }>("/api/admin/stats"),
    orders: (status?: string) =>
      request<{ orders: AdminOrder[] }>(`/api/admin/orders${status && status !== "ALL" ? `?status=${status}` : ""}`),
    order: (id: string) => request<{ order: AdminOrder }>(`/api/admin/orders/${id}`),
    advanceStatus: (id: string, status: string) =>
      request<{ order: AdminOrder }>(`/api/admin/orders/${id}/status`, {
        method: "POST",
        body: JSON.stringify({ status }),
      }),
  },
};

// Types
export type User = {
  id: string;
  name: string;
  phone: string;
  isGuest: boolean;
  isPhoneVerified?: boolean;
  isAdmin?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryJp: string;
  color: string;
  colorHex: string;
  price: number;
  img: string;
  modelImg: string;
  description: string;
  sizes: string[];
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
};

export type AddressInput = Omit<Address, "id" | "isDefault"> & {
  isDefault?: boolean;
};

export type OrderItem = {
  id: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingLandmark?: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
};

export type AdminOrder = Order & {
  user: { name: string; phone: string };
};

export type AdminStats = {
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  todayOrders: number;
};

export type CreateOrderInput = {
  shippingName: string;
  shippingPhone: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingLandmark?: string;
  items: { productSlug: string; size: string; qty: number }[];
  guestName?: string;
  guestPhone?: string;
};
