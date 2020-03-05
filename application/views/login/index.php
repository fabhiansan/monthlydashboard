<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <script type='text/javascript' src="static/js/jquery-3.4.1.js"></script>
    <link rel="stylesheet" type="text/css" href="static/css/bootstrap.css">
    <!-- <script type='text/javascript' src="static/js/popper.min.js"></script> -->
    <link rel="stylesheet" type="text/css" href="static/css/login.css">

    <script type='text/javascript' src="static/js/bootstrap.js"></script>
    <style>
        body,
        html {
            margin: 0;
            padding: 0
        }
        
        #box {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-row: auto;
        }
    </style>
</head>

<body>
    <header>

    </header>
    <section>

        <div class="wrapper fadeInDown">
            <div id="formContent">
                <!-- Tabs Titles -->

                <!-- Icon -->
                <div class="fadeIn first">
                    <img src="static/img/logo.png" id="icon" alt="User Icon" />
                </div>

                <!-- Login Form -->
                <form action="/landingpage" method="POST">
                    <input type="text" id="login" class="fadeIn second" name="login" placeholder="login">
                    <input type="password" id="password" class="fadeIn third" name="password" placeholder="password">
                    <input type="submit" class="fadeIn fourth" value="Log In">
                </form>

                <!-- Remind Passowrd -->
                <div id="formFooter">
                    <a class="underlineHover" href="#">Forgot Password?</a>
                </div>

            </div>
        </div>
    </section>
    <footer>

    </footer>
</body>

</html>