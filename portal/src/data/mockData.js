// Mock data for LogicCoin Bank

export const students = [
  { id: 1, name: "Bob", balance: 300 },
  { id: 2, name: "Richard", balance: 250 },
  { id: 3, name: "Student 03", balance: 180 },
  { id: 4, name: "Student 04", balance: 420 }
];

export const products = [
  {
    id: 1,
    name: "Cheet Sheet on Exam",
    description: "1 paper, 2 sides\nYou choose which exam to use\nRefundable",
    price: 140,
    terms: ["Term 01", "Term 02", "Term 03"]
  },
  {
    id: 2,
    name: "Product 2",
    description: "",
    price: 40,
    terms: ["Term 01", "Term 02", "Term 03"]
  },
  {
    id: 3,
    name: "Product 3",
    description: "",
    price: 80,
    terms: ["Term 01", "Term 02", "Term 03"]
  }
];

export const activities = [
  {
    id: 1,
    studentId: 1,
    studentName: "Bob",
    type: "Purchase",
    product: "Exam Cheet Sheet",
    date: "05/02/2025",
    amount: 150,
    description: "Purchase 01"
  },
  {
    id: 2,
    studentId: 1,
    studentName: "Bob",
    type: "Purchase",
    product: "Product 2",
    date: "06/02/2025",
    amount: 40,
    description: "Purchase 02"
  },
  {
    id: 3,
    studentId: 1,
    studentName: "Bob",
    type: "Purchase",
    product: "Product 3",
    date: "07/02/2025",
    amount: 80,
    description: "Purchase 03"
  },
  {
    id: 4,
    studentId: 1,
    studentName: "Bob",
    type: "Purchase",
    product: "Product 1",
    date: "08/02/2025",
    amount: 100,
    description: "Purchase 04"
  }
];

export const instructors = [
  { id: 1, name: "Instructor's name" }
];

