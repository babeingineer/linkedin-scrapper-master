import { Router } from "express";
import passport from "passport";
import { User } from "../entity/User";
import { AppDataSouce } from "../data-source";
const router = Router();

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  })
);

router.post("/register", async (req, res) => {
  const { id, password } = req.body;
  const user = new User();
  user.id = id;
  user.password = password;
  user.hashPassword();

  const userRepository = AppDataSouce.getRepository(User);
  await userRepository.save(user);
  res.redirect("/login");
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    console.log(err);
  });
  res.redirect("/");
});

export default router;
