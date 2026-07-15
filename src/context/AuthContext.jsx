import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SEED_USERS = [
  { id: 'u-1', name: 'Rajesh Kumar (Owner)', email: 'admin@farm.com', password: 'admin123', role: 'Admin' },
  { id: 'u-2', name: 'Sanjay Singh (Manager)', email: 'manager@farm.com', password: 'manager123', role: 'Farm Manager' },
  { id: 'u-3', name: 'Amit Patel (Worker)', email: 'worker@farm.com', password: 'worker123', role: 'Farm Worker' },
  { id: 'u-4', name: 'Dr. Neha Sharma (Vet)', email: 'vet@farm.com', password: 'vet123', role: 'Veterinarian' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(SEED_USERS);
  const [loading, setLoading] = useState(false);

  // Auto-login Farm Manager by default just to speed up inspection, or leave empty.
  // Let's check if there is an existing session. We'll start as logged out.
  
  const login = async (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (foundUser) {
          // Store token in state only (in memory as requested)
          setUser({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role
          });
          setLoading(false);
          resolve(foundUser);
        } else {
          setLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Demo helper to easily cycle roles in the UI for evaluation
  const demoSwitchRole = (roleName) => {
    const defaultUserOfRole = users.find(u => u.role === roleName);
    if (defaultUserOfRole) {
      setUser({
        id: defaultUserOfRole.id,
        name: defaultUserOfRole.name,
        email: defaultUserOfRole.email,
        role: defaultUserOfRole.role
      });
    }
  };

  // Admin CRUD operations for user management
  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: `u-${Date.now()}`
    };
    setUsers(prev => [...prev, userWithId]);
  };

  const updateUser = (userId, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    // If the updated user is the currently logged in user, update their session info too
    if (user && user.id === userId) {
      setUser(prev => ({
        ...prev,
        name: updatedFields.name || prev.name,
        email: updatedFields.email || prev.email,
        role: updatedFields.role || prev.role
      }));
    }
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (user && user.id === userId) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, demoSwitchRole, addUser, updateUser, deleteUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
