import React from 'react';
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

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell align="center">#</TableCell>
            <TableCell align="center">الإسم</TableCell>
            <TableCell align="center">الصورة</TableCell>
            <TableCell align="center">المدينة</TableCell>
            <TableCell align="center">القارة</TableCell>
            <TableCell align="center">الدولة</TableCell>
            <TableCell align="center">رمز الدولة</TableCell>
            <TableCell align="center">العلم</TableCell>
            <TableCell align="center">تاريخ الإنشاء</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
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
                <Avatar alt={user.userImg} src={user.userImg} />
              </TableCell>
              <TableCell align="center">{user.city}</TableCell>
              <TableCell align="center">{user.continent}</TableCell>
              <TableCell align="center">{user.country}</TableCell>
              <TableCell align="center">{user.country_code}</TableCell>
              <TableCell align="center">{user.flag.emoji}</TableCell>
              <TableCell align="center">
                {new Date(user.dateSet).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
