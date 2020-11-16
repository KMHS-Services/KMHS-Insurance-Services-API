const bcrypt = require('bcryptjs');
let password='saikiran9620@gmail.com'
let hashedpassword='$2a$10$7U0qe7bkchfdpMzVgs1MZOkzv2zA/VjCxlVZ6Gdcvwaysx7nNPuYu'
console.log(bcrypt.compareSync(password,hashedpassword));