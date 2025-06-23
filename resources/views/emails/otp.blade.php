<!DOCTYPE html>
<html>

<head>
    <title>Mã xác thực đăng ký tài khoản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
        }

        .otp-code {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 5px;
            margin: 20px 0;
        }

        .note {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Xác thực đăng ký tài khoản</h2>
        <p>Xin chào,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP sau:</p>

        <div class="otp-code">
            {{ $otp }}
        </div>

        <p>Mã OTP này sẽ hết hạn sau 5 phút.</p>

        <div class="note">
            <p>Lưu ý: Đây là email tự động, vui lòng không trả lời email này.</p>
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
    </div>
</body>

</html>