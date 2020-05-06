exports.createPostValidator = (req,res,next) => {
    //title
    req.check('title',"write a title").notEmpty()
    req.check('title','Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });
    //body
    req.check('body',"write a body").notEmpty()
    req.check('body','Body must be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
    });
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
};


exports.userSignupValidator = (req,res,next) => {
    req.check('name',"Please enter a name").notEmpty();
    
    req.check('email',"Please enter an valid email").isEmail();
    //password
    req.check('password',"Please enter a Password").notEmpty();
    req.check('password')
    .isLength({ min: 6 })
    .withMessage("Password must contain atleast 6 characters")
    .matches(/\d/) //regex for number
    .withMessage("Password must contain a number")

    //error
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
}


exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};