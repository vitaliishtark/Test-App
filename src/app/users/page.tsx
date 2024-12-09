'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/users`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className="text-3xl font-semibold text-center mb-6">Users</h1>
          <ul className="space-y-4">
            {users.length > 0 ? (
              users.map((user, index) => (
                <div key={index}>
                  <pre className="text-black">{JSON.stringify(user, null, 2)}</pre>
                </div>
              ))
            ) : (
              <li className="text-gray-700 text-center">No users found.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
