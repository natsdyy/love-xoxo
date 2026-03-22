// Authentication configuration with all user credentials
export interface User {
  username: string;
  password: string;
  role: 'admin' | 'owner';
  displayName: string;
}

export const USERS: User[] = [
  // Owner
  {
    username: 'ownereli',
    password: 'silverdawn',
    role: 'owner',
    displayName: 'Eli'
  },
  // Admins
  {
    username: 'admin_cherry',
    password: 'xzshop123',
    role: 'admin',
    displayName: 'Cherry'
  },
  {
    username: 'admin_mir',
    password: 'xzshop123',
    role: 'admin',
    displayName: 'Mir'
  },
  {
    username: 'admin_sica',
    password: 'xzshop123',
    role: 'admin',
    displayName: 'Sica'
  }
];

// Validate user credentials
export const validateCredentials = (username: string, password: string): User | null => {
  const user = USERS.find(u => u.username === username && u.password === password);
  return user || null;
};

// Get user display name from username
export const getUserDisplayName = (username: string): string => {
  const user = USERS.find(u => u.username === username);
  return user?.displayName || username;
};

// Get user role from username
export const getUserRole = (username: string): 'admin' | 'owner' | null => {
  const user = USERS.find(u => u.username === username);
  return user?.role || null;
};
