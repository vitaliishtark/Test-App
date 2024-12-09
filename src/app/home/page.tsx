'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation';
import useLocalStorage from '@/utils/hooks/useLocalStorage';

const Home = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isUserActive] = useLocalStorage('isUserActive', false);
  const [userId] = useLocalStorage('userId', '');

  useEffect(() => {
    if (!isUserActive) {
      redirect('/user');
    }
  }, [isUserActive]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/users/get-by-iban/${userId}`)
      .then((response) => {
        const { user, transactions } = response.data;
        setUserDetails(user);
        setTransactions(transactions || []);
      })
      .catch((error) => console.error('Error fetching user details and transactions:', error));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-semibold text-center mb-6">Account Statement</h1>

      {userDetails && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-medium">User: {userDetails.name}</h2>
          <p>IBAN: {userDetails.iban}</p>
          <p>Balance: {userDetails.balance} EUR</p>
        </div>
      )}

      <ul className="space-y-4">
        {transactions.length > 0 ? (
          transactions
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((transaction) => (
              <li
                key={transaction.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <span className="text-black">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`${
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                </span>
                <span className="text-black">{transaction.balance}</span>
              </li>
            ))
        ) : (
          <li className="text-center text-black">No transactions found</li>
        )}
      </ul>
    </div>
  );
};

export default Home;
