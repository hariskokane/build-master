import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('budgetUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    setTimeout(checkAuth, 500); // Simulate API call
  }, []);

  const login = (email: string, password: string) => {
    // Mock login - in real app, this would be an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Check if user exists in localStorage
          const existingUsers = JSON.parse(localStorage.getItem('budgetUsers') || '[]');
          const existingUser = existingUsers.find((u: User) => u.email === email);
          
          if (existingUser) {
            setUser(existingUser);
            localStorage.setItem('budgetUser', JSON.stringify(existingUser));
            resolve();
          } else {
            reject(new Error('User not found. Please sign up first.'));
          }
        } else {
          reject(new Error('Please enter email and password'));
        }
      }, 1000);
    });
  };

  const signup = (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    occupation: string;
    monthlyIncome: number;
    address: string;
  }) => {
    // Mock signup - in real app, this would be an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (userData.name && userData.email && userData.password && userData.phone && userData.address) {
          // Check if user already exists
          const existingUsers = JSON.parse(localStorage.getItem('budgetUsers') || '[]');
          const userExists = existingUsers.some((u: User) => u.email === userData.email);
          
          if (userExists) {
            reject(new Error('User with this email already exists'));
            return;
          }

          const newUser: User = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            occupation: userData.occupation,
            monthlyIncome: userData.monthlyIncome,
            address: userData.address
          };

          // Save to users list
          const updatedUsers = [...existingUsers, newUser];
          localStorage.setItem('budgetUsers', JSON.stringify(updatedUsers));
          
          // Set current user
          setUser(newUser);
          localStorage.setItem('budgetUser', JSON.stringify(newUser));
          resolve();
        } else {
          reject(new Error('Please fill all required fields'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('budgetUser');
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout
  };
};