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

/// Plan Agreed 

headerPlanAgreed = [
    ['Month',
        'Inpit',
        'Outpit',
        'Coal PTR',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
    ]
];
/// Plan Monthly SIS
headerPlanMonthlySis = [
    ['Month',
        'Inpit',
        'Outpit',
        'Coal PTR',
        'SR'
    ],
    ['Vol (BCM)',
        'Dist (m)',
        'Vol (BCM)',
        'Dist (m)',
        'Tonnage (Ton)',
        'Dist (m)',
    ]
];

///

months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

var features
var apiPlanRKAB = new XMLHttpRequest();
// var url = 'http://BCLPRDP030:8000/api/planbudget/?format=json';
// var url = 'https://raw.githubusercontent.com/fabhiansan/json/master/baru.json';
var url = 'static/js/djangodata.json';
apiPlanRKAB.open('GET', url, true);


apiPlanRKAB.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var obj = JSON.parse(apiPlanRKAB.response)
        features = obj.results

        var tablename = []
        features.forEach(el => {
            //converting dates to month
            var dates = new Date(el.date).getMonth()
            month = months[dates]
            el['month'] = month.toString()


            if (tablename.includes(el.table)) {

            } else {
                tablename.push(el.table)
            }

        })

        // tablename.forEach(el => {
        //     createTable(['lsa'], capitalize(el), features, headerPlanLSA)
        //     createTable(['scm'], capitalize(el), features, headerPlanSCM)
        //     console.log(capitalize(el))
        // })

        // Features : 
        // objectid: 2
        // table: "planRkab"
        // company: "lsa"
        // date: "2019-01-01"
        // material_or_source: null
        // inpit_volumea: 527000
        // inpit_distance_a: 3179
        // inpit_volume_b: 160000
        // inpit_distance_b: 1700
        // outpit_volume: null
        // outpit_distance: null
        // coalptr_tonage_a: 187500
        // coalptr_distance_a: 18602
        // coalptr_tonage_b: 48500
        // coalptr_distance_b: 22244
        // coalrtk_tonage: 187500
        // coalbarging_tonage: 187500
        // month: "Januari"

        planBudgetarr = []
        planRkabarr = []

        for (x in features) {

            if (features[x]['table'] == 'planRkab') {
                planRkabarr.push(features[x])
            } else if (features[x]['table'] == 'planBudget') {
                planBudgetarr.push(features[x])
            }

        }

        console.log(planBudgetarr)
        console.log(planRkabarr)

        createTable(['lsa'], 'PlanRkab', planRkabarr, headerPlanLSA)
        createTable(['scm'], 'PlanRkab', planRkabarr, headerPlanSCM)
        createTable(['pcs'], 'PlanRkab', planRkabarr, headerPlanPCS)
        createTable(['lsa'], 'PlanBudget', planBudgetarr, headerPlanLSA)
        createTable(['scm'], 'PlanBudget', planBudgetarr, headerPlanSCM)
        createTable(['lsa'], 'Actual', planBudgetarr, headerActualLSA)
        createTable(['scm'], 'Actual', planBudgetarr, headerActualSCM)

        ////////////////////////////
        months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        bcdata = {}
        bcdataarr = []
        months.forEach(month => {
            bctotal = {
                'table': '',
                'company': '',
                'date': '',
                'inpit_volumea': 0,
                'inpit_distance_a': 0,
                'inpit_volume_b': 0,
                'inpit_distance_b': 0,
                'outpit_volume': 0,
                'outpit_distance': 0,
                'coalptr_tonage_a': 0,
                'coalptr_distance_a': 0,
                'coalptr_tonage_b': 0,
                'coalptr_distance_b': 0,
                'coalrtk_tonage': 0,
                'coalbarging_tonage': 0,
                'sr': 0,
                'month': ""
            }

            bctotal['month'] = month
            bcdata[month] = bctotal

            for (datum in planBudgetarr) {
                if (month == planBudgetarr[datum]['month']) {

                    var attrarr = Object.keys(bctotal)

                    attrarr.forEach(el => {

                        Object.keys(planBudgetarr[datum]).forEach(ol => {
                            // console.log(ol)
                            if (ol == 'month' || ol == 'table' || ol == 'date') {

                                if (bctotal[ol] == '') {
                                    bctotal[ol] += planBudgetarr[datum][ol]
                                }

                            } else if (ol == 'company') {
                                bctotal[ol] = 'bc'
                            } else if (el == ol) {
                                bctotal[ol] += planBudgetarr[datum][ol]
                            }
                        })
                    })
                }
            }

            for (el in bcdata) {
                if (bcdataarr.indexOf(bcdata[el]) == -1) {
                    bcdataarr.push(bcdata[el])
                        // console.log('a')
                } else {
                    // console.log('b')
                }
            }

        })

        bcdataarr.forEach(el => {
            el['inpit_volumea'] = el['inpit_volumea'] + el['inpit_volume_b']
            el['inpit_volume_b'] = ''
            el['inpit_distance_a'] = el['inpit_distance_a'] + el['inpit_distance_b']
            el['inpit_distance_b'] = ''
            el['coalptr_tonage_a'] = el['coalptr_tonage_a'] + el['coalptr_tonage_b']
            el['coalptr_tonage_b'] = ''
            el['coalptr_distance_a'] = el['coalptr_distance_a'] + el['coalptr_distance_b']
            el['coalptr_distance_b'] = ''
        })
        createTable(['bc'], 'PlanBudget', bcdataarr, headerPlanBC)

        /////////////////////////////////

        months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        var bcdata = {}
        bcdataarr = []
        months.forEach(month => {
            bctotal = {
                'table': '',
                'company': '',
                'date': '',
                'inpit_volumea': 0,
                'inpit_distance_a': 0,
                'inpit_volume_b': 0,
                'inpit_distance_b': 0,
                'outpit_volume': 0,
                'outpit_distance': 0,
                'coalptr_tonage_a': 0,
                'coalptr_distance_a': 0,
                'coalptr_tonage_b': 0,
                'coalptr_distance_b': 0,
                'coalrtk_tonage': 0,
                'coalbarging_tonage': 0,
                'sr': 0,
                'month': ""
            }

            bctotal['month'] = month
            bcdata[month] = bctotal

            for (datum in planRkabarr) {
                if (month == planRkabarr[datum]['month']) {

                    var attrarr = Object.keys(bctotal)

                    attrarr.forEach(el => {

                        Object.keys(planRkabarr[datum]).forEach(ol => {
                            // console.log(ol)
                            if (ol == 'month' || ol == 'table' || ol == 'date') {

                                if (bctotal[ol] == '') {
                                    bctotal[ol] += planRkabarr[datum][ol]
                                }

                            } else if (ol == 'company') {
                                bctotal[ol] = 'bc'
                            } else if (ol == 'sr') {
                                // bctotal[ol]
                            } else if (el == ol) {
                                bctotal[ol] += planBudgetarr[datum][ol]
                            }
                        })
                    })
                }
            }

            for (el in bcdata) {
                if (bcdataarr.indexOf(bcdata[el]) == -1) {
                    bcdataarr.push(bcdata[el])
                        // console.log('a')
                } else {

                }
            }

        })

        bcdataarr.forEach(el => {
            el['inpit_volumea'] = el['inpit_volumea'] + el['inpit_volume_b']
            el['inpit_volume_b'] = 0
            el['inpit_distance_a'] = el['inpit_distance_a'] + el['inpit_distance_b']
            el['inpit_distance_b'] = 0
            el['coalptr_tonage_a'] = el['coalptr_tonage_a'] + el['coalptr_tonage_b']
            el['coalptr_tonage_b'] = 0
            el['coalptr_distance_a'] = el['coalptr_distance_a'] + el['coalptr_distance_b']
            el['coalptr_distance_b'] = 0

        })
        createTable(['bc'], 'PlanRkab', bcdataarr, headerPlanBC)
    }


}

apiPlanRKAB.send()

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}


bcobj = {}

companies = ['bc', 'lsa', 'scm']
companyRKAB = ['lsa', 'scm', 'pcs']

function createTable(companyarr, identifier, data, headerFormat) {

    objidentifier = {}

    months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

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

                    } else if (el == 'sr') {

                        var childNode2 = document.createElement('td')

                        childNode2.className = 'sr'

                        childNode2.innerHTML = ((month.inpit_volumea + month.inpit_volume_b) / (month.coalptr_tonage_a + month.coalptr_tonage_b)).toFixed(2)

                        node.appendChild(childNode2)

                        obj[el] = month[el]

                    } else if (el != 'coalrtk_tonage' && el != 'sr') {

                        var childNode2 = document.createElement('td')

                        childNode2.innerHTML = month[el]

                        node.appendChild(childNode2)

                        obj[el] = month[el]

                    }

                })

                dataarr.push(obj)
                table.appendChild(node)
            } else {
                // console.error('checking else');

            }

            objidentifier[ele] = dataarr
            bcobj[identifier + ele] = objidentifier

        })


        ////////////////////// total


        var node = document.createElement('tr')

        var childNode = document.createElement('td')

        childNode.innerHTML = 'Total'

        childNode.id = 'Total'

        node.appendChild(childNode)

        sum = {}

        sum['identifier'] = identifier

        data.forEach(datum => {

            if (datum.company == ele) {

                sum['company'] = ele

                format_table.forEach(format => {

                    if (typeof datum[format] == 'number' && format != 'sr') {

                        if (format in sum) {
                            sum[format] += parseInt(datum[format])
                        } else {
                            sum[format] = parseInt(datum[format])
                        }

                    } else if (format == 'sr') {

                        if (typeof datum['coalptr_tonage_b'] == 'object') {
                            datum['coalptr_tonage_b'] = 0
                        } else if (typeof datum['inpit_volume_b'] != 'number') {
                            datum['inpit_volume_b'] = 0
                        }
                        if (typeof datum['coalptr_tonage_b'] != 'number') {
                            datum['coalptr_tonage_b'] = 0
                        }

                        sum[format] = parseFloat(((sum['inpit_volumea'] + sum['inpit_volume_b']) / (sum['coalptr_tonage_a'] + sum['coalptr_tonage_b'])).toFixed(2))

                    } else {
                        sum[format] = ''
                    }

                })

            }

        })

        // format_table = [
        //     'inpit_volumea',
        //     'inpit_distance_a',
        //     'inpit_volume_b',
        //     'inpit_distance_b',
        //     'outpit_volume',
        //     'outpit_distance',
        //     'coalptr_tonage_a',
        //     'coalptr_distance_a',
        //     'coalptr_tonage_b',
        //     'coalptr_distance_b',
        //     'coalrtk_tonage',
        //     'coalbarging_tonage',
        //     'sr'
        // ];

        Object.keys(sum).forEach(function(item) {

            if (typeof sum[item] == 'number' || typeof sum[item] == 'float') {
                var childNode2 = document.createElement('td')

                childNode2.innerHTML = sum[item]

                if (item == 'coalrtk_tonage' || item == 'coalbarging_tonage') {
                    childNode2.colSpan = '2'
                }

                node.appendChild(childNode2)
            } else if (sum[item] == '') {
                var childNode2 = document.createElement('td')

                childNode2.innerHTML = sum[item]

                if (item == 'coalrtk_tonage' || item == 'coalbarging_tonage' || item == '-') {
                    childNode2.colSpan = '2'
                }

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

function changeTab(evt, tabname) {
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
    document.getElementById(tabname).style.display = "block";
    evt.currentTarget.className += " active";
}

function changePage(evt, pageName) {
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
    document.getElementById(pageName).style.display = "block";
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