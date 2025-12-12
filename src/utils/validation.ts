export const validateStudentId = (studentId: string): boolean => {
  // Accept only 8-digit integer student ID (e.g., "20250001")
  const studentIdRegex = /^\d{8}$/;
  return studentIdRegex.test(studentId);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  return { valid: true };
};

export const validateSignupInput = (name: string, studentId: string, password: string) => {
  if (!name || !studentId || !password) {
    throw new Error("Name, student ID, and password are required");
  }
  if (!validateStudentId(studentId)) {
    throw new Error("Student ID must be an 8-digit number");
  }
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }
};

export const validateLoginInput = (studentId: string, password: string) => {
  if (!studentId || !password) {
    throw new Error("Student ID and password are required");
  }
  if (!validateStudentId(studentId)) {
    throw new Error("Student ID must be an 8-digit number");
  }
};
