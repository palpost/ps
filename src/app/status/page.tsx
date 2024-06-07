'use client';
import React, { useState } from 'react';
import UserTable from '../../components/UserTable';
import styles from './LoginPage.module.css';
import { setData } from '../api/dataUseing/data';

interface User {
  id: number;
  user: string;
  userImg: string;
  city: string;
  continent: string;
  country: string;
  flag: {
    emoji: string;
  };
  dateSet: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showData, setShowData] = useState(false);
  const [userAdmin, setUserAdmin] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAdmin(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform login logic here, like calling an API endpoint
    if (
      userAdmin == process.env.NEXT_PUBLIC_USER_ADMINS &&
      password == process.env.NEXT_PUBLIC_USER_PASSWORD
    ) {
      fetchUsers();
      setShowData(true);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch(
      'https://palestine-2f5c9-default-rtdb.firebaseio.com/users.json'
    );
    const data = await response.json();
    setUsers(data);
  };

  const handleDelete = async (id: number) => {
    const result = await setData(null, null, true, id);
    if (result.type === 'remove' && result.deleted) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } else {
      console.log(result.msg);
    }
  };

  return (
    <>
      {showData ? (
        <div className={styles.table}>
          <UserTable users={users} onDelete={handleDelete} />
          <button onClick={fetchUsers} className={styles.fetchButton}>
            تحديث
          </button>
        </div>
      ) : (
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="user">username:</label>
              <input
                type="text"
                id="user"
                value={userAdmin}
                onChange={handleEmailChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Login
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Home;
