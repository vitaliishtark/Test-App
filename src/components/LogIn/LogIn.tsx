'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useLocalStorage from '@/utils/hooks/useLocalStorage';
import { redirect } from 'next/navigation';

type LoginFormData = {
  iban: string;
};

const LoginUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [isUserActive, setIsUserActive] = useLocalStorage("isUserActive", false);
  const [userId, setUserId] = useLocalStorage("userId", "");

  useEffect(() => {
    if (isUserActive) {
      redirect('/account-statement');
    }
  }, [isUserActive]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        iban: data.iban,
      });

      const { id } = response.data;

      if (id) {
        setUserId(id);
        setIsUserActive(true);
        alert('Login successful');
      } else {
        alert('Invalid IBAN or user not found');
      }
    } catch (error) {
      alert('Failed to log in user');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Log In</h1>

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="IBAN"
          {...register('iban', { required: 'IBAN is required' })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.iban && <p className="text-red-500 text-sm">{errors.iban.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginUser;
