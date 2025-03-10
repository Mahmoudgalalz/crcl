import { ApiSuccessResponse, Transaction, User } from "../types";
import { axiosInstance } from "./instance";

export async function getReaders(page: number, search: string) {
  try {
    const resForReader = await axiosInstance.get<
      ApiSuccessResponse<{
        users: User[];
        meta: {
          total: number;
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }>
    >(
      `/users?types=READER&page=${page}&limit=5&search=${search}&notification=false`
    );

    const reader = resForReader.data.data;
    return reader;
  } catch (error) {
    console.error(error);
  }
}

export async function getBooths() {
  try {
    const resForBooths = await axiosInstance.get<{
      status: string;
      message: string;
      data: {
        booths: User[];
        tokenPrice: number;
      };
    }>("/booth");

    const booths = resForBooths.data.data;
    return booths;
  } catch (error) {
    console.error(error);
  }
}

export async function withdrawBoothMoney(boothId: string, amount: number) {
  try {
    const res = await axiosInstance.post<
      ApiSuccessResponse<{
        id: string;
        userId: string;
        balance: number;
      }>
    >(`/booth/${boothId}/withdraw`, {
      amount,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getBoothTrans(id: string, page: number) {
  try {
    const resForBooths = await axiosInstance.get<
      ApiSuccessResponse<{
        boothTransactions: {
          transactions: Transaction[];
          totalPages: number;
          currentPage: number;
          totalTransactions: number;
          transactionsCount: number;
        };
        tokenPrice: {
          tokenPrice: number;
        };
      }>
    >(`/booth/${id}?limit=5&page=${page}`);

    const booths = resForBooths.data.data;
    return booths;
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(
  page: number,
  search: string,
  notification: boolean = false
) {
  try {
    const res = await axiosInstance.get<
      ApiSuccessResponse<{
        users: User[];
        meta: {
          total: number;
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }>
    >(
      `/users?types=USER&page=${page}&limit=10&notification=${notification}${
        search ? "&search=" + search.replace(" ", "+") : ""
      }`
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUser(id: string) {
  try {
    const res = await axiosInstance.get<ApiSuccessResponse<User>>(
      `/users/${id}`
    );
    const data = res.data.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function createUser(user: Partial<User>) {
  try {
    const res = await axiosInstance.post<User>("/users", user);
    const data = res.data;
    console.log(data, res);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await axiosInstance.delete<User>(`/users/${id}`);
    console.log(res);
    const data: User = res.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserStatus(id: string, status: string) {
  try {
    const res = await axiosInstance.put<ApiSuccessResponse<User>>(
      `/users/${id}`,
      {
        status,
      }
    );
    const data = res.data.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserWallet(id: string, amount: number) {
  try {
    const res = await axiosInstance.patch<
      ApiSuccessResponse<{
        id: string;
        userId: string;
        balance: number;
      }>
    >(`/users/wallet/${id}`, {
      top: amount,
    });
    const data = res.data.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}
