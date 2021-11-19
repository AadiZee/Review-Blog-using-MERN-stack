const express = require("express");
const { contactMail, registerEmail } = require("../../../config/email/email");
const { checkLoggedIn } = require("../../../middleware/auth/auth");
const { grantAccess } = require("../../../middleware/roles/roles");
const { User } = require("../../../models/users/user_model");
require("dotenv").config();

let router = express.Router();

router.route("/register").post(async (req, res) => {
  try {
    // Check if email taken
    if (await User.emailTaken(req.body.email)) {
      return res.status(400).json({ message: "Sorry email already exists" });
    }

    //Creating model (hash password)
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    //Generate token
    const token = user.generateToken();
    const doc = await user.save();

    //Send email
    const emailToken = user.generateRegisterToken();
    await registerEmail(doc.email, emailToken);

    //Save user and send token with cookie
    res.cookie("x-access-token", token).status(200).send(getUserProps(doc));
  } catch (error) {
    res.status(400).json({ message: "Error ", error: error });
  }
});

router.route("/signin").post(async (req, res) => {
  try {
    //Find User
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User not found" });

    //Compare Password
    const compare = await user.comparePassword(req.body.password);
    if (!compare)
      return res.status(400).json({ message: "Password Incorrect" });

    // Generate Token
    const token = user.generateToken();

    //Response
    res.cookie("x-access-token", token).status(200).send(getUserProps(user));
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error, You are not Signed in ", error: error });
  }
});

router
  .route("/profile")
  .get(checkLoggedIn, grantAccess("readOwn", "profile"), async (req, res) => {
    try {
      const permission = res.locals.permission;
      const user = await User.findById(req.user._id);
      if (!user) return res.status(400).json({ message: "User not found" });

      res.status(200).json(permission.filter(user._doc));
    } catch (error) {
      return res.status(400).send(error);
    }
  })
  .patch(
    checkLoggedIn,
    grantAccess("updateOwn", "profile"),
    async (req, res) => {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $set: {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              age: req.body.age,
            },
          },
          { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(getUserProps(user));
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Problem updating", error: error });
      }
    }
  );

router
  .route("/update_email")
  .patch(
    checkLoggedIn,
    grantAccess("updateOwn", "profile"),
    async (req, res) => {
      try {
        if (await User.emailTaken(req.body.newemail)) {
          return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.findOneAndUpdate(
          { _id: req.user._id, email: req.body.email },
          {
            $set: { email: req.body.newemail },
          },
          { new: true }
        );
        if (!user) return res.status(400).json({ message: "User not found" });

        const token = user.generateToken();
        res
          .cookie("x-access-token", token)
          .status(200)
          .send({ email: user.email });
      } catch (error) {
        res.status(400).json({ message: "Problem Updating", error: error });
      }
    }
  );

router.route("/isauth").get(checkLoggedIn, async (req, res) => {
  try {
    res.status(200).send(getUserProps(req.user));
  } catch (error) {
    res.status(400).send({ message: "You are not signed in", error: error });
  }
});

router.route("/contact").post(async (req, res) => {
  try {
    await contactMail(req.body);
    res.status(200).send("OKAY");
  } catch (error) {
    res.status(400).json({ message: "Problem sending message", error: error });
  }
});

router.route("/verify").get(async (req, res) => {
  try {
    const token = User.validateToken(req.query.validation);
    const user = await User.findById(token._id);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.verified = true;
    await user.save();
    res.status(200).send(getUserProps(user));
  } catch (error) {
    res.status(400).send(error);
  }
});

const getUserProps = (props) => {
  return {
    _id: props._id,
    email: props.email,
    firstname: props.firstname,
    lastname: props.lastname,
    age: props.age,
    role: props.role,
    verified: props.verified,
  };
};

module.exports = router;
