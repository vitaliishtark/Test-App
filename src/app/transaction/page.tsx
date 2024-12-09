"use client"

import React, { useState, useEffect } from 'react';
import TransactionForm from '@/components/transactionForm/TransactionForm';
import useLocalStorage from '@/utils/hooks/useLocalStorage';
import { redirect } from 'next/navigation';

const TransactionPage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isUserActive] = useLocalStorage("isUserActive", false);

  useEffect(()=>{
    if(!isUserActive){
      redirect('/user')
    }
    },[!isUserActive])

  return (
    <div>
      <TransactionForm updateBalance={setBalance} />
    </div>
  );
};

export default TransactionPage;
