const userValidatorSchema = {
  title: "User request payload",
  type: "object",
  properties: {
    name: { type: "string", minLength: 5, maxLength: 100 },
    email: {
      type: "string",
      format: "email",
    },
    // password: {
    //   type: "string",
    //   format: "password",
    //   pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$",
    // },
    mobile: {
      type: "string",
      minLength: 10,
      maxLength: 15,
    },
  },
  required: ["name", "email"],
  additionalProperties: true,
};

module.exports = userValidatorSchema;
