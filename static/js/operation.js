///////////////////////////////////////////////////////
// header plan //

headerPlanBC = [
    ['Month',
        'Inpit',
        '-',
        'Outpit',
        'Coal PTR',
        '-',
        'Coal RTK',
        'Coal Barging',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage ( Ton )',
        'Tonnage ( Ton )'
    ]
];

headerPlanLSA = [
    ['Month',
        'Inpit South LSA',
        'Inpit North LSA',
        'Outpit',
        'Coal PTR South LSA',
        'Coal PTR North LSA',
        'Coal RTK',
        'Coal Barging',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage ( Ton )',
        'Tonnage ( Ton )'
    ]
];

headerPlanSCM = [
    ['Month',
        'Inpit OB 1',
        'Inpit OB 2',
        'Outpit',
        'Coal PTR',
        '-',
        'Coal RTK',
        'Coal Barging',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage ( Ton )',
        'Tonnage ( Ton )'
    ]
];

headerPlanPCS = [
    ['Month',
        'Inpit',
        '-',
        'Outpit',
        'Coal PTR',
        '-',
        'Coal RTK',
        'Coal Barging',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage ( Ton )',
        'Tonnage ( Ton )'
    ]
];

///////////////////////////////////
//// header actual ////

headerActualSCM = [
    ['Month',
        'Inpit OB 1',
        'Inpit OB 2',
        'Outpit',
        'Coal PTR',
        'PIT-CPP',
        'PIT-72',
        'CPP-72',
        'Coal RTK',
        'Coal Barging',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage ( Ton )',
        'Tonnage ( Ton )'
    ]
];

headerActualLSA = [
    ['Month',
        'Inpit South LSA',
        'Inpit North LSA',
        'Outpit',
        'Coal PTR',
        'PIT-CPP',
        'CPP-72',
        'Coal RTK',
        'Coal Barging',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
        'Tonnage ( Ton )',
        'Tonnage ( Ton )'
    ]
];

months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

var features
var apiPlanRKAB = new XMLHttpRequest();
var url = 'https://raw.githubusercontent.com/fabhiansan/json/master/baru.json'
apiPlanRKAB.open('GET', url, true);
apiPlanRKAB.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var obj = JSON.parse(apiPlanRKAB.response)
        features = obj.results
        console.log(features)
        features.forEach(el => {

            var dates = new Date(el.date).getMonth()
            month = months[dates]
            el['month'] = month.toString()

        })

        createTable(['lsa'], 'PlanBudgettest', features, headerPlanLSA)
        createTable(['scm'], 'PlanBudgettest', features, headerPlanSCM)

    }
}

apiPlanRKAB.send()


bcobj = {}

companies = ['bc', 'lsa', 'scm']
companyRKAB = ['lsa', 'scm', 'pcs']

function createTable(companyarr, identifier, data, headerFormat) {

    objidentifier = {}

    months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // inpit_volumea: 316000
    // inpit_distance_a: 2012
    // inpit_volume_b: 20000
    // inpit_distance_b: 5057
    // outpit_volume: null
    // outpit_distance: null
    // coalptr_tonage_a: 134500
    // coalptr_distance_a: 18440
    // coalptr_tonage_b: null
    // coalptr_distance_b: null
    // coalrtk_tonage: null
    // coalbarging_tonage: null
    // month: "Januari"

    // format_table = [
    //     'inpitvol_south',
    //     'inpitdist_south',
    //     'inpitvol_north',
    //     'inpitdist_north',
    //     'outpitvol',
    //     'outpitdist',
    //     'coalptr_ton',
    //     'coalptr_m',
    //     'coalptr_ton_north',
    //     'coalptr_m_north',
    //     'coalrtk',
    //     'coalbarging',
    //     'rtk'
    // ];


    format_table = [
        'inpit_volumea',
        'inpit_distance_a',
        'inpit_volume_b',
        'inpit_distance_b',
        'outpit_volume',
        'outpit_distance',
        'coalptr_tonage_a',
        'coalptr_distance_a',
        'coalptr_tonage_b',
        'coalptr_distance_b',
        'coalrtk_tonage',
        'coalbarging_tonage',
        'sr'
    ];


    companyarr.forEach(ele => {
        var DOMid = ele + identifier

        createHeader(ele, DOMid, headerFormat)

        var table = document.getElementById(ele + DOMid)

        table.className = 'table table-sm table-bordered table-dark'

        dataarr = []

        data.forEach(month => {

            var bulan = new Date(month.date).getMonth()

            obj = {}
            obj['month'] = months[bulan]

            if (month.company == ele) {

                var node = document.createElement('tr')

                var childNode1 = document.createElement('td')

                childNode1.innerHTML = month.month.toString()

                node.appendChild(childNode1)

                format_table.forEach(el => {

                    if (el == 'coalrtk_tonage' || el == 'coalbarging_tonage') {

                        var childNode2 = document.createElement('td')

                        childNode2.colSpan = '2'

                        childNode2.innerHTML = month[el]

                        obj[el] = month[el]

                        node.appendChild(childNode2)

                    } else if (el != 'coalrtk_tonage' && el != 'sr') {

                        var childNode2 = document.createElement('td')

                        childNode2.innerHTML = month[el]

                        node.appendChild(childNode2)

                        obj[el] = month[el]

                    } else {

                        var childNode2 = document.createElement('td')

                        childNode2.innerHTML = ((month.inpit_volumea + month.inpit_volume_b) / (month.coalptr_tonage_a + month.coalptr_tonage_b)).toFixed(2)

                        node.appendChild(childNode2)
                        obj[el] = month[el]

                    }

                })

                dataarr.push(obj)
                table.appendChild(node)
            }

            objidentifier[ele] = dataarr
            bcobj[identifier + ele] = objidentifier
                // console.log(objidentifier)
        })



        ////////////////////// total


        var node = document.createElement('tr')

        var childNode = document.createElement('td')

        childNode.innerHTML = 'Total'

        childNode.id = 'Total'

        node.appendChild(childNode)

        var sum = {}

        sum['identifier'] = identifier

        data.forEach(datum => {

            if (datum.company == ele) {

                sum['company'] = ele

                format_table.forEach(format => {

                    if (typeof datum[format] == 'number') {
                        if (format in sum) {
                            sum[format] += parseInt(datum[format])
                        } else {
                            sum[format] = parseInt(datum[format])
                        }

                    } else {
                        sum[format] = '-'
                    }

                })

            }

        })

        Object.keys(sum).forEach(function(item) {

            if (typeof sum[item] == 'number') {
                var childNode2 = document.createElement('td')

                childNode2.innerHTML = sum[item]

                if (item == 'coalrtk_tonage' || item == 'coalbarging_tonage') {
                    childNode2.colSpan = '2'
                }

                node.appendChild(childNode2)
            } else if (sum[item] == '-') {
                var childNode2 = document.createElement('td')

                childNode2.innerHTML = sum[item]

                node.appendChild(childNode2)
            }

        });

        table.appendChild(node)

    })

}

function createHeader(companyName, domId, arr) {

    var div = document.getElementById(domId)

    var company = document.createElement('h3')

    company.innerHTML = companyName.toUpperCase()

    div.appendChild(company)

    var table = document.createElement('table')

    table.id = companyName + domId

    var thead = document.createElement('thead')

    arr.forEach((elarr, index) => {

        var tr = document.createElement('tr')

        elarr.forEach(el => {

            var td = document.createElement('td')

            td.innerHTML = el

            if (el == 'Month' || el == 'SR') {
                td.className = 'align-middle'
                td.rowSpan = '2'
            } else if (el == 'Tonnage ( Ton )') {
                td.colSpan = '2';
            } else {
                if (index == 0) {
                    td.colSpan = '2';
                } else {
                    td.colSpan = '1'
                }
            }

            tr.appendChild(td)
            thead.appendChild(tr)

        })

        table.appendChild(thead)

    })


    div.appendChild(table)

}

function changeTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function changePage(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("pagecontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("pagelinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

var createBCTable = (obj) => {
    // creating result obj
    var resultobj = {}

    //desired output
    resultobj = {
        planbudgetlsa: {

        }
    }

    //loop trough bcobj
    Object.keys(obj).forEach(item => {
        // resultobj[item] = item
        // console.log(resultobj)

        //loop trough everytable
        Object.keys(obj[item]).forEach(el => {

            resultobj[item] = item
            console.log(resultobj)


            // loop trough every month
            for (let i = 0; i < obj[item][el].length; i++) {

                var data = obj[item][el][i]
                console.log(data)

            }


        })

    })
}