
import {
  students,
  products,
  activities,
} from "../data/mockData";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
const USE_MOCK = false; // LB added

export async function fetchJson(path, options = {}) {
  if (USE_MOCK) {
    console.log("MOCK API:", path);

    // ---------- PRODUCTS ----------
    if (path === "/api/products/") {
      return Promise.resolve(products);
    }

    // ---------- STUDENTS ----------
    if (path === "/api/students/") {
      return Promise.resolve(students);
    }

    // ---------- STUDENT ACTIVITIES ----------
    if (path.includes("/activities")) {
      const studentId = Number(path.split("/")[3]); // /api/students/:id/activities/
      return Promise.resolve(
        activities.filter(a => a.studentId === studentId)
      );
    }

    // ---------- CREATE PURCHASE ----------
    if (path === "/api/purchases/create/") {
      const body = JSON.parse(options.body || "{}");

      const product = products.find(p => p.id === body.productId);
      const student = students.find(s => s.id === body.studentId);

      if (!product || !student) {
        throw new Error("Invalid product or student");
      }

      if (student.balance < product.price) {
        throw new Error("Insufficient balance");
      }

      // simulate purchase
      student.balance -= product.price;

      const newActivity = {
        id: Date.now(),
        studentId: student.id,
        studentName: student.name,
        product: product.name,
        date: new Date().toLocaleDateString(),
        amount: product.price,
        description: body.description || "Purchase",
      };

      activities.unshift(newActivity);

      return Promise.resolve({
        ...newActivity,
        balance: student.balance,
      });
    }

    // ---------- UPDATE PURCHASE (edit/refund) ----------
    if (path.includes("/api/purchases/") && options.method === "PATCH") {
      const id = Number(path.split("/")[3]);
      const body = JSON.parse(options.body || "{}");

      const activity = activities.find(a => a.id === id);
      if (!activity) throw new Error("Activity not found");

      const student = students.find(s => s.id === activity.studentId);

      // REFUND
      if (body.refund) {
        if (!activity.refunded) {
          activity.refunded = true;
          student.balance += activity.amount;
        }
      }

      // EDIT AMOUNT
      if (body.amount != null) {
        const diff = body.amount - activity.amount;
        activity.amount = body.amount;
        student.balance -= diff;
      }

      return Promise.resolve({
        ...activity,
        balance: student.balance,
        studentId: student.id,
      });
    }

    // ---------- DELETE PRODUCT ----------
    if (path.includes("/api/products/") && options.method === "DELETE") {
      const id = Number(path.split("/")[3]);
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) products.splice(index, 1);
      return Promise.resolve({});
    }

    // ---------- CREATE PRODUCT ----------
    if (path === "/api/products/create/") {
      const body = JSON.parse(options.body || "{}");
      const newProduct = {
        id: Date.now(),
        ...body,
      };
      products.unshift(newProduct);
      return Promise.resolve(newProduct);
    }

    // ---------- UPDATE PRODUCT ----------
    if (path.includes("/api/products/") && options.method === "PATCH") {
      const id = Number(path.split("/")[3]);
      const body = JSON.parse(options.body || "{}");

      const product = products.find(p => p.id === id);
      Object.assign(product, body);

      return Promise.resolve(product);
    }

    // fallback
    return Promise.resolve([]);
  }

  // ---------- REAL API ----------
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}
