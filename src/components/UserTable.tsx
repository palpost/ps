import React from 'react';
import { MdDelete } from 'react-icons/md';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';
import styles from '../app/status/LoginPage.module.css';

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

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell align="center">#</TableCell>
            <TableCell align="center">المعرف</TableCell>
            <TableCell align="center">الإسم</TableCell>
            <TableCell align="center">الصورة</TableCell>
            <TableCell align="center">المدينة</TableCell>
            <TableCell align="center">القارة</TableCell>
            <TableCell align="center">الدولة</TableCell>
            <TableCell align="center">العلم</TableCell>
            <TableCell align="center">تاريخ الإنشاء</TableCell>
            <TableCell align="center">إجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map(
              (user, index) =>
                user != null && (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{user.id.toString()}</TableCell>
                    <TableCell align="center">
                      {user.user ? (
                        <a target="_blank" href={'https://x.com/' + user.user}>
                          {user.user}
                        </a>
                      ) : (
                        'لم يحدد'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <a href={user.userImg} target="_blank">
                        <Avatar alt={user.id.toString()} src={user.userImg} />
                      </a>
                    </TableCell>
                    <TableCell align="center">{user.city}</TableCell>
                    <TableCell align="center">{user.continent}</TableCell>
                    <TableCell align="center">{user.country}</TableCell>
                    <TableCell align="center">{user.flag.emoji}</TableCell>
                    <TableCell align="center">
                      {new Date(user.dateSet).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <button
                        onClick={() => onDelete(user.id)}
                        className={`${styles.fetchButton} ${styles.btndelet}`}
                      >
                        <MdDelete style={{ fontSize: 22 + 'px' }} />
                      </button>
                    </TableCell>
                  </TableRow>
                )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
