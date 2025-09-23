export const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

//validate password
export const validatePassword = (value) => {
  const rule = [];
  if (value.length < 8) rule.push("Tối thiểu 8 kí tự");
  if (!/[a-zA-Z]/.test(value))
    rule.push("Tối thiểu một chữ cái [a-z hoặc A-Z]");
  if (!/[0-9]/.test(value)) rule.push("Tối thiểu một chữ số [0-9]");
  if (!/[^a-zA-Z0-9]/.test(value)) rule.push("Tối thiểu một ký tự đặc biệt");
  return rule;
};
