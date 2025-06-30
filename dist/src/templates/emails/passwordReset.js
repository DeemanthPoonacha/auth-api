"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetEmailTemplate = void 0;
const passwordResetEmailTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;">
    <div style="background:#fff;border-radius:8px;box-shadow:0 20px 40px rgba(0,0,0,0.1);padding:5%;max-width:500px;text-align:center;margin:40px auto;">
        <div style="width:80px;height:80px;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 50%,#1d4ed8 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 30px;box-shadow:0 10px 20px rgba(59,130,246,0.3);">
            <span style="color:#fff;font-size:40px;display:inline-block;line-height:80px;text-align: center;margin: auto;">🔒</span>
        </div>
        <h1 style="color:#333;font-size:28px;font-weight:700;margin-bottom:15px;">Reset Your Password</h1>
        <p style="color:#666;font-size:16px;line-height:1.6;margin-bottom:30px;">We received a request to reset your password. Click the button below to create a new password for your account.</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 50%,#1d4ed8 100%);color:#fff;text-decoration:none;padding:15px 30px;border-radius:8px;font-weight:600;font-size:16px;box-shadow:0 5px 15px rgba(59,130,246,0.4);margin-bottom:20px;">Reset Password</a>
        <div style="background:#f8f9fa;border-radius:10px;padding:15px;margin-top:20px;border-left:4px solid #3b82f6;">
            <p style="margin:0;font-size:14px;color:#666;"><strong>Security Note:</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#999;font-size:14px;">
            <p style="margin-bottom:4px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <a href="${resetUrl}" style="color:#3b82f6;text-decoration:none;font-size:14px;word-break:break-all;">${resetUrl}</a>
        </div>
    </div>
</body>
</html>`;
exports.passwordResetEmailTemplate = passwordResetEmailTemplate;
