export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
// Sirf yeh Zod validate karega (body se aayega)
export interface LoginDTO {
  email: string;
  password: string;
}

// Yeh alag rakho — controller internally banayega
export interface LoginContext {
  ipAddress: string;
  userAgent: string;
}

export interface profileDTO {

    phone?: string;
  address?: string;
  city?: string;
  state?: string;
  date_of_birth?: string;
}

// Internal user creation data
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role_id: number;
}


export interface CreateSessionData {
  user_id: number;
  session_token: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
}