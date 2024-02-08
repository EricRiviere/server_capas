import usersDao from "../dao/mdbManagers/users.dao.js";

export const getUsers = async () => {
  return await usersDao.getAllUsers();
};

export const getUser = async (userId) => {
  return await usersDao.getUser(userId);
};

export const deleteUser = async (userId) => {
  return await usersDao.deleteUser(userId);
};
