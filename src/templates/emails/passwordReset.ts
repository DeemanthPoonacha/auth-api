export const passwordResetEmailTemplate = (resetUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            box-shadow: 0 10px 20px rgba(255, 154, 158, 0.3);
        }
        
        .logo::after {
            content: "🔒";
            font-size: 40px;
        }
        
        h1 {
            color: #333;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            color: #d63384;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(255, 154, 158, 0.4);
            margin-bottom: 20px;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 154, 158, 0.6);
        }
        
        .fallback-link {
            color: #ff9a9e;
            text-decoration: none;
            font-size: 14px;
            word-break: break-all;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 14px;
        }
        
        .security-note {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            border-left: 4px solid #ff9a9e;
        }
        
        .security-note p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        
        .expiry-note {
            background: #fff3cd;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            border-left: 4px solid #ffc107;
        }
        
        .expiry-note p {
            margin: 0;
            font-size: 14px;
            color: #856404;
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            .logo {
                width: 60px;
                height: 60px;
            }
            
            .logo::after {
                font-size: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"></div>
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Click the button below to create a new password for your account.</p>
        <a href="${resetUrl}" class="reset-button">Reset Password</a>
        <div class="security-note">
            <p><strong>Security Note:</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="expiry-note">
            <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
        </div>
        <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <a href="${resetUrl}" class="fallback-link">${resetUrl}</a>
        </div>
    </div>
</body>
</html>`;
