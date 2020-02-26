define("wicket-glue", ["wicket"], function(wicket) {
    Wkt = wicket; // Deliberately leak into the global space.
    return wicket;
});

require.config({
    waitSeconds: 200,
    paths: {
        'wicket': '/Vendor/Wicket/wicket',
        'wicketGmap3': '/Vendor/Wicket/wicket-gmap3'
    },
    map: {
        '*': {
            wicket: 'wicket-glue',
        },
        'wicket-glue': {
            wicket: 'wicket'
        }
    }
    shim: {
        wicketGmap3: {
            deps: ['wicket']
        }
    },
})