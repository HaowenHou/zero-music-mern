import bcrypt from 'bcryptjs';

// Function to verify user password
export async function verifyPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
