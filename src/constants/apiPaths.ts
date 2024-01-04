export const SESSIONS_API_PATH = "/api/sessions";
export const LOGIN_API_PATH = "/api/sessions";
export const LOGOUT_API_PATH = "/api/sessions";
export const REFRESH_ACCESS_TOKEN_API_PATH = `${SESSIONS_API_PATH}/refresh`;

export const USERS_API_PATH = "/api/users";
export const CURRENT_USER_API_PATH = `${USERS_API_PATH}/me`;
export const VERIFY_USER_API_PATH = `${USERS_API_PATH}/:id/verify/:verificationCode`;
export const FORGOT_PASSWORD_API_PATH = `${USERS_API_PATH}/forgot-password`;
export const RESET_PASSWORD_API_PATH = `${USERS_API_PATH}/:id/reset-password/:passwordResetCode`;
