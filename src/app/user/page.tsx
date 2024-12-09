'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useLocalStorage from '@/utils/hooks/useLocalStorage';
import { redirect } from 'next/navigation';

type CreateFormData = {
  name: string;
  iban: string;
  balance: number;
};

type LoginFormData = {
  iban: string;
};

const UserForm = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'login'>('create');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData & LoginFormData>();
  const [isUserActive, setIsUserActive] = useLocalStorage('isUserActive', false);
  const [userId,setUserId] = useLocalStorage('userId', '');

  if(isUserActive){
    redirect('/home')
  }

  const handleCreate = async (data: CreateFormData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/users/create`, {
        name: data.name,
        iban: data.iban,
        balance: Number(data.balance),
      });
      alert('User created successfully');
      reset();
    } catch (error) {
      alert('Failed to create user');
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/users/login`, {
        iban: data.iban,
      });
      const { user } = response?.data;

      console.log(response.status)

      if (user.iban) {
        setIsUserActive(true);
        setUserId(user.iban)
        alert('Login successful');
      } else {
        alert('Invalid IBAN or user not found');
      }
    } catch (error) {
      alert('Failed to log in user');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Create User
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`px-4 py-2 rounded-md ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Log In
        </button>
      </div>

      {activeTab === 'create' && (
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Create User</h2>

          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Name"
              {...register('name', { required: 'Name is required' })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              type="text"
              placeholder="IBAN"
              {...register('iban', { required: 'IBAN is required' })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.iban && <p className="text-red-500 text-sm">{errors.iban.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Balance"
              {...register('balance', { required: 'Balance is required' })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.balance && <p className="text-red-500 text-sm">{errors.balance.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create User
          </button>
        </form>
      )}

      {activeTab === 'login' && (
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Log In</h2>

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
      )}
    </div>
  );
};

export default UserForm;
