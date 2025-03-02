
const users = ["Samet","Didem","Ali","Sedat"];

localStorage.setItem("users",JSON.stringify(users));

console.log(JSON.parse(localStorage.getItem("users")));