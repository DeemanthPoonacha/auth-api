export const alreadyVerifiedTemplate = (loginUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Already Verified</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;align-content: center;">
    <div style="background:#fff;border-radius:8px;box-shadow:0 20px 40px rgba(0,0,0,0.1);padding:40px;max-width:500px;text-align:center;margin:40px auto;">
        <div style="width:80px;height:80px;background:linear-gradient(135deg,#3b82f6,#2563eb,#1d4ed8);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 30px;box-shadow:0 10px 20px rgba(59,130,246,0.3);">
            <span style="color:#fff;font-size:40px;font-weight:bold;display:inline-block;line-height:80px;">ℹ</span>
        </div>
        <h1 style="color:#333;font-size:28px;font-weight:700;margin-bottom:15px;">Account Already Verified!</h1>
        <p style="color:#666;font-size:16px;line-height:1.6;margin-bottom:30px;">Your email address has already been verified. You can proceed to login to your account.</p>
        <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 50%,#1d4ed8 100%);color:#fff;text-decoration:none;padding:15px 30px;border-radius:8px;font-weight:600;font-size:16px;box-shadow:0 5px 15px rgba(59,130,246,0.4);">Login to Your Account</a>
    </div>
</body>
</html>`;
