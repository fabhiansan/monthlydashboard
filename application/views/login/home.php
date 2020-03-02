<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <script type='text/javascript' src="static/js/jquery-3.4.1.js"></script>
    <link rel="stylesheet" type="text/css" href="static/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="static/css/landingpage.css">

    <!-- <script type='text/javascript' src="static/js/popper.min.js"></script> -->

    <script type='text/javascript' src="static/js/bootstrap.js"></script>
    <!-- <link rel="stylesheet" type="text/css" href="static/css/login.css"> -->
    <script type='text/javascript' src="static/js/operation.js"></script>


    <style>
        img {
            width: 30%;
        }
    </style>
</head>

<body>
    <div id='loading'>
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <div id='body'>
        <div class="wrapper fadeInDown">
            <!-- Sidebar -->
            <nav id="sidebar">
                <div class="sidebar-header row">
                    <img src="static/img/logo.png" class='col-auto mx-auto w-50' id="icon" alt="User Icon" />
                    <h4 class="col-auto my-4">Balangan Coal Database</h4>
                </div>

                <ul class="list-unstyled components">
                    <li class="active">
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Home</a>
                        <ul class="collapse list-unstyled" id="homeSubmenu">
                            <li>
                                <a href="#">Home 1</a>
                            </li>
                            <li>
                                <a href="#">Home 2</a>
                            </li>
                            <li>
                                <a href="#">Home 3</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Pages</a>
                        <ul class="collapse list-unstyled" id="pageSubmenu">
                            <li>
                                <a href="#">Page 1</a>
                            </li>
                            <li>
                                <a href="#">Page 2</a>
                            </li>
                            <li>
                                <a href="#">Page 3</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Portfolio</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>

            </nav>
            <!-- Page Content -->
            <div id="content">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <div class="container-fluid">
                        <div class='container'>
                            <div class="fadeInDown">
                                <div class="page">
                                    <button id='defaultOpen' class="pagelinks" onclick="changePage(event, 'monthlyReport')">Monthly Report</button>
                                    <button class="pagelinks" onclick="changePage(event, 'planRKAB')">Yearly</button>
                                </div>

                                <div class="pagecontent" id='monthlyReport'>
                                    <div class="tab">
                                        <button id='defaultOpen2' class="tablinks" onclick="changeTab(event, 'Actual')">Actual</button>
                                        <button class="tablinks" onclick="changeTab(event, 'planBudget')">Plan Budget</button>
                                        <button class="tablinks" onclick="changeTab(event, 'planRKAB')">Plan RKAB</button>
                                        <button class="tablinks" onclick="changeTab(event, 'planAgreed')">Plan Agreed</button>
                                        <button class="tablinks" onclick="changeTab(event, 'planMonthlySis')">Plan Monthly SIS</button>
                                    </div>




                                </div>
                                <!-- Tab content -->
                                <div id="planBudget" class="tabcontent">
                                    <h2>Plan Budget</h2>
                                    <div id='bcPlanBudget' class='scrollmenu'>
                                    </div>
                                    <div id='lsaPlanBudget' class='scrollmenu'>
                                    </div>
                                    <div id='scmPlanBudget' class='scrollmenu'>
                                    </div>
                                </div>

                                <div id="planRKAB" class="tabcontent">
                                    <h2>Plan RKAB</h2>
                                    <div id='bcPlanRkab' class='scrollmenu'>
                                    </div>
                                    <div class='scrollmenu' id='lsaPlanRkab'>
                                    </div>
                                    <div class='scrollmenu' id='scmPlanRkab'>
                                    </div>
                                    <div class='scrollmenu' id='pcsPlanRkab'>
                                    </div>
                                </div>

                                <div id="Actual" class="tabcontent">
                                    <h2>Actual</h2>
                                    <div id='bcActual' class='scrollmenu'>
                                    </div>
                                    <div class='scrollmenu' id='lsaActual'>
                                    </div>
                                    <div class='scrollmenu' id='scmActual'>
                                    </div>
                                </div>

                                <div id="planAgreed" class="tabcontent">
                                    <h2>Actual</h2>
                                    <div id='bcplanAgreed' class='scrollmenu'>
                                    </div>
                                    <div class='scrollmenu' id='lsaplanAgreed'>
                                    </div>
                                    <div class='scrollmenu' id='scmplanAgreed'>
                                    </div>
                                </div>
                                <div id="planMonthlySis" class="tabcontent">
                                    <h2>Actual</h2>
                                    <div id='bcplanMonthlySis' class='scrollmenu'>
                                    </div>
                                    <div class='scrollmenu' id='lsaplanMonthlySis'>
                                    </div>
                                    <div class='scrollmenu' id='scmplanMonthlySis'>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
            </div>
            </nav>
        </div>
    </div>

    </div>

    <script>
        var loading = document.getElementById('loading')
        var body = document.getElementById('body')
        setTimeout(() => {
            loading.style.display = 'none';
            body.style.display = 'block';
            console.log('a')
        }, 3000)

        $(document).ready(function() {

            $("#sidebar").mCustomScrollbar({
                theme: "minimal"
            });

            $('#sidebarCollapse').on('click', function() {
                // open or close navbar
                $('#sidebar').toggleClass('active');
                // close dropdowns
                $('.collapse.in').toggleClass('in');
                // and also adjust aria-expanded attributes we use for the open/closed arrows
                // in our CSS
                $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            });

        });

        document.getElementById("defaultOpen").click();
        document.getElementById("defaultOpen2").click();
        // createHeader('bc', 'bcPlanBudget', headerPlanBC)
        // createHeader('bc', 'bcPlanRKAB', headerPlanBC)
        // createHeader('bc', 'bcActual', headerPlanBC)

        var table = document.getElementsByTagName('table')
        var tablearr = [...table]
        tablearr.forEach(el => {
            el.className = 'table table-sm table-bordered table-dark'
        })
    </script>
</body>

</html>