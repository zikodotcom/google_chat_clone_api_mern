exports.handleError = (err) => {
  // TODO Extract keys from error object
  if (err.code == 11000) {
    return {
      email: "The email is already exists",
    };
  } else {
    const keys = Object.keys(err.errors);
    const errList = {};
    keys.map((el) => {
      errList[el] = err.errors[el].properties.message;
    });
    return errList;
  }
};
