export const patternValidate = {
  password:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,19}$/,
  phone: /^0\d{0,9}$/,
  // eslint-disable-next-line no-useless-escape
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};
