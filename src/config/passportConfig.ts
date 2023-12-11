import passport from "passport";
import { AppDataSouce } from "../data-source";
import { User } from "../entity/User";
import { Strategy } from "passport-local";

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await AppDataSouce.getRepository(User).findOne({
      where: { id: id },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new Strategy(
    async (id, password, done) => {
      const userRepository = AppDataSouce.getRepository(User);
      try {
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validatePassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));