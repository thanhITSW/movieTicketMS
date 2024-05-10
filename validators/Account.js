function validator(fullname, email) {
    if (fullname.length < 3) {
        return 'Full name must be at least 3 characters'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email'
    }

    return ''
  };

module.exports = validator;