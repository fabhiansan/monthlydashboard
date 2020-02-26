// // Datum WGS 84


var e5 = 658235.698
var f5 = 9568214.580


var c21 = 48
var c22 = "S"
var c13 = parseFloat(6356752.314)
var c12 = parseInt(6378137)

var c15 = parseFloat((Math.sqrt(c12 ** 2 - c13 ** 2)) / c12)
var c16 = parseFloat((Math.sqrt(c12 ** 2 - c13 ** 2)) / c13)
var c17 = parseFloat(c16 ** 2)
var c18 = parseFloat((c12 ** 2) / c13)
console.log(c15, c16, c17, c18)

var k5 = o5(c22) / (6366197.724 * 0.9996)
var l5 = (c18 / (1 + c17 * (Math.cos(k5) ** 2) ** 0.5)) * 0.9996
var m5 = k5 + (1 + c17 * (Math.cos(k5) ** 2) - (3 / 2) * c17 * Math.sin(k5) * Math.cos(k5) * (af5 - k5)) * (af5 - k5)
var n5 = 6 * c21 - 183


var o5 = (c22) => {
    if (c22 == "S") {
        return (f5 - 10000000)
    }
    return f5
}
var p5 = (e5 - 500000) / l5
var q5 = Math.sin(2 * k5)
var r5 = q5 * (Math.cos(k5) ** 2)
var s5 = k5 + (q5 / 2)
var t5 = (3 * s5 + r5) / 4
var u5 = ((5 * t5) + r5 * (Math.cos(k5) ** 2)) / 3
var v5 = (3 / 4) * c17
var w5 = (5 / 3) * (v5 ** 3)
var x5 = (35 / 27) * (v5 ** 3)
var y5 = 0.9996 * c18 * (k5 - (v5 * s5) + (w5 * t5) - (x5 * u5))
var z5 = (o5(c22) - y5) / l5
var aa5 = ((c17 * (p5 ** 2) / 2) * (Math.cos(k5) ** 2))
var ab5 = p5 * (1 - (aa5 / 3))
var ac5 = z5 * (1 - aa5) + k5
var ad5 = (Math.exp(ab5) - Math.exp(-ab5)) / 2
var ae5 = Math.atan(ad5 / Math.cos(ac5))
var af5 = Math.atan(Math.cos(ae5) * Math.tan(ac5))
var lat_result = (m5 / Math.PI) * 180
console.log("lat : " + lat_result)
var lon_result = (ae5 / Math.PI) * 180 + n5
console.log("lon : " + lon_result)