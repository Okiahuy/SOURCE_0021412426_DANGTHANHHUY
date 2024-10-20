export interface User {
  userID: number;            // ID của người dùng
    username: string;     // Tên người dùng
    email: string;        // Địa chỉ email
    password: string;    // Mật khẩu (có thể không cần thiết nếu không muốn gửi qua API)
    fullname: string;
    address: string;
    phone: string;
  }