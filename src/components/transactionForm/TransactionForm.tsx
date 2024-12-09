import { useForm, FieldError } from 'react-hook-form';
import axios from 'axios';
import React, { useState } from 'react';

interface TransactionFormProps {
  updateBalance: React.Dispatch<React.SetStateAction<number>>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ updateBalance }) => {
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [iban, setIban] = useState('');
  const [error, setError] = useState<string | null>('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const transaction = {
    userId: "461f87d1-64d5-4d62-9f7e-469486fcce27",
    receiverIban: "GB29XABC10161234567802",
    amount: 100
  };

  const onSubmit = async (data: any) => {
    try {
      const { amount, userId, iban } = data;
      const body: { receiverIban: string; userId: string, amount: number } = {
        userId: userId,
        amount: Number(amount),
        receiverIban: iban,
      };
      if (transactionType === 'transfer') {
        body.receiverIban = iban;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/transactions/${transactionType}`, body);
      setError(null);
      updateBalance(response.data.newBalance);
    } catch (error) {
      setError('Failed');
    }
  };

  return (
    <div className="w-full max-w-[60%] mx-auto p-6 bg-white shadow-lg rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">User ID:</label>
          <input
            type="text"
            {...register('userId', { required: 'User ID is required' })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.userId && <span className="text-red-500 text-sm">{(errors.userId as FieldError)?.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Amount:</label>
          <input
            type="number"
            {...register('amount', { required: 'Amount is required' })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && <span className="text-red-500 text-sm">{(errors.amount as FieldError)?.message}</span>}
        </div>

        {transactionType === 'transfer' && (
          <div className="mb-4">
            <div className="w-full">
            <pre className="block text-gray-700 font-semibold mb-2 overflow-x-auto p-4 whitespace-pre-wrap break-words">
  {JSON.stringify(transaction, null, 2)}
</pre>

            </div>
            <label className="block text-gray-700 font-semibold mb-2">IBAN:</label>
            <input
              type="text"
              {...register('iban', { required: 'IBAN is required' })}
              onChange={(e) => setIban(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.iban && <span className="text-red-500 text-sm">{(errors.iban as FieldError)?.message}</span>}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Transaction Type:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="deposit"
                checked={transactionType === 'deposit'}
                onChange={() => setTransactionType('deposit')}
                className="mr-2"
              />
              Deposit
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="withdraw"
                checked={transactionType === 'withdraw'}
                onChange={() => setTransactionType('withdraw')}
                className="mr-2"
              />
              Withdraw
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="transfer"
                checked={transactionType === 'transfer'}
                onChange={() => setTransactionType('transfer')}
                className="mr-2"
              />
              Transfer
            </label>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
