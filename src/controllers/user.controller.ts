import { CookieOptions, Request, Response } from "express";
import {
  ChangePasswordInput,
  CreateUserInput,
  ForgotPasswordInput,
  ResendVerificationInput,
  ResetPasswordInput,
  UpdateUserInput,
  VerifyUserInput,
} from "../schemas/user.schema";
import {
  createUser,
  deleteUserById,
  findAndUpdateUserById,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import { invalidateUserSessions } from "../services/auth.service";
import log from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import config from "config";
import { CurrentUser } from "../types/user";
import { sendVerificationMail } from "../utils/mailer";
import { sendPasswordResetMail } from "../utils/mailer";
import { isEmpty, omit } from "lodash";
import { privateUserFields } from "../models/user.model";
import {
  verificationSuccessTemplate,
  alreadyVerifiedTemplate,
} from "../templates/emails";

const frontendOrigin = config.get("clientOrigin");

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;
  try {
    const user = await createUser(body);
    await sendVerificationMail(user);
    return res.send("User created successfully!");
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(409)
        .send(`Account with email (${body.email}) already exists.`);
    }
    return res.status(500).send(error);
  }
}

export async function resendVerificationHandler(
  req: Request<ResendVerificationInput>,
  res: Response
) {
  const { id } = req.params;
  try {
    const user = await findUserById(id);

    if (!user) return res.send("User not found!");
    const frontendOrigin = config.get("clientOrigin");
    if (user.verified)
      return res.send(alreadyVerifiedTemplate(`${frontendOrigin}/auth/login`));
    await sendVerificationMail(user);
    return res.send(
      "Verification mail will be sent to the Email address if registered."
    );
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const { id, verificationCode } = req.params;
  try {
    const user = await findUserById(id);

    if (!user) return res.status(404).send("User not found!");
    const frontendOrigin = config.get("clientOrigin");
    if (user.verified)
      return res
        .status(409)
        .send(alreadyVerifiedTemplate(`${frontendOrigin}/auth/login`));
    if (verificationCode !== user.verificationCode) {
      return res.status(400).send("Invalid verification code");
    }

    user.verified = true;
    await user.save();
    return res.send(
      verificationSuccessTemplate(`${frontendOrigin}/auth/login`)
    );
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  const message = `A password reset email will be sent to the ${email} if user is registered.`;
  if (!user) {
    log.info(`User with email:${email} not found in DB`);
    return res.status(202).send({ path: `password-reset-mail`, message });
  }
  if (!user.verified) {
    log.info("User not verified!");
    return res
      .status(202)
      .send({ path: `email-verification-pending/${user._id}` });
  }

  const passwordResetCode = uuidv4();
  user.passwordResetCode = passwordResetCode;
  await user.save();

  await sendPasswordResetMail(user, passwordResetCode);
  return res.status(202).send({ path: `password-reset-mail`, message });
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  try {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;

    const user = await findUserById(id);

    if (
      !user ||
      !user.passwordResetCode ||
      user.passwordResetCode !== passwordResetCode
    ) {
      if (!user) log.info("User not found");
      if (!user?.passwordResetCode) log.info("No password reset code found");
      if (user?.passwordResetCode !== passwordResetCode)
        log.info("Password reset code mismatch");

      return res.status(400).send("Couldn't reset password!");
    }

    user.password = password;
    user.passwordResetCode = null;
    await user.save();

    log.info("Password reset successfully!");
    return res.status(202).send({
      path: `password-reset-success`,
      message: "Password reset successfully!",
    });
  } catch (error) {
    log.error(error);
    return res.status(400).send("Couldn't reset password!");
  }
}

export async function changePasswordHandler(
  req: Request<{}, {}, ChangePasswordInput>,
  res: Response
) {
  const message = "Couldn't change password!";
  try {
    const { currentPassword, newPassword } = req.body;
    const currentUser: CurrentUser = res.locals.user;
    const { email } = currentUser;

    const user = await findUserByEmail(email as string);
    if (!user) {
      log.info("User not found");
      return res.status(401).send(message);
    }

    const isValid = await user.validatePassword(currentPassword);
    if (!isValid) {
      log.info("Invalid password");
      return res.status(401).send("Invalid current password");
    }

    user.password = newPassword;
    await user.save();

    log.info("Password changed successfully!");
    return res.send("Password changed successfully!");
  } catch (error) {
    log.error(error);
    return res.status(401).send(message);
  }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  const user = await findUserById(res.locals.user?._id);
  const payload = omit(user?.toJSON(), privateUserFields);
  return res.send(payload);
}

export async function updateUserHandler(
  req: Request<{}, {}, UpdateUserInput>,
  res: Response
) {
  const body = req.body;
  const message = "Couldn't update user";

  if (isEmpty(body)) return res.status(422).send(message);

  const user: CurrentUser = res.locals.user;
  if (!user) {
    log.info("User not logged in");
    return res.status(401).send(message);
  }

  const result = await findAndUpdateUserById(String(user._id), body);
  if (!result) {
    log.info("User not found in DB");
    return res.status(400).send(message);
  }

  return res.send("User updated successfully!");
}

export async function deleteUserHandler(req: Request, res: Response) {
  const message = "Couldn't delete user";

  const user: CurrentUser = res.locals.user;
  if (!user) {
    log.info("User not logged in");
    return res.status(400).send(message);
  }

  const result = await deleteUserById(String(user._id));
  if (!result.deletedCount) {
    log.info("User not found in DB");
    return res.status(400).send(message);
  }

  await invalidateUserSessions({ userId: String(user._id) });
  const cookieConfig = config.get<CookieOptions>("cookieConfig");
  res.clearCookie("accessToken", cookieConfig);
  res.clearCookie("refreshToken", cookieConfig);
  return res.send({
    accessToken: null,
    refreshToken: null,
    message: "User deleted successfully!",
  });
}
