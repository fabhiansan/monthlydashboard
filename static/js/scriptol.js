var geojsonarr = []

window.onload = function() {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
        target.innerHTML = dump.response[this.value].body
    }

    var dump = {}

    var target = document.getElementById('target')
    var inputan = document.getElementById('inputan')

    var req = new XMLHttpRequest()
    var requrl = 'https://jsonplaceholder.typicode.com/posts'
    req.open('GET', requrl, true)

    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            // console.log(req.responseText);
            dump.response = JSON.parse(req.responseText)

            var ol = dump.response

            for (let i = 0; i < 50; i++) {
                var node = document.createElement('option')

                node.setAttribute('id', i)

                node.value = ol[i].id

                var insidenode = document.createElement('p')

                insidenode.append(ol[i].title)

                node.append(insidenode)

            }

            inputan.value = ol[0].id
            target.innerHTML = ol[0].body
        }
    };

    req.send()

    function changed() {
        console.log(inputan.value)
        target.innerHTML = dump.response[inputan.value].body
    }

    var url = '/static/data/kecamatan.json'

    var geojson = new XMLHttpRequest()
    geojson.open('GET', url, true)
    geojson.responseType = 'json'

    geojson.onreadystatechange = function() {
        if (geojson.readyState == XMLHttpRequest.DONE) {
            geojsonarr.push(geojson.response)

            var ol = geojson.response
            console.log(ol)

            slidecontainer = document.getElementById('slidecontainer')

            var slider = document.createElement('input')
            slider.type = 'range'
            slider.min = 0
            slider.max = ol.features.length
            slider.value = 0
            slider.id = 'range'

            slidecontainer.appendChild(slider)

            L.geoJSON(geojsonarr[0].features[0]).addTo(mymap)

            var slider2 = document.getElementById('range')
            slider2.oninput = function() {
                L.geoJSON(geojsonarr[0].features[this.value]).addTo(mymap)
            }
        }
    }

    geojson.send()
}