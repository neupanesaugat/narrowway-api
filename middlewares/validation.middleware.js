//? Function Factory => function returning a function

const validateReqBody = (validationSchema) => {
  //? pass the validateSchema value to this function factory
  return async (req, res, next) => {
    //? this function returns a function
    const data = req.body;

    try {
      const validateAdmin = await validationSchema.validate(data); //? it only validateSchema so return this value to the function
      req.body = validateAdmin;
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
    next();
  };
};

export default validateReqBody;
