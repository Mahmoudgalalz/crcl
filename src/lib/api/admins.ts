import { SuperUser } from "../types";
import { axiosInstance } from "./instance";

export async function getAdmins() {
  try {
    const response = await axiosInstance.get("/users/super/users");
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function createAdmin(admin: SuperUser) {
  try {
    const response = await axiosInstance.post("/users/super", admin);
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      admin: SuperUser;
    };
  }
}

export async function deleteAdmin(id: string) {
  try {
    console.log("Deleting admin with ID:", id);
    const response = await axiosInstance.delete<SuperUser>(
      `/users/super/${id}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

// export async function changePasswordAdmin(id: string, newPassword: string) {
//   try {
//     const response = await axiosInstance.patch<SuperUser>(`/admin/${id}`, {
//       password: newPassword,
//     });
//     const data = response.data;
//     return data;
//   } catch (error) {
//     console.error(error);
//     return {} as unknown as {
//       admin: SuperUser;
//     };
//   }
// }

export async function updateAdmin(id: string, newInfo: Partial<SuperUser>) {
  try {
    const response = await axiosInstance.put<SuperUser>(`/users/super/${id}`, {
      ...newInfo,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      admin: SuperUser;
    };
  }
}
