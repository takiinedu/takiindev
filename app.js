// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDUPrrqrwxKWUTN1MD8gFBZrWVceem_akg",
  authDomain: "login-c082a.firebaseapp.com",
  databaseURL: "https://login-c082a-default-rtdb.firebaseio.com",
  projectId: "login-c082a",
  storageBucket: "login-c082a.appspot.com",
  messagingSenderId: "782243237767",
  appId: "1:782243237767:web:6fd691f122bdd840b38d22",
  measurementId: "G-MLY60106H5"
});

const analytics = getAnalytics(app);
const db = getFirestore(app); // Khởi tạo Firestore

// Xử lý sự kiện gửi form
document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const studentId = document.getElementById("studentId").value;
    const track = document.getElementById("track").value;

    // Kiểm tra xem studentId có đúng định dạng không (8 số)
    if (!/^\d{8}$/.test(studentId)) {
        alert("Mã sinh viên phải là 8 số!");
        return;
    }

    try {
        // Kiểm tra xem studentId đã tồn tại hay chưa
        const userDocRef = doc(db, "users", studentId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            alert("Mã sinh viên đã được sử dụng!");
            return;
        }

        // Kiểm tra xem email đã tồn tại hay chưa
        const emailQuery = query(collection(db, "users"), where("email", "==", email));
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
            alert("Email đã được sử dụng!");
            return;
        }

        // Tạo document cho người dùng với ID là studentId
        await setDoc(userDocRef, {
            fullname, // Lưu các trường trong document
            studentId,
            track,
            email
        });

        alert("Thông tin đã được gửi thành công!");
        document.querySelector("form").reset(); // Reset form sau khi gửi
    } catch (e) {
        console.error("Lỗi khi thêm tài liệu: ", e);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
});
