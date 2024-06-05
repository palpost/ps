'use client';
import React, { useState } from 'react';
import UserTable from '../../components/UserTable';
import styles from './LoginPage.module.css';
interface User {
  user: string;
  userImg: string;
  city: string;
  continent: string;
  country: string;
  country_code: string;
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
    if (userAdmin == 'admin' && password == 's120120130S') {
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

  return (
    <>
      {showData ? (
        <div className={styles.table}>
          <UserTable users={users} />
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
