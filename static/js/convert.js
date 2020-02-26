function sanwkttojson(results) {



    this.type = results.type



    this.features = []



    results.features.forEach(feature => {



        var arr = {

            "id": feature.id,

            "type": feature.type,

            "geometry": convert(feature.geometry),

            "properties": feature.properties

        }



        this.features.push(arr)



    })



    // this.properties = this.features.properties



    // this.geometry = this.features.geometryt



    this.output = {

        "type": this.type,

        "features": this.features,

    }



}



function convert(obj) {



    var srid = obj.split(';')[0]

    var coordinates = obj.split(';')[1]



    var geomobject = {

        type: "",

        coordinates: []

    }





    var type = coordinates.split(' (')[0]



    geomobject.type = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase()



    switch (type) {



        case "POINT" || "Point":



            var dum = (obj.split('(')[1]).replace(')', "").split(', ');



            dum[0].split(' ').forEach(el => {

                geomobject.coordinates.push(parseFloat(el))

            });



            break;



        case "POINT Z":



            break;



        case "POINT ZM":



            break;



        case "POINT M":



            break;



        case "LINESTRING":



            var dum = (obj.split('(')[1]).replace(')', "").split(', ')



            dum.forEach(el => {

                geom = []



                el.split(' ').forEach(ol => {

                    geom.push(parseFloat(ol))

                })

                geomobject.coordinates.push(geom)

            })



            break;



        case "POLYGON":



            var dum = obj.split(' ((')[1].replace('))', '').split('), (')



            dum.forEach(dumdum => {

                var arr = [];

                var yea = dumdum.split(', ')



                yea.forEach(ol => {

                    hm = ol.split(' ')

                    hi = hm.map(x => parseFloat(x))

                    arr.push(hi)

                });



                geomobject.coordinates.push(arr)

            })



            break;



        case "MULTIPOINT":



            var geometry = (obj.split('(')[1]).replace(')', "").split(', ')



            for (let j = 0; j < geometry.length; j++) {



                if (geometry[j] != " ") {



                    geomobject.coordinates.push(geometry[j])



                }



            }



            break;



        case "MULTIPOLYGON":

            geomobject.type = "MultiPolygon"

            var olo = obj.split(';')
            var dum = olo[1].split(' ((')
            dum.shift()



            dum.forEach(dumdum => {

                var arr = [];

                var yea = dumdum.split(', ')
                yea.forEach(ol => {

                    hm = ol.split(' ')
                        // '(123 456' '789 101'

                    if (isNaN(parseFloat(hm[0]))) {
                        // '(123' '456'

                        ho = hm[0].split('(')
                            // [['('] ['123']], [456]

                        ho.shift()

                        hd = [...ho, hm[1]]

                        hi = hd.map(x => parseFloat(x))

                        arr.push(hi)


                    } else {
                        //  '789' '101'
                        hi = hm.map(x => parseFloat(x))


                        arr.push(hi)

                    }

                });

                geomobject.coordinates.push(arr)

            })

            console.log(geomobject)

            break;

        case "MULTILINESTRING":



            break;

    }



    return geomobject

}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}