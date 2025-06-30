export const verificationEmailTemplate = (verificationUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .logo::after {
            content: "✓";
            color: white;
            font-size: 40px;
            font-weight: bold;
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
        
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            margin-bottom: 20px;
        }
        
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }
        
        .fallback-link {
            color: #667eea;
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
            border-left: 4px solid #667eea;
        }
        
        .security-note p {
            margin: 0;
            font-size: 14px;
            color: #666;
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
        <h1>Verify Your Email Address</h1>
        <p>Thank you for signing up! Please verify your email address to complete your registration and access your account.</p>
        <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
        <div class="security-note">
            <p><strong>Security Note:</strong> This link will expire for security reasons. If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <a href="${verificationUrl}" class="fallback-link">${verificationUrl}</a>
        </div>
    </div>
</body>
</html>`;
