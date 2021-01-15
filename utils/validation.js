const valid = (name, email, password) => {
  if (!name || !email || !password) {
    return 'Please fill in all fields!';
  }
};

export default valid;
