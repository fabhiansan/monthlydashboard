// ThreeExtras.js r40 - http://github.com/mrdoob/three.js
THREE.AnimationHandler = function() {
    var a = [],
        c = {},
        b = {};
    b.update = function(f) { for (var d = 0; d < a.length; d++) a[d].update(f) };
    b.addToUpdate = function(f) { a.indexOf(f) === -1 && a.push(f) };
    b.removeFromUpdate = function(f) {
        f = a.indexOf(f);
        f !== -1 && a.splice(f, 1)
    };
    b.add = function(f) {
        c[f.name] !== undefined && console.log("THREE.AnimationHandler.add: Warning! " + f.name + " already exists in library. Overwriting.");
        c[f.name] = f;
        if (f.initialized !== !0) {
            for (var d = 0; d < f.hierarchy.length; d++) {
                for (var g = 0; g < f.hierarchy[d].keys.length; g++) {
                    if (f.hierarchy[d].keys[g].time <
                        0) f.hierarchy[d].keys[g].time = 0;
                    if (f.hierarchy[d].keys[g].rot !== undefined && !(f.hierarchy[d].keys[g].rot instanceof THREE.Quaternion)) {
                        var h = f.hierarchy[d].keys[g].rot;
                        f.hierarchy[d].keys[g].rot = new THREE.Quaternion(h[0], h[1], h[2], h[3])
                    }
                }
                if (f.hierarchy[d].keys[0].morphTargets !== undefined) {
                    h = {};
                    for (g = 0; g < f.hierarchy[d].keys.length; g++)
                        for (var j = 0; j < f.hierarchy[d].keys[g].morphTargets.length; j++) {
                            var l = f.hierarchy[d].keys[g].morphTargets[j];
                            h[l] = -1
                        }
                    f.hierarchy[d].usedMorphTargets = h;
                    for (g = 0; g < f.hierarchy[d].keys.length; g++) {
                        var k = {};
                        for (l in h) {
                            for (j = 0; j < f.hierarchy[d].keys[g].morphTargets.length; j++)
                                if (f.hierarchy[d].keys[g].morphTargets[j] === l) { k[l] = f.hierarchy[d].keys[g].morphTargetsInfluences[j]; break }
                            j === f.hierarchy[d].keys[g].morphTargets.length && (k[l] = 0)
                        }
                        f.hierarchy[d].keys[g].morphTargetsInfluences = k
                    }
                }
                for (g = 1; g < f.hierarchy[d].keys.length; g++)
                    if (f.hierarchy[d].keys[g].time === f.hierarchy[d].keys[g - 1].time) {
                        f.hierarchy[d].keys.splice(g, 1);
                        g--
                    }
                for (g = 1; g < f.hierarchy[d].keys.length; g++) f.hierarchy[d].keys[g].index = g
            }
            g = parseInt(f.length *
                f.fps, 10);
            f.JIT = {};
            f.JIT.hierarchy = [];
            for (d = 0; d < f.hierarchy.length; d++) f.JIT.hierarchy.push(Array(g));
            f.initialized = !0
        }
    };
    b.get = function(f) {
        if (typeof f === "string")
            if (c[f]) return c[f];
            else { console.log("THREE.AnimationHandler.get: Couldn't find animation " + f); return null }
    };
    b.parse = function(f) {
        var d = [];
        if (f instanceof THREE.SkinnedMesh)
            for (var g = 0; g < f.bones.length; g++) d.push(f.bones[g]);
        else e(f, d);
        return d
    };
    var e = function(f, d) { d.push(f); for (var g = 0; g < f.children.length; g++) e(f.children[g], d) };
    b.LINEAR =
        0;
    b.CATMULLROM = 1;
    b.CATMULLROM_FORWARD = 2;
    return b
}();
THREE.Animation = function(a, c, b, e) {
    this.root = a;
    this.data = THREE.AnimationHandler.get(c);
    this.hierarchy = THREE.AnimationHandler.parse(a);
    this.currentTime = 0;
    this.timeScale = 1;
    this.isPlaying = !1;
    this.isPaused = !0;
    this.loop = !0;
    this.interpolationType = b !== undefined ? b : THREE.AnimationHandler.LINEAR;
    this.JITCompile = e !== undefined ? e : !0;
    this.points = [];
    this.target = new THREE.Vector3
};
THREE.Animation.prototype.play = function(a, c) {
    if (!this.isPlaying) {
        this.isPlaying = !0;
        this.loop = a !== undefined ? a : !0;
        this.currentTime = c !== undefined ? c : 0;
        var b, e = this.hierarchy.length,
            f;
        for (b = 0; b < e; b++) {
            f = this.hierarchy[b];
            if (this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD) f.useQuaternion = !0;
            f.matrixAutoUpdate = !0;
            if (f.animationCache === undefined) {
                f.animationCache = {};
                f.animationCache.prevKey = { pos: 0, rot: 0, scl: 0 };
                f.animationCache.nextKey = { pos: 0, rot: 0, scl: 0 };
                f.animationCache.originalMatrix =
                    f instanceof THREE.Bone ? f.skinMatrix : f.matrix
            }
            var d = f.animationCache.prevKey;
            f = f.animationCache.nextKey;
            d.pos = this.data.hierarchy[b].keys[0];
            d.rot = this.data.hierarchy[b].keys[0];
            d.scl = this.data.hierarchy[b].keys[0];
            f.pos = this.getNextKeyWith("pos", b, 1);
            f.rot = this.getNextKeyWith("rot", b, 1);
            f.scl = this.getNextKeyWith("scl", b, 1)
        }
        this.update(0)
    }
    this.isPaused = !1;
    THREE.AnimationHandler.addToUpdate(this)
};
THREE.Animation.prototype.pause = function() {
    this.isPaused ? THREE.AnimationHandler.addToUpdate(this) : THREE.AnimationHandler.removeFromUpdate(this);
    this.isPaused = !this.isPaused
};
THREE.Animation.prototype.stop = function() {
    this.isPlaying = !1;
    this.isPaused = !1;
    THREE.AnimationHandler.removeFromUpdate(this);
    for (var a = 0; a < this.hierarchy.length; a++)
        if (this.hierarchy[a].animationCache !== undefined) {
            if (this.hierarchy[a] instanceof THREE.Bone) this.hierarchy[a].skinMatrix = this.hierarchy[a].animationCache.originalMatrix;
            else this.hierarchy[a].matrix = this.hierarchy[a].animationCache.originalMatrix;
            delete this.hierarchy[a].animationCache
        }
};
THREE.Animation.prototype.update = function(a) {
    if (this.isPlaying) {
        var c = ["pos", "rot", "scl"],
            b, e, f, d, g, h, j, l, k = this.data.JIT.hierarchy,
            m, p;
        this.currentTime += a * this.timeScale;
        p = this.currentTime;
        m = this.currentTime %= this.data.length;
        l = parseInt(Math.min(m * this.data.fps, this.data.length * this.data.fps), 10);
        for (var n = 0, v = this.hierarchy.length; n < v; n++) {
            a = this.hierarchy[n];
            j = a.animationCache;
            if (this.JITCompile && k[n][l] !== undefined)
                if (a instanceof THREE.Bone) {
                    a.skinMatrix = k[n][l];
                    a.matrixAutoUpdate = !1;
                    a.matrixWorldNeedsUpdate = !1
                } else {
                    a.matrix = k[n][l];
                    a.matrixAutoUpdate = !1;
                    a.matrixWorldNeedsUpdate = !0
                }
            else {
                if (this.JITCompile)
                    if (a instanceof THREE.Bone) a.skinMatrix = a.animationCache.originalMatrix;
                    else a.matrix = a.animationCache.originalMatrix;
                for (var A = 0; A < 3; A++) {
                    b = c[A];
                    g = j.prevKey[b];
                    h = j.nextKey[b];
                    if (h.time <= p) {
                        if (m < p)
                            if (this.loop) {
                                g = this.data.hierarchy[n].keys[0];
                                for (h = this.getNextKeyWith(b, n, 1); h.time < m;) {
                                    g = h;
                                    h = this.getNextKeyWith(b, n, h.index + 1)
                                }
                            } else { this.stop(); return }
                        else {
                            do {
                                g = h;
                                h = this.getNextKeyWith(b, n, h.index + 1)
                            } while (h.time <
                                m)
                        }
                        j.prevKey[b] = g;
                        j.nextKey[b] = h
                    }
                    a.matrixAutoUpdate = !0;
                    a.matrixWorldNeedsUpdate = !0;
                    e = (m - g.time) / (h.time - g.time);
                    f = g[b];
                    d = h[b];
                    if (e < 0 || e > 1) {
                        console.log("THREE.Animation.update: Warning! Scale out of bounds:" + e + " on bone " + n);
                        e = e < 0 ? 0 : 1
                    }
                    if (b === "pos") {
                        b = a.position;
                        if (this.interpolationType === THREE.AnimationHandler.LINEAR) {
                            b.x = f[0] + (d[0] - f[0]) * e;
                            b.y = f[1] + (d[1] - f[1]) * e;
                            b.z = f[2] + (d[2] - f[2]) * e
                        } else if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) {
                            this.points[0] =
                                this.getPrevKeyWith("pos", n, g.index - 1).pos;
                            this.points[1] = f;
                            this.points[2] = d;
                            this.points[3] = this.getNextKeyWith("pos", n, h.index + 1).pos;
                            e = e * 0.33 + 0.33;
                            f = this.interpolateCatmullRom(this.points, e);
                            b.x = f[0];
                            b.y = f[1];
                            b.z = f[2];
                            if (this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) {
                                e = this.interpolateCatmullRom(this.points, e * 1.01);
                                this.target.set(e[0], e[1], e[2]);
                                this.target.subSelf(b);
                                this.target.y = 0;
                                this.target.normalize();
                                e = Math.atan2(this.target.x, this.target.z);
                                a.rotation.set(0, e, 0)
                            }
                        }
                    } else if (b ===
                        "rot") THREE.Quaternion.slerp(f, d, a.quaternion, e);
                    else if (b === "scl") {
                        b = a.scale;
                        b.x = f[0] + (d[0] - f[0]) * e;
                        b.y = f[1] + (d[1] - f[1]) * e;
                        b.z = f[2] + (d[2] - f[2]) * e
                    }
                }
            }
        }
        if (this.JITCompile && k[0][l] === undefined) { this.hierarchy[0].update(undefined, !0); for (n = 0; n < this.hierarchy.length; n++) k[n][l] = this.hierarchy[n] instanceof THREE.Bone ? this.hierarchy[n].skinMatrix.clone() : this.hierarchy[n].matrix.clone() }
    }
};
THREE.Animation.prototype.interpolateCatmullRom = function(a, c) {
    var b = [],
        e = [],
        f, d, g, h, j, l;
    f = (a.length - 1) * c;
    d = Math.floor(f);
    f -= d;
    b[0] = d == 0 ? d : d - 1;
    b[1] = d;
    b[2] = d > a.length - 2 ? d : d + 1;
    b[3] = d > a.length - 3 ? d : d + 2;
    d = a[b[0]];
    h = a[b[1]];
    j = a[b[2]];
    l = a[b[3]];
    b = f * f;
    g = f * b;
    e[0] = this.interpolate(d[0], h[0], j[0], l[0], f, b, g);
    e[1] = this.interpolate(d[1], h[1], j[1], l[1], f, b, g);
    e[2] = this.interpolate(d[2], h[2], j[2], l[2], f, b, g);
    return e
};
THREE.Animation.prototype.interpolate = function(a, c, b, e, f, d, g) {
    a = (b - a) * 0.5;
    e = (e - c) * 0.5;
    return (2 * (c - b) + a + e) * g + (-3 * (c - b) - 2 * a - e) * d + a * f + c
};
THREE.Animation.prototype.getNextKeyWith = function(a, c, b) {
    var e = this.data.hierarchy[c].keys;
    if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) b = b < e.length - 1 ? b : e.length - 1;
    else b %= e.length;
    for (; b < e.length; b++)
        if (e[b][a] !== undefined) return e[b];
    return this.data.hierarchy[c].keys[0]
};
THREE.Animation.prototype.getPrevKeyWith = function(a, c, b) {
    var e = this.data.hierarchy[c].keys;
    for (b = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? b > 0 ? b : 0 : b >= 0 ? b : b + e.length; b >= 0; b--)
        if (e[b][a] !== undefined) return e[b];
    return this.data.hierarchy[c].keys[e.length - 1]
};
THREE.ColorUtils = {
    adjustHSV: function(a, c, b, e) {
        var f = THREE.ColorUtils.__hsv;
        THREE.ColorUtils.rgbToHsv(a, f);
        f.h = THREE.ColorUtils.clamp(f.h + c, 0, 1);
        f.s = THREE.ColorUtils.clamp(f.s + b, 0, 1);
        f.v = THREE.ColorUtils.clamp(f.v + e, 0, 1);
        a.setHSV(f.h, f.s, f.v)
    },
    rgbToHsv: function(a, c) {
        var b = a.r,
            e = a.g,
            f = a.b,
            d = Math.max(Math.max(b, e), f),
            g = Math.min(Math.min(b, e), f);
        if (g == d) g = b = 0;
        else {
            var h = d - g;
            g = h / d;
            b = b == d ? (e - f) / h : e == d ? 2 + (f - b) / h : 4 + (b - e) / h;
            b /= 6;
            b < 0 && (b += 1);
            b > 1 && (b -= 1)
        }
        c === undefined && (c = { h: 0, s: 0, v: 0 });
        c.h = b;
        c.s = g;
        c.v = d;
        return c
    },
    clamp: function(a, c, b) { return a < c ? c : a > b ? b : a }
};
THREE.ColorUtils.__hsv = { h: 0, s: 0, v: 0 };
var GeometryUtils = {
    merge: function(a, c) {
        var b = c instanceof THREE.Mesh,
            e = a.vertices.length,
            f = b ? c.geometry : c,
            d = a.vertices,
            g = f.vertices,
            h = a.faces,
            j = f.faces,
            l = a.faceVertexUvs[0];
        f = f.faceVertexUvs[0];
        b && c.matrixAutoUpdate && c.updateMatrix();
        for (var k = 0, m = g.length; k < m; k++) {
            var p = new THREE.Vertex(g[k].position.clone());
            b && c.matrix.multiplyVector3(p.position);
            d.push(p)
        }
        k = 0;
        for (m = j.length; k < m; k++) {
            g = j[k];
            var n, v, A = g.vertexNormals;
            p = g.vertexColors;
            if (g instanceof THREE.Face3) n = new THREE.Face3(g.a + e, g.b + e, g.c +
                e);
            else g instanceof THREE.Face4 && (n = new THREE.Face4(g.a + e, g.b + e, g.c + e, g.d + e));
            n.normal.copy(g.normal);
            b = 0;
            for (d = A.length; b < d; b++) {
                v = A[b];
                n.vertexNormals.push(v.clone())
            }
            n.color.copy(g.color);
            b = 0;
            for (d = p.length; b < d; b++) {
                v = p[b];
                n.vertexColors.push(v.clone())
            }
            n.materials = g.materials.slice();
            n.centroid.copy(g.centroid);
            h.push(n)
        }
        k = 0;
        for (m = f.length; k < m; k++) {
            e = f[k];
            h = [];
            b = 0;
            for (d = e.length; b < d; b++) h.push(new THREE.UV(e[b].u, e[b].v));
            l.push(h)
        }
    }
};
THREE.ImageUtils = {
    loadTexture: function(a, c, b) {
        var e = new Image,
            f = new THREE.Texture(e, c);
        e.onload = function() {
            f.needsUpdate = !0;
            b && b(this)
        };
        e.src = a;
        return f
    },
    loadTextureCube: function(a, c, b) {
        var e, f = [],
            d = new THREE.Texture(f, c);
        c = f.loadCount = 0;
        for (e = a.length; c < e; ++c) {
            f[c] = new Image;
            f[c].onload = function() {
                f.loadCount += 1;
                if (f.loadCount == 6) d.needsUpdate = !0;
                b && b(this)
            };
            f[c].src = a[c]
        }
        return d
    }
};
THREE.SceneUtils = {
    addMesh: function(a, c, b, e, f, d, g, h, j, l) {
        c = new THREE.Mesh(c, l);
        c.scale.x = c.scale.y = c.scale.z = b;
        c.position.x = e;
        c.position.y = f;
        c.position.z = d;
        c.rotation.x = g;
        c.rotation.y = h;
        c.rotation.z = j;
        a.addObject(c);
        return c
    },
    addPanoramaCubeWebGL: function(a, c, b) {
        var e = THREE.ShaderUtils.lib.cube;
        e.uniforms.tCube.texture = b;
        b = new THREE.MeshShaderMaterial({ fragmentShader: e.fragmentShader, vertexShader: e.vertexShader, uniforms: e.uniforms });
        c = new THREE.Mesh(new THREE.Cube(c, c, c, 1, 1, 1, null, !0), b);
        a.addObject(c);
        return c
    },
    addPanoramaCube: function(a, c, b) {
        var e = [];
        e.push(new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[0]) }));
        e.push(new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[1]) }));
        e.push(new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[2]) }));
        e.push(new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[3]) }));
        e.push(new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[4]) }));
        e.push(new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[5]) }));
        c = new THREE.Mesh(new THREE.Cube(c, c, c, 1, 1, e, !0),
            new THREE.MeshFaceMaterial);
        a.addObject(c);
        return c
    },
    addPanoramaCubePlanes: function(a, c, b) {
        var e = c / 2;
        c = new THREE.Plane(c, c);
        var f = Math.PI,
            d = Math.PI / 2;
        THREE.SceneUtils.addMesh(a, c, 1, 0, 0, -e, 0, 0, 0, new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[5]) }));
        THREE.SceneUtils.addMesh(a, c, 1, -e, 0, 0, 0, d, 0, new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[0]) }));
        THREE.SceneUtils.addMesh(a, c, 1, e, 0, 0, 0, -d, 0, new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[1]) }));
        THREE.SceneUtils.addMesh(a, c, 1, 0, e, 0, d,
            0, f, new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[2]) }));
        THREE.SceneUtils.addMesh(a, c, 1, 0, -e, 0, -d, 0, f, new THREE.MeshBasicMaterial({ map: new THREE.Texture(b[3]) }))
    },
    showHierarchy: function(a, c) { THREE.SceneUtils.traverseHierarchy(a, function(b) { b.visible = c }) },
    traverseHierarchy: function(a, c) {
        var b, e, f = a.children.length;
        for (e = 0; e < f; e++) {
            b = a.children[e];
            c(b);
            THREE.SceneUtils.traverseHierarchy(b, c)
        }
    }
};
THREE.ShaderUtils = {
    lib: {
        fresnel: {
            uniforms: { mRefractionRatio: { type: "f", value: 1.02 }, mFresnelBias: { type: "f", value: 0.1 }, mFresnelPower: { type: "f", value: 2 }, mFresnelScale: { type: "f", value: 1 }, tCube: { type: "t", value: 1, texture: null } },
            fragmentShader: "uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",
            vertexShader: "uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"
        },
        normal: {
            uniforms: {
                enableAO: { type: "i", value: 0 },
                enableDiffuse: { type: "i", value: 0 },
                enableSpecular: { type: "i", value: 0 },
                tDiffuse: { type: "t", value: 0, texture: null },
                tNormal: { type: "t", value: 2, texture: null },
                tSpecular: { type: "t", value: 3, texture: null },
                tAO: { type: "t", value: 4, texture: null },
                uNormalScale: { type: "f", value: 1 },
                tDisplacement: { type: "t", value: 5, texture: null },
                uDisplacementBias: { type: "f", value: -0.5 },
                uDisplacementScale: { type: "f", value: 2.5 },
                uPointLightPos: { type: "v3", value: new THREE.Vector3 },
                uPointLightColor: {
                    type: "c",
                    value: new THREE.Color(15658734)
                },
                uDirLightPos: { type: "v3", value: new THREE.Vector3 },
                uDirLightColor: { type: "c", value: new THREE.Color(15658734) },
                uAmbientLightColor: { type: "c", value: new THREE.Color(328965) },
                uDiffuseColor: { type: "c", value: new THREE.Color(15658734) },
                uSpecularColor: { type: "c", value: new THREE.Color(1118481) },
                uAmbientColor: { type: "c", value: new THREE.Color(328965) },
                uShininess: { type: "f", value: 30 }
            },
            fragmentShader: "uniform vec3 uDirLightPos;\nuniform vec3 uAmbientLightColor;\nuniform vec3 uDirLightColor;\nuniform vec3 uPointLightColor;\nuniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform float uNormalScale;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vPointLightVector;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 diffuseTex = vec3( 1.0, 1.0, 1.0 );\nvec3 aoTex = vec3( 1.0, 1.0, 1.0 );\nvec3 specularTex = vec3( 1.0, 1.0, 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse )\ndiffuseTex = texture2D( tDiffuse, vUv ).xyz;\nif( enableAO )\naoTex = texture2D( tAO, vUv ).xyz;\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( vTangent, vBinormal, vNormal );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\nvec4 pointDiffuse  = vec4( 0.0, 0.0, 0.0, 0.0 );\nvec4 pointSpecular = vec4( 0.0, 0.0, 0.0, 0.0 );\nvec3 pointVector = normalize( vPointLightVector );\nvec3 pointHalfVector = normalize( vPointLightVector + vViewPosition );\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );\npointDiffuse  += vec4( uDiffuseColor, 1.0 ) * pointDiffuseWeight;\npointSpecular += vec4( uSpecularColor, 1.0 ) * pointSpecularWeight * pointDiffuseWeight;\nvec4 dirDiffuse  = vec4( 0.0, 0.0, 0.0, 0.0 );\nvec4 dirSpecular = vec4( 0.0, 0.0, 0.0, 0.0 );\nvec4 lDirection = viewMatrix * vec4( uDirLightPos, 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );\ndirDiffuse  += vec4( uDiffuseColor, 1.0 ) * dirDiffuseWeight;\ndirSpecular += vec4( uSpecularColor, 1.0 ) * dirSpecularWeight * dirDiffuseWeight;\nvec4 totalLight = vec4( uAmbientLightColor * uAmbientColor, 1.0 );\ntotalLight += vec4( uDirLightColor, 1.0 ) * ( dirDiffuse + dirSpecular );\ntotalLight += vec4( uPointLightColor, 1.0 ) * ( pointDiffuse + pointSpecular );\ngl_FragColor = vec4( totalLight.xyz * aoTex * diffuseTex, 1.0 );\n}",
            vertexShader: "attribute vec4 tangent;\nuniform vec3 uPointLightPos;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vPointLightVector;\nvarying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\nvTangent = normalize( normalMatrix * tangent.xyz );\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvBinormal = normalize( vBinormal );\nvUv = uv;\nvec4 lPosition = viewMatrix * vec4( uPointLightPos, 1.0 );\nvPointLightVector = normalize( lPosition.xyz - mvPosition.xyz );\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif\n}"
        },
        cube: { uniforms: { tCube: { type: "t", value: 1, texture: null } }, vertexShader: "varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", fragmentShader: "uniform samplerCube tCube;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( - wPos.x, wPos.yz ) );\n}" },
        convolution: {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: 0,
                    texture: null
                },
                uImageIncrement: { type: "v2", value: new THREE.Vector2(0.001953125, 0) },
                cKernel: { type: "fv1", value: [] }
            },
            vertexShader: "varying vec2 vUv;\nuniform vec2 uImageIncrement;\nvoid main(void) {\nvUv = uv - ((KERNEL_SIZE - 1.0) / 2.0) * uImageIncrement;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "varying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform vec2 uImageIncrement;\nuniform float cKernel[KERNEL_SIZE];\nvoid main(void) {\nvec2 imageCoord = vUv;\nvec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );\nfor( int i=0; i<KERNEL_SIZE; ++i ) {\nsum += texture2D( tDiffuse, imageCoord ) * cKernel[i];\nimageCoord += uImageIncrement;\n}\ngl_FragColor = sum;\n}"
        },
        film: { uniforms: { tDiffuse: { type: "t", value: 0, texture: null }, time: { type: "f", value: 0 }, nIntensity: { type: "f", value: 0.5 }, sIntensity: { type: "f", value: 0.05 }, sCount: { type: "f", value: 4096 }, grayscale: { type: "i", value: 1 } }, vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", fragmentShader: "varying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform float time;\nuniform bool grayscale;\nuniform float nIntensity;\nuniform float sIntensity;\nuniform float sCount;\nvoid main() {\nvec4 cTextureScreen = texture2D( tDiffuse, vUv );\nfloat x = vUv.x * vUv.y * time *  1000.0;\nx = mod( x, 13.0 ) * mod( x, 123.0 );\nfloat dx = mod( x, 0.01 );\nvec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );\nvec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );\ncResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;\ncResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );\nif( grayscale ) {\ncResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );\n}\ngl_FragColor =  vec4( cResult, cTextureScreen.a );\n}" },
        screen: { uniforms: { tDiffuse: { type: "t", value: 0, texture: null }, opacity: { type: "f", value: 1 } }, vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", fragmentShader: "varying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform float opacity;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\ngl_FragColor = opacity * texel;\n}" },
        basic: {
            uniforms: {},
            vertexShader: "void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "void main() {\ngl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );\n}"
        }
    },
    buildKernel: function(a) {
        var c, b, e, f, d = 2 * Math.ceil(a * 3) + 1;
        d > 25 && (d = 25);
        f = (d - 1) * 0.5;
        b = Array(d);
        for (c = e = 0; c < d; ++c) {
            b[c] = Math.exp(-((c - f) * (c - f)) / (2 * a * a));
            e += b[c]
        }
        for (c = 0; c < d; ++c) b[c] /= e;
        return b
    }
};
THREE.QuakeCamera = function(a) {
    function c(b, e) { return function() { e.apply(b, arguments) } }
    THREE.Camera.call(this, a.fov, a.aspect, a.near, a.far, a.target);
    this.movementSpeed = 1;
    this.lookSpeed = 0.0050;
    this.noFly = !1;
    this.lookVertical = !0;
    this.autoForward = !1;
    this.activeLook = !0;
    this.heightSpeed = !1;
    this.heightCoef = 1;
    this.heightMin = 0;
    this.constrainVertical = !1;
    this.verticalMin = 0;
    this.verticalMax = 3.14;
    this.domElement = document;
    this.lastUpdate = (new Date).getTime();
    this.tdiff = 0;
    if (a) {
        if (a.movementSpeed !== undefined) this.movementSpeed =
            a.movementSpeed;
        if (a.lookSpeed !== undefined) this.lookSpeed = a.lookSpeed;
        if (a.noFly !== undefined) this.noFly = a.noFly;
        if (a.lookVertical !== undefined) this.lookVertical = a.lookVertical;
        if (a.autoForward !== undefined) this.autoForward = a.autoForward;
        if (a.activeLook !== undefined) this.activeLook = a.activeLook;
        if (a.heightSpeed !== undefined) this.heightSpeed = a.heightSpeed;
        if (a.heightCoef !== undefined) this.heightCoef = a.heightCoef;
        if (a.heightMin !== undefined) this.heightMin = a.heightMin;
        if (a.heightMax !== undefined) this.heightMax =
            a.heightMax;
        if (a.constrainVertical !== undefined) this.constrainVertical = a.constrainVertical;
        if (a.verticalMin !== undefined) this.verticalMin = a.verticalMin;
        if (a.verticalMax !== undefined) this.verticalMax = a.verticalMax;
        if (a.domElement !== undefined) this.domElement = a.domElement
    }
    this.theta = this.phi = this.lon = this.lat = this.mouseY = this.mouseX = this.autoSpeedFactor = 0;
    this.moveForward = !1;
    this.moveBackward = !1;
    this.moveLeft = !1;
    this.moveRight = !1;
    this.freeze = !1;
    this.mouseDragOn = !1;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY =
        window.innerHeight / 2;
    this.onMouseDown = function(b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.activeLook) switch (b.button) {
            case 0:
                this.moveForward = !0;
                break;
            case 2:
                this.moveBackward = !0
        }
        this.mouseDragOn = !0
    };
    this.onMouseUp = function(b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.activeLook) switch (b.button) {
            case 0:
                this.moveForward = !1;
                break;
            case 2:
                this.moveBackward = !1
        }
        this.mouseDragOn = !1
    };
    this.onMouseMove = function(b) {
        this.mouseX = b.clientX - this.windowHalfX;
        this.mouseY = b.clientY - this.windowHalfY
    };
    this.onKeyDown =
        function(b) {
            switch (b.keyCode) {
                case 38:
                case 87:
                    this.moveForward = !0;
                    break;
                case 37:
                case 65:
                    this.moveLeft = !0;
                    break;
                case 40:
                case 83:
                    this.moveBackward = !0;
                    break;
                case 39:
                case 68:
                    this.moveRight = !0;
                    break;
                case 81:
                    this.freeze = !this.freeze
            }
        };
    this.onKeyUp = function(b) {
        switch (b.keyCode) {
            case 38:
            case 87:
                this.moveForward = !1;
                break;
            case 37:
            case 65:
                this.moveLeft = !1;
                break;
            case 40:
            case 83:
                this.moveBackward = !1;
                break;
            case 39:
            case 68:
                this.moveRight = !1
        }
    };
    this.update = function() {
        var b = (new Date).getTime();
        this.tdiff = (b - this.lastUpdate) /
            1E3;
        this.lastUpdate = b;
        if (!this.freeze) {
            this.autoSpeedFactor = this.heightSpeed ? this.tdiff * ((this.position.y < this.heightMin ? this.heightMin : this.position.y > this.heightMax ? this.heightMax : this.position.y) - this.heightMin) * this.heightCoef : 0;
            var e = this.tdiff * this.movementSpeed;
            (this.moveForward || this.autoForward && !this.moveBackward) && this.translateZ(-(e + this.autoSpeedFactor));
            this.moveBackward && this.translateZ(e);
            this.moveLeft && this.translateX(-e);
            this.moveRight && this.translateX(e);
            e = this.tdiff * this.lookSpeed;
            this.activeLook || (e = 0);
            this.lon += this.mouseX * e;
            this.lookVertical && (this.lat -= this.mouseY * e);
            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;
            b = this.target.position;
            var f = this.position;
            b.x = f.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            b.y = f.y + 100 * Math.cos(this.phi);
            b.z = f.z + 100 * Math.sin(this.phi) * Math.sin(this.theta)
        }
        this.lon += this.mouseX * e;
        this.lookVertical && (this.lat -= this.mouseY * e);
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi =
            (90 - this.lat) * Math.PI / 180;
        this.theta = this.lon * Math.PI / 180;
        if (this.constrainVertical) this.phi = (this.phi - 0) * (this.verticalMax - this.verticalMin) / 3.14 + this.verticalMin;
        b = this.target.position;
        f = this.position;
        b.x = f.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        b.y = f.y + 100 * Math.cos(this.phi);
        b.z = f.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
        this.supr.update.call(this)
    };
    this.domElement.addEventListener("contextmenu", function(b) { b.preventDefault() }, !1);
    this.domElement.addEventListener("mousemove", c(this,
        this.onMouseMove), !1);
    this.domElement.addEventListener("mousedown", c(this, this.onMouseDown), !1);
    this.domElement.addEventListener("mouseup", c(this, this.onMouseUp), !1);
    this.domElement.addEventListener("keydown", c(this, this.onKeyDown), !1);
    this.domElement.addEventListener("keyup", c(this, this.onKeyUp), !1)
};
THREE.QuakeCamera.prototype = new THREE.Camera;
THREE.QuakeCamera.prototype.constructor = THREE.QuakeCamera;
THREE.QuakeCamera.prototype.supr = THREE.Camera.prototype;
THREE.QuakeCamera.prototype.translate = function(a, c) {
    this.matrix.rotateAxis(c);
    if (this.noFly) c.y = 0;
    this.position.addSelf(c.multiplyScalar(a));
    this.target.position.addSelf(c.multiplyScalar(a))
};
THREE.PathCamera = function(a) {
    function c(l, k, m, p) {
        var n = { name: m, fps: 0.6, length: p, hierarchy: [] },
            v, A = k.getControlPointsArray(),
            w = k.getLength(),
            u = A.length,
            y = 0;
        v = u - 1;
        k = { parent: -1, keys: [] };
        k.keys[0] = { time: 0, pos: A[0], rot: [0, 0, 0, 1], scl: [1, 1, 1] };
        k.keys[v] = { time: p, pos: A[v], rot: [0, 0, 0, 1], scl: [1, 1, 1] };
        for (v = 1; v < u - 1; v++) {
            y = p * w.chunks[v] / w.total;
            k.keys[v] = { time: y, pos: A[v] }
        }
        n.hierarchy[0] = k;
        THREE.AnimationHandler.add(n);
        return new THREE.Animation(l, m, THREE.AnimationHandler.CATMULLROM_FORWARD, !1)
    }

    function b(l, k) {
        var m,
            p, n = new THREE.Geometry;
        for (m = 0; m < l.points.length * k; m++) {
            p = m / (l.points.length * k);
            p = l.getPoint(p);
            n.vertices[m] = new THREE.Vertex(new THREE.Vector3(p.x, p.y, p.z))
        }
        return n
    }

    function e(l, k) {
        var m = b(k, 10),
            p = b(k, 10),
            n = new THREE.LineBasicMaterial({ color: 16711680, linewidth: 3 });
        lineObj = new THREE.Line(m, n);
        particleObj = new THREE.ParticleSystem(p, new THREE.ParticleBasicMaterial({ color: 16755200, size: 3 }));
        lineObj.scale.set(1, 1, 1);
        l.addChild(lineObj);
        particleObj.scale.set(1, 1, 1);
        l.addChild(particleObj);
        p = new THREE.Sphere(1,
            16, 8);
        n = new THREE.MeshBasicMaterial({ color: 65280 });
        for (i = 0; i < k.points.length; i++) {
            m = new THREE.Mesh(p, n);
            m.position.copy(k.points[i]);
            m.updateMatrix();
            l.addChild(m)
        }
    }
    THREE.Camera.call(this, a.fov, a.aspect, a.near, a.far, a.target);
    this.id = "PathCamera" + THREE.PathCameraIdCounter++;
    this.duration = 1E4;
    this.waypoints = [];
    this.useConstantSpeed = !0;
    this.resamplingCoef = 50;
    this.debugPath = new THREE.Object3D;
    this.debugDummy = new THREE.Object3D;
    this.animationParent = new THREE.Object3D;
    this.lookSpeed = 0.0050;
    this.lookVertical = !0;
    this.lookHorizontal = !0;
    this.verticalAngleMap = { srcRange: [0, 6.28], dstRange: [0, 6.28] };
    this.horizontalAngleMap = { srcRange: [0, 6.28], dstRange: [0, 6.28] };
    this.domElement = document;
    if (a) {
        if (a.duration !== undefined) this.duration = a.duration * 1E3;
        if (a.waypoints !== undefined) this.waypoints = a.waypoints;
        if (a.useConstantSpeed !== undefined) this.useConstantSpeed = a.useConstantSpeed;
        if (a.resamplingCoef !== undefined) this.resamplingCoef = a.resamplingCoef;
        if (a.createDebugPath !== undefined) this.createDebugPath = a.createDebugPath;
        if (a.createDebugDummy !== undefined) this.createDebugDummy = a.createDebugDummy;
        if (a.lookSpeed !== undefined) this.lookSpeed = a.lookSpeed;
        if (a.lookVertical !== undefined) this.lookVertical = a.lookVertical;
        if (a.lookHorizontal !== undefined) this.lookHorizontal = a.lookHorizontal;
        if (a.verticalAngleMap !== undefined) this.verticalAngleMap = a.verticalAngleMap;
        if (a.horizontalAngleMap !== undefined) this.horizontalAngleMap = a.horizontalAngleMap;
        if (a.domElement !== undefined) this.domElement = a.domElement
    }
    this.theta = this.phi = this.lon =
        this.lat = this.mouseY = this.mouseX = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    var f = Math.PI * 2,
        d = Math.PI / 180;
    this.update = function(l, k, m) {
        var p, n;
        this.lookHorizontal && (this.lon += this.mouseX * this.lookSpeed);
        this.lookVertical && (this.lat -= this.mouseY * this.lookSpeed);
        this.lon = Math.max(0, Math.min(360, this.lon));
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = (90 - this.lat) * d;
        this.theta = this.lon * d;
        p = this.phi % f;
        this.phi = p >= 0 ? p : p + f;
        p = this.verticalAngleMap.srcRange;
        n = this.verticalAngleMap.dstRange;
        this.phi = (this.phi - p[0]) * (n[1] - n[0]) / (p[1] - p[0]) + n[0];
        p = this.horizontalAngleMap.srcRange;
        n = this.horizontalAngleMap.dstRange;
        this.theta = (this.theta - p[0]) * (n[1] - n[0]) / (p[1] - p[0]) + n[0];
        p = this.target.position;
        p.x = 100 * Math.sin(this.phi) * Math.cos(this.theta);
        p.y = 100 * Math.cos(this.phi);
        p.z = 100 * Math.sin(this.phi) * Math.sin(this.theta);
        this.supr.update.call(this, l, k, m)
    };
    this.onMouseMove = function(l) {
        this.mouseX = l.clientX - this.windowHalfX;
        this.mouseY = l.clientY - this.windowHalfY
    };
    this.spline = new THREE.Spline;
    this.spline.initFromArray(this.waypoints);
    this.useConstantSpeed && this.spline.reparametrizeByArcLength(this.resamplingCoef);
    if (this.createDebugDummy) {
        a = new THREE.MeshLambertMaterial({ color: 30719 });
        var g = new THREE.MeshLambertMaterial({ color: 65280 }),
            h = new THREE.Cube(10, 10, 20),
            j = new THREE.Cube(2, 2, 10);
        this.animationParent = new THREE.Mesh(h, a);
        a = new THREE.Mesh(j, g);
        a.position.set(0, 10, 0);
        this.animation = c(this.animationParent, this.spline, this.id, this.duration);
        this.animationParent.addChild(this);
        this.animationParent.addChild(this.target);
        this.animationParent.addChild(a)
    } else {
        this.animation =
            c(this.animationParent, this.spline, this.id, this.duration);
        this.animationParent.addChild(this.target);
        this.animationParent.addChild(this)
    }
    this.createDebugPath && e(this.debugPath, this.spline);
    this.domElement.addEventListener("mousemove", function(l, k) { return function() { k.apply(l, arguments) } }(this, this.onMouseMove), !1)
};
THREE.PathCamera.prototype = new THREE.Camera;
THREE.PathCamera.prototype.constructor = THREE.PathCamera;
THREE.PathCamera.prototype.supr = THREE.Camera.prototype;
THREE.PathCameraIdCounter = 0;
THREE.FlyCamera = function(a) {
    function c(b, e) { return function() { e.apply(b, arguments) } }
    THREE.Camera.call(this, a.fov, a.aspect, a.near, a.far, a.target);
    this.tmpQuaternion = new THREE.Quaternion;
    this.movementSpeed = 1;
    this.rollSpeed = 0.0050;
    this.dragToLook = !1;
    this.autoForward = !1;
    this.domElement = document;
    if (a) {
        if (a.movementSpeed !== undefined) this.movementSpeed = a.movementSpeed;
        if (a.rollSpeed !== undefined) this.rollSpeed = a.rollSpeed;
        if (a.dragToLook !== undefined) this.dragToLook = a.dragToLook;
        if (a.autoForward !== undefined) this.autoForward =
            a.autoForward;
        if (a.domElement !== undefined) this.domElement = a.domElement
    }
    this.useTarget = !1;
    this.useQuaternion = !0;
    this.mouseStatus = 0;
    this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);
    this.lastUpdate = -1;
    this.tdiff = 0;
    this.handleEvent = function(b) { if (typeof this[b.type] == "function") this[b.type](b) };
    this.keydown = function(b) {
        if (!b.altKey) {
            switch (b.keyCode) {
                case 16:
                    this.movementSpeedMultiplier =
                        0.1;
                    break;
                case 87:
                    this.moveState.forward = 1;
                    break;
                case 83:
                    this.moveState.back = 1;
                    break;
                case 65:
                    this.moveState.left = 1;
                    break;
                case 68:
                    this.moveState.right = 1;
                    break;
                case 82:
                    this.moveState.up = 1;
                    break;
                case 70:
                    this.moveState.down = 1;
                    break;
                case 38:
                    this.moveState.pitchUp = 1;
                    break;
                case 40:
                    this.moveState.pitchDown = 1;
                    break;
                case 37:
                    this.moveState.yawLeft = 1;
                    break;
                case 39:
                    this.moveState.yawRight = 1;
                    break;
                case 81:
                    this.moveState.rollLeft = 1;
                    break;
                case 69:
                    this.moveState.rollRight = 1
            }
            this.updateMovementVector();
            this.updateRotationVector()
        }
    };
    this.keyup = function(b) {
        switch (b.keyCode) {
            case 16:
                this.movementSpeedMultiplier = 1;
                break;
            case 87:
                this.moveState.forward = 0;
                break;
            case 83:
                this.moveState.back = 0;
                break;
            case 65:
                this.moveState.left = 0;
                break;
            case 68:
                this.moveState.right = 0;
                break;
            case 82:
                this.moveState.up = 0;
                break;
            case 70:
                this.moveState.down = 0;
                break;
            case 38:
                this.moveState.pitchUp = 0;
                break;
            case 40:
                this.moveState.pitchDown = 0;
                break;
            case 37:
                this.moveState.yawLeft = 0;
                break;
            case 39:
                this.moveState.yawRight = 0;
                break;
            case 81:
                this.moveState.rollLeft = 0;
                break;
            case 69:
                this.moveState.rollRight = 0
        }
        this.updateMovementVector();
        this.updateRotationVector()
    };
    this.mousedown = function(b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.dragToLook) this.mouseStatus++;
        else switch (b.button) {
            case 0:
                this.moveForward = !0;
                break;
            case 2:
                this.moveBackward = !0
        }
    };
    this.mousemove = function(b) {
        if (!this.dragToLook || this.mouseStatus > 0) {
            var e = this.getContainerDimensions(),
                f = e.size[0] / 2,
                d = e.size[1] / 2;
            this.moveState.yawLeft = -(b.clientX - e.offset[0] - f) / f;
            this.moveState.pitchDown = (b.clientY -
                e.offset[1] - d) / d;
            this.updateRotationVector()
        }
    };
    this.mouseup = function(b) {
        b.preventDefault();
        b.stopPropagation();
        if (this.dragToLook) {
            this.mouseStatus--;
            this.moveState.yawLeft = this.moveState.pitchDown = 0
        } else switch (b.button) {
            case 0:
                this.moveForward = !1;
                break;
            case 2:
                this.moveBackward = !1
        }
        this.updateRotationVector()
    };
    this.update = function() {
        var b = (new Date).getTime();
        if (this.lastUpdate == -1) this.lastUpdate = b;
        this.tdiff = (b - this.lastUpdate) / 1E3;
        this.lastUpdate = b;
        b = this.tdiff * this.movementSpeed;
        var e = this.tdiff *
            this.rollSpeed;
        this.translateX(this.moveVector.x * b);
        this.translateY(this.moveVector.y * b);
        this.translateZ(this.moveVector.z * b);
        this.tmpQuaternion.set(this.rotationVector.x * e, this.rotationVector.y * e, this.rotationVector.z * e, 1).normalize();
        this.quaternion.multiplySelf(this.tmpQuaternion);
        this.matrix.setPosition(this.position);
        this.matrix.setRotationFromQuaternion(this.quaternion);
        this.matrixWorldNeedsUpdate = !0;
        this.supr.update.call(this)
    };
    this.updateMovementVector = function() {
        var b = this.moveState.forward ||
            this.autoForward && !this.moveState.back ? 1 : 0;
        this.moveVector.x = -this.moveState.left + this.moveState.right;
        this.moveVector.y = -this.moveState.down + this.moveState.up;
        this.moveVector.z = -b + this.moveState.back
    };
    this.updateRotationVector = function() {
        this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp;
        this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft;
        this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft
    };
    this.getContainerDimensions = function() {
        return this.domElement !=
            document ? { size: [this.domElement.offsetWidth, this.domElement.offsetHeight], offset: [this.domElement.offsetLeft, this.domElement.offsetTop] } : { size: [window.innerWidth, window.innerHeight], offset: [0, 0] }
    };
    this.domElement.addEventListener("mousemove", c(this, this.mousemove), !1);
    this.domElement.addEventListener("mousedown", c(this, this.mousedown), !1);
    this.domElement.addEventListener("mouseup", c(this, this.mouseup), !1);
    window.addEventListener("keydown", c(this, this.keydown), !1);
    window.addEventListener("keyup", c(this,
        this.keyup), !1);
    this.updateMovementVector();
    this.updateRotationVector()
};
THREE.FlyCamera.prototype = new THREE.Camera;
THREE.FlyCamera.prototype.constructor = THREE.FlyCamera;
THREE.FlyCamera.prototype.supr = THREE.Camera.prototype;
THREE.RollCamera = function(a, c, b, e) {
    THREE.Camera.call(this, a, c, b, e);
    this.mouseLook = !0;
    this.autoForward = !1;
    this.rollSpeed = this.movementSpeed = this.lookSpeed = 1;
    this.constrainVertical = [-0.9, 0.9];
    this.domElement = document;
    this.useTarget = !1;
    this.matrixAutoUpdate = !1;
    this.forward = new THREE.Vector3(0, 0, 1);
    this.roll = 0;
    this.lastUpdate = -1;
    this.delta = 0;
    var f = new THREE.Vector3,
        d = new THREE.Vector3,
        g = new THREE.Vector3,
        h = new THREE.Matrix4,
        j = !1,
        l = 1,
        k = 0,
        m = 0,
        p = 0,
        n = 0,
        v = 0,
        A = window.innerWidth / 2,
        w = window.innerHeight / 2;
    this.update =
        function() {
            var u = (new Date).getTime();
            if (this.lastUpdate == -1) this.lastUpdate = u;
            this.delta = (u - this.lastUpdate) / 1E3;
            this.lastUpdate = u;
            if (this.mouseLook) {
                u = this.delta * this.lookSpeed;
                this.rotateHorizontally(u * n);
                this.rotateVertically(u * v)
            }
            u = this.delta * this.movementSpeed;
            this.translateZ(u * (k > 0 || this.autoForward && !(k < 0) ? 1 : k));
            this.translateX(u * m);
            this.translateY(u * p);
            j && (this.roll += this.rollSpeed * this.delta * l);
            if (this.forward.y > this.constrainVertical[1]) {
                this.forward.y = this.constrainVertical[1];
                this.forward.normalize()
            } else if (this.forward.y <
                this.constrainVertical[0]) {
                this.forward.y = this.constrainVertical[0];
                this.forward.normalize()
            }
            g.copy(this.forward);
            d.set(0, 1, 0);
            f.cross(d, g).normalize();
            d.cross(g, f).normalize();
            this.matrix.n11 = f.x;
            this.matrix.n12 = d.x;
            this.matrix.n13 = g.x;
            this.matrix.n21 = f.y;
            this.matrix.n22 = d.y;
            this.matrix.n23 = g.y;
            this.matrix.n31 = f.z;
            this.matrix.n32 = d.z;
            this.matrix.n33 = g.z;
            h.identity();
            h.n11 = Math.cos(this.roll);
            h.n12 = -Math.sin(this.roll);
            h.n21 = Math.sin(this.roll);
            h.n22 = Math.cos(this.roll);
            this.matrix.multiplySelf(h);
            this.matrixWorldNeedsUpdate = !0;
            this.matrix.n14 = this.position.x;
            this.matrix.n24 = this.position.y;
            this.matrix.n34 = this.position.z;
            this.supr.update.call(this)
        };
    this.translateX = function(u) {
        this.position.x += this.matrix.n11 * u;
        this.position.y += this.matrix.n21 * u;
        this.position.z += this.matrix.n31 * u
    };
    this.translateY = function(u) {
        this.position.x += this.matrix.n12 * u;
        this.position.y += this.matrix.n22 * u;
        this.position.z += this.matrix.n32 * u
    };
    this.translateZ = function(u) {
        this.position.x -= this.matrix.n13 * u;
        this.position.y -=
            this.matrix.n23 * u;
        this.position.z -= this.matrix.n33 * u
    };
    this.rotateHorizontally = function(u) {
        f.set(this.matrix.n11, this.matrix.n21, this.matrix.n31);
        f.multiplyScalar(u);
        this.forward.subSelf(f);
        this.forward.normalize()
    };
    this.rotateVertically = function(u) {
        d.set(this.matrix.n12, this.matrix.n22, this.matrix.n32);
        d.multiplyScalar(u);
        this.forward.addSelf(d);
        this.forward.normalize()
    };
    this.domElement.addEventListener("contextmenu", function(u) { u.preventDefault() }, !1);
    this.domElement.addEventListener("mousemove",
        function(u) {
            n = (u.clientX - A) / window.innerWidth;
            v = (u.clientY - w) / window.innerHeight
        }, !1);
    this.domElement.addEventListener("mousedown", function(u) {
        u.preventDefault();
        u.stopPropagation();
        switch (u.button) {
            case 0:
                k = 1;
                break;
            case 2:
                k = -1
        }
    }, !1);
    this.domElement.addEventListener("mouseup", function(u) {
        u.preventDefault();
        u.stopPropagation();
        switch (u.button) {
            case 0:
                k = 0;
                break;
            case 2:
                k = 0
        }
    }, !1);
    this.domElement.addEventListener("keydown", function(u) {
        switch (u.keyCode) {
            case 38:
            case 87:
                k = 1;
                break;
            case 37:
            case 65:
                m = -1;
                break;
            case 40:
            case 83:
                k = -1;
                break;
            case 39:
            case 68:
                m = 1;
                break;
            case 81:
                j = !0;
                l = 1;
                break;
            case 69:
                j = !0;
                l = -1;
                break;
            case 82:
                p = 1;
                break;
            case 70:
                p = -1
        }
    }, !1);
    this.domElement.addEventListener("keyup", function(u) {
        switch (u.keyCode) {
            case 38:
            case 87:
                k = 0;
                break;
            case 37:
            case 65:
                m = 0;
                break;
            case 40:
            case 83:
                k = 0;
                break;
            case 39:
            case 68:
                m = 0;
                break;
            case 81:
                j = !1;
                break;
            case 69:
                j = !1;
                break;
            case 82:
                p = 0;
                break;
            case 70:
                p = 0
        }
    }, !1)
};
THREE.RollCamera.prototype = new THREE.Camera;
THREE.RollCamera.prototype.constructor = THREE.RollCamera;
THREE.RollCamera.prototype.supr = THREE.Camera.prototype;
THREE.Cube = function(a, c, b, e, f, d, g, h, j) {
    function l(w, u, y, o, z, B, I, K) {
        var J, G, D = e || 1,
            L = f || 1,
            R = z / 2,
            O = B / 2,
            S = k.vertices.length;
        if (w == "x" && u == "y" || w == "y" && u == "x") J = "z";
        else if (w == "x" && u == "z" || w == "z" && u == "x") {
            J = "y";
            L = d || 1
        } else if (w == "z" && u == "y" || w == "y" && u == "z") {
            J = "x";
            D = d || 1
        }
        var P = D + 1,
            F = L + 1;
        z /= D;
        var M = B / L;
        for (G = 0; G < F; G++)
            for (B = 0; B < P; B++) {
                var Q = new THREE.Vector3;
                Q[w] = (B * z - R) * y;
                Q[u] = (G * M - O) * o;
                Q[J] = I;
                k.vertices.push(new THREE.Vertex(Q))
            }
        for (G = 0; G < L; G++)
            for (B = 0; B < D; B++) {
                k.faces.push(new THREE.Face4(B + P * G + S, B +
                    P * (G + 1) + S, B + 1 + P * (G + 1) + S, B + 1 + P * G + S, null, null, K));
                k.faceVertexUvs[0].push([new THREE.UV(B / D, G / L), new THREE.UV(B / D, (G + 1) / L), new THREE.UV((B + 1) / D, (G + 1) / L), new THREE.UV((B + 1) / D, G / L)])
            }
    }
    THREE.Geometry.call(this);
    var k = this,
        m = a / 2,
        p = c / 2,
        n = b / 2;
    h = h ? -1 : 1;
    if (g !== undefined)
        if (g instanceof Array) this.materials = g;
        else { this.materials = []; for (var v = 0; v < 6; v++) this.materials.push([g]) }
    else this.materials = [];
    this.sides = { px: !0, nx: !0, py: !0, ny: !0, pz: !0, nz: !0 };
    if (j != undefined)
        for (var A in j) this.sides[A] != undefined && (this.sides[A] =
            j[A]);
    this.sides.px && l("z", "y", 1 * h, -1, b, c, -m, this.materials[0]);
    this.sides.nx && l("z", "y", -1 * h, -1, b, c, m, this.materials[1]);
    this.sides.py && l("x", "z", 1 * h, 1, a, b, p, this.materials[2]);
    this.sides.ny && l("x", "z", 1 * h, -1, a, b, -p, this.materials[3]);
    this.sides.pz && l("x", "y", 1 * h, -1, a, c, n, this.materials[4]);
    this.sides.nz && l("x", "y", -1 * h, -1, a, c, -n, this.materials[5]);
    (function() {
        for (var w = [], u = [], y = 0, o = k.vertices.length; y < o; y++) {
            for (var z = k.vertices[y], B = !1, I = 0, K = w.length; I < K; I++) {
                var J = w[I];
                if (z.position.x == J.position.x &&
                    z.position.y == J.position.y && z.position.z == J.position.z) {
                    u[y] = I;
                    B = !0;
                    break
                }
            }
            if (!B) {
                u[y] = w.length;
                w.push(new THREE.Vertex(z.position.clone()))
            }
        }
        y = 0;
        for (o = k.faces.length; y < o; y++) {
            z = k.faces[y];
            z.a = u[z.a];
            z.b = u[z.b];
            z.c = u[z.c];
            z.d = u[z.d]
        }
        k.vertices = w
    })();
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.Cube.prototype = new THREE.Geometry;
THREE.Cube.prototype.constructor = THREE.Cube;
THREE.Cylinder = function(a, c, b, e, f, d) {
    function g(p, n, v) { h.vertices.push(new THREE.Vertex(new THREE.Vector3(p, n, v))) }
    THREE.Geometry.call(this);
    var h = this,
        j, l = Math.PI * 2,
        k = e / 2;
    for (j = 0; j < a; j++) g(Math.sin(l * j / a) * c, Math.cos(l * j / a) * c, -k);
    for (j = 0; j < a; j++) g(Math.sin(l * j / a) * b, Math.cos(l * j / a) * b, k);
    for (j = 0; j < a; j++) h.faces.push(new THREE.Face4(j, j + a, a + (j + 1) % a, (j + 1) % a));
    if (b > 0) { g(0, 0, -k - (d || 0)); for (j = a; j < a + a / 2; j++) h.faces.push(new THREE.Face4(2 * a, (2 * j - 2 * a) % a, (2 * j - 2 * a + 1) % a, (2 * j - 2 * a + 2) % a)) }
    if (c > 0) {
        g(0, 0, k + (f || 0));
        for (j = a + a / 2; j < 2 * a; j++) h.faces.push(new THREE.Face4(2 * a + 1, (2 * j - 2 * a + 2) % a + a, (2 * j - 2 * a + 1) % a + a, (2 * j - 2 * a) % a + a))
    }
    j = 0;
    for (a = this.faces.length; j < a; j++) {
        c = [];
        b = this.faces[j];
        f = this.vertices[b.a];
        d = this.vertices[b.b];
        k = this.vertices[b.c];
        var m = this.vertices[b.d];
        c.push(new THREE.UV(0.5 + Math.atan2(f.position.x, f.position.y) / l, 0.5 + f.position.z / e));
        c.push(new THREE.UV(0.5 + Math.atan2(d.position.x, d.position.y) / l, 0.5 + d.position.z / e));
        c.push(new THREE.UV(0.5 + Math.atan2(k.position.x, k.position.y) / l, 0.5 + k.position.z /
            e));
        b instanceof THREE.Face4 && c.push(new THREE.UV(0.5 + Math.atan2(m.position.x, m.position.y) / l, 0.5 + m.position.z / e));
        this.faceVertexUvs[0].push(c)
    }
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.Cylinder.prototype = new THREE.Geometry;
THREE.Cylinder.prototype.constructor = THREE.Cylinder;
THREE.Icosahedron = function(a) {
    function c(m, p, n) { var v = Math.sqrt(m * m + p * p + n * n); return f.vertices.push(new THREE.Vertex(new THREE.Vector3(m / v, p / v, n / v))) - 1 }

    function b(m, p, n, v) { v.faces.push(new THREE.Face3(m, p, n)) }

    function e(m, p) {
        var n = f.vertices[m].position,
            v = f.vertices[p].position;
        return c((n.x + v.x) / 2, (n.y + v.y) / 2, (n.z + v.z) / 2)
    }
    var f = this,
        d = new THREE.Geometry,
        g;
    this.subdivisions = a || 0;
    THREE.Geometry.call(this);
    a = (1 + Math.sqrt(5)) / 2;
    c(-1, a, 0);
    c(1, a, 0);
    c(-1, -a, 0);
    c(1, -a, 0);
    c(0, -1, a);
    c(0, 1, a);
    c(0, -1, -a);
    c(0,
        1, -a);
    c(a, 0, -1);
    c(a, 0, 1);
    c(-a, 0, -1);
    c(-a, 0, 1);
    b(0, 11, 5, d);
    b(0, 5, 1, d);
    b(0, 1, 7, d);
    b(0, 7, 10, d);
    b(0, 10, 11, d);
    b(1, 5, 9, d);
    b(5, 11, 4, d);
    b(11, 10, 2, d);
    b(10, 7, 6, d);
    b(7, 1, 8, d);
    b(3, 9, 4, d);
    b(3, 4, 2, d);
    b(3, 2, 6, d);
    b(3, 6, 8, d);
    b(3, 8, 9, d);
    b(4, 9, 5, d);
    b(2, 4, 11, d);
    b(6, 2, 10, d);
    b(8, 6, 7, d);
    b(9, 8, 1, d);
    for (a = 0; a < this.subdivisions; a++) {
        g = new THREE.Geometry;
        for (var h in d.faces) {
            var j = e(d.faces[h].a, d.faces[h].b),
                l = e(d.faces[h].b, d.faces[h].c),
                k = e(d.faces[h].c, d.faces[h].a);
            b(d.faces[h].a, j, k, g);
            b(d.faces[h].b, l, j, g);
            b(d.faces[h].c,
                k, l, g);
            b(j, l, k, g)
        }
        d.faces = g.faces
    }
    f.faces = d.faces;
    delete d;
    delete g;
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.Icosahedron.prototype = new THREE.Geometry;
THREE.Icosahedron.prototype.constructor = THREE.Icosahedron;
THREE.Lathe = function(a, c, b) {
    THREE.Geometry.call(this);
    this.steps = c || 12;
    this.angle = b || 2 * Math.PI;
    c = this.angle / this.steps;
    b = [];
    for (var e = [], f = [], d = [], g = (new THREE.Matrix4).setRotationZ(c), h = 0; h < a.length; h++) {
        this.vertices.push(new THREE.Vertex(a[h]));
        b[h] = a[h].clone();
        e[h] = this.vertices.length - 1
    }
    for (var j = 0; j <= this.angle + 0.0010; j += c) {
        for (h = 0; h < b.length; h++)
            if (j < this.angle) {
                b[h] = g.multiplyVector3(b[h].clone());
                this.vertices.push(new THREE.Vertex(b[h]));
                f[h] = this.vertices.length - 1
            } else f = d;
        j == 0 && (d = e);
        for (h = 0; h < e.length - 1; h++) {
            this.faces.push(new THREE.Face4(f[h], f[h + 1], e[h + 1], e[h]));
            this.faceVertexUvs[0].push([new THREE.UV(1 - j / this.angle, h / a.length), new THREE.UV(1 - j / this.angle, (h + 1) / a.length), new THREE.UV(1 - (j - c) / this.angle, (h + 1) / a.length), new THREE.UV(1 - (j - c) / this.angle, h / a.length)])
        }
        e = f;
        f = []
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.Lathe.prototype = new THREE.Geometry;
THREE.Lathe.prototype.constructor = THREE.Lathe;
THREE.Plane = function(a, c, b, e) {
    THREE.Geometry.call(this);
    var f, d = a / 2,
        g = c / 2;
    b = b || 1;
    e = e || 1;
    var h = b + 1,
        j = e + 1;
    a /= b;
    var l = c / e;
    for (f = 0; f < j; f++)
        for (c = 0; c < h; c++) this.vertices.push(new THREE.Vertex(new THREE.Vector3(c * a - d, -(f * l - g), 0)));
    for (f = 0; f < e; f++)
        for (c = 0; c < b; c++) {
            this.faces.push(new THREE.Face4(c + h * f, c + h * (f + 1), c + 1 + h * (f + 1), c + 1 + h * f));
            this.faceVertexUvs[0].push([new THREE.UV(c / b, f / e), new THREE.UV(c / b, (f + 1) / e), new THREE.UV((c + 1) / b, (f + 1) / e), new THREE.UV((c + 1) / b, f / e)])
        }
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.Plane.prototype = new THREE.Geometry;
THREE.Plane.prototype.constructor = THREE.Plane;
THREE.Sphere = function(a, c, b) {
    THREE.Geometry.call(this);
    var e, f = Math.PI,
        d = Math.max(3, c || 8),
        g = Math.max(2, b || 6);
    c = [];
    for (b = 0; b < g + 1; b++) {
        e = b / g;
        var h = a * Math.cos(e * f),
            j = a * Math.sin(e * f),
            l = [],
            k = 0;
        for (e = 0; e < d; e++) {
            var m = 2 * e / d,
                p = j * Math.sin(m * f);
            m = j * Math.cos(m * f);
            (b == 0 || b == g) && e > 0 || (k = this.vertices.push(new THREE.Vertex(new THREE.Vector3(m, h, p))) - 1);
            l.push(k)
        }
        c.push(l)
    }
    var n, v, A;
    f = c.length;
    for (b = 0; b < f; b++) {
        d = c[b].length;
        if (b > 0)
            for (e = 0; e < d; e++) {
                l = e == d - 1;
                g = c[b][l ? 0 : e + 1];
                h = c[b][l ? d - 1 : e];
                j = c[b - 1][l ? d - 1 : e];
                l = c[b -
                    1][l ? 0 : e + 1];
                p = b / (f - 1);
                n = (b - 1) / (f - 1);
                v = (e + 1) / d;
                m = e / d;
                k = new THREE.UV(1 - v, p);
                p = new THREE.UV(1 - m, p);
                m = new THREE.UV(1 - m, n);
                var w = new THREE.UV(1 - v, n);
                if (b < c.length - 1) {
                    n = this.vertices[g].position.clone();
                    v = this.vertices[h].position.clone();
                    A = this.vertices[j].position.clone();
                    n.normalize();
                    v.normalize();
                    A.normalize();
                    this.faces.push(new THREE.Face3(g, h, j, [new THREE.Vector3(n.x, n.y, n.z), new THREE.Vector3(v.x, v.y, v.z), new THREE.Vector3(A.x, A.y, A.z)]));
                    this.faceVertexUvs[0].push([k, p, m])
                }
                if (b > 1) {
                    n = this.vertices[g].position.clone();
                    v = this.vertices[j].position.clone();
                    A = this.vertices[l].position.clone();
                    n.normalize();
                    v.normalize();
                    A.normalize();
                    this.faces.push(new THREE.Face3(g, j, l, [new THREE.Vector3(n.x, n.y, n.z), new THREE.Vector3(v.x, v.y, v.z), new THREE.Vector3(A.x, A.y, A.z)]));
                    this.faceVertexUvs[0].push([k, m, w])
                }
            }
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
    this.boundingSphere = { radius: a }
};
THREE.Sphere.prototype = new THREE.Geometry;
THREE.Sphere.prototype.constructor = THREE.Sphere;
THREE.Torus = function(a, c, b, e) {
    THREE.Geometry.call(this);
    this.radius = a || 100;
    this.tube = c || 40;
    this.segmentsR = b || 8;
    this.segmentsT = e || 6;
    a = [];
    for (c = 0; c <= this.segmentsR; ++c)
        for (b = 0; b <= this.segmentsT; ++b) {
            e = b / this.segmentsT * 2 * Math.PI;
            var f = c / this.segmentsR * 2 * Math.PI;
            this.vertices.push(new THREE.Vertex(new THREE.Vector3((this.radius + this.tube * Math.cos(f)) * Math.cos(e), (this.radius + this.tube * Math.cos(f)) * Math.sin(e), this.tube * Math.sin(f))));
            a.push([b / this.segmentsT, 1 - c / this.segmentsR])
        }
    for (c = 1; c <= this.segmentsR; ++c)
        for (b =
            1; b <= this.segmentsT; ++b) {
            e = (this.segmentsT + 1) * c + b;
            f = (this.segmentsT + 1) * c + b - 1;
            var d = (this.segmentsT + 1) * (c - 1) + b - 1,
                g = (this.segmentsT + 1) * (c - 1) + b;
            this.faces.push(new THREE.Face4(e, f, d, g));
            this.faceVertexUvs[0].push([new THREE.UV(a[e][0], a[e][1]), new THREE.UV(a[f][0], a[f][1]), new THREE.UV(a[d][0], a[d][1]), new THREE.UV(a[g][0], a[g][1])])
        }
    delete a;
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.Torus.prototype = new THREE.Geometry;
THREE.Torus.prototype.constructor = THREE.Torus;
THREE.TorusKnot = function(a, c, b, e, f, d, g) {
    function h(m, p, n, v, A, w) {
        p = n / v * m;
        n = Math.cos(p);
        return new THREE.Vector3(A * (2 + n) * 0.5 * Math.cos(m), A * (2 + n) * Math.sin(m) * 0.5, w * A * Math.sin(p) * 0.5)
    }
    THREE.Geometry.call(this);
    this.radius = a || 200;
    this.tube = c || 40;
    this.segmentsR = b || 64;
    this.segmentsT = e || 8;
    this.p = f || 2;
    this.q = d || 3;
    this.heightScale = g || 1;
    this.grid = Array(this.segmentsR);
    b = new THREE.Vector3;
    e = new THREE.Vector3;
    d = new THREE.Vector3;
    for (a = 0; a < this.segmentsR; ++a) {
        this.grid[a] = Array(this.segmentsT);
        for (c = 0; c < this.segmentsT; ++c) {
            var j =
                a / this.segmentsR * 2 * this.p * Math.PI;
            g = c / this.segmentsT * 2 * Math.PI;
            f = h(j, g, this.q, this.p, this.radius, this.heightScale);
            j = h(j + 0.01, g, this.q, this.p, this.radius, this.heightScale);
            b.x = j.x - f.x;
            b.y = j.y - f.y;
            b.z = j.z - f.z;
            e.x = j.x + f.x;
            e.y = j.y + f.y;
            e.z = j.z + f.z;
            d.cross(b, e);
            e.cross(d, b);
            d.normalize();
            e.normalize();
            j = -this.tube * Math.cos(g);
            g = this.tube * Math.sin(g);
            f.x += j * e.x + g * d.x;
            f.y += j * e.y + g * d.y;
            f.z += j * e.z + g * d.z;
            this.grid[a][c] = this.vertices.push(new THREE.Vertex(new THREE.Vector3(f.x, f.y, f.z))) - 1
        }
    }
    for (a = 0; a < this.segmentsR; ++a)
        for (c =
            0; c < this.segmentsT; ++c) {
            e = (a + 1) % this.segmentsR;
            d = (c + 1) % this.segmentsT;
            f = this.grid[a][c];
            b = this.grid[e][c];
            e = this.grid[e][d];
            d = this.grid[a][d];
            g = new THREE.UV(a / this.segmentsR, c / this.segmentsT);
            j = new THREE.UV((a + 1) / this.segmentsR, c / this.segmentsT);
            var l = new THREE.UV((a + 1) / this.segmentsR, (c + 1) / this.segmentsT),
                k = new THREE.UV(a / this.segmentsR, (c + 1) / this.segmentsT);
            this.faces.push(new THREE.Face4(f, b, e, d));
            this.faceVertexUvs[0].push([g, j, l, k])
        }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.TorusKnot.prototype = new THREE.Geometry;
THREE.TorusKnot.prototype.constructor = THREE.TorusKnot;
THREE.Loader = function(a) {
    this.statusDomElement = (this.showStatus = a) ? THREE.Loader.prototype.addStatusElement() : null;
    this.onLoadStart = function() {};
    this.onLoadProgress = function() {};
    this.onLoadComplete = function() {}
};
THREE.Loader.prototype = {
    addStatusElement: function() {
        var a = document.createElement("div");
        a.style.position = "absolute";
        a.style.right = "0px";
        a.style.top = "0px";
        a.style.fontSize = "0.8em";
        a.style.textAlign = "left";
        a.style.background = "rgba(0,0,0,0.25)";
        a.style.color = "#fff";
        a.style.width = "120px";
        a.style.padding = "0.5em 0.5em 0.5em 0.5em";
        a.style.zIndex = 1E3;
        a.innerHTML = "Loading ...";
        return a
    },
    updateProgress: function(a) {
        var c = "Loaded ";
        c += a.total ? (100 * a.loaded / a.total).toFixed(0) + "%" : (a.loaded / 1E3).toFixed(2) + " KB";
        this.statusDomElement.innerHTML = c
    },
    extractUrlbase: function(a) {
        a = a.split("/");
        a.pop();
        return a.join("/")
    },
    init_materials: function(a, c, b) { a.materials = []; for (var e = 0; e < c.length; ++e) a.materials[e] = [THREE.Loader.prototype.createMaterial(c[e], b)] },
    createMaterial: function(a, c) {
        function b(h) { h = Math.log(h) / Math.LN2; return Math.floor(h) == h }

        function e(h, j) {
            var l = new Image;
            l.onload = function() {
                if (!b(this.width) || !b(this.height)) {
                    var k = Math.pow(2, Math.round(Math.log(this.width) / Math.LN2)),
                        m = Math.pow(2, Math.round(Math.log(this.height) /
                            Math.LN2));
                    h.image.width = k;
                    h.image.height = m;
                    h.image.getContext("2d").drawImage(this, 0, 0, k, m)
                } else h.image = this;
                h.needsUpdate = !0
            };
            l.src = j
        }
        var f, d, g;
        f = "MeshLambertMaterial";
        d = { color: 15658734, opacity: 1, map: null, lightMap: null, wireframe: a.wireframe };
        if (a.shading)
            if (a.shading == "Phong") f = "MeshPhongMaterial";
            else a.shading == "Basic" && (f = "MeshBasicMaterial");
        if (a.blending)
            if (a.blending == "Additive") d.blending = THREE.AdditiveBlending;
            else if (a.blending == "Subtractive") d.blending = THREE.SubtractiveBlending;
        else if (a.blending ==
            "Multiply") d.blending = THREE.MultiplyBlending;
        if (a.transparent !== undefined || a.opacity < 1) d.transparent = a.transparent;
        if (a.depthTest !== undefined) d.depthTest = a.depthTest;
        if (a.vertexColors !== undefined)
            if (a.vertexColors == "face") d.vertexColors = THREE.FaceColors;
            else if (a.vertexColors) d.vertexColors = THREE.VertexColors;
        if (a.mapDiffuse && c) {
            g = document.createElement("canvas");
            d.map = new THREE.Texture(g);
            d.map.sourceFile = a.mapDiffuse;
            e(d.map, c + "/" + a.mapDiffuse)
        } else if (a.colorDiffuse) {
            g = (a.colorDiffuse[0] * 255 <<
                16) + (a.colorDiffuse[1] * 255 << 8) + a.colorDiffuse[2] * 255;
            d.color = g;
            d.opacity = a.transparency
        } else if (a.DbgColor) d.color = a.DbgColor;
        if (a.mapLightmap && c) {
            g = document.createElement("canvas");
            d.lightMap = new THREE.Texture(g);
            d.lightMap.sourceFile = a.mapLightmap;
            e(d.lightMap, c + "/" + a.mapLightmap)
        }
        return new THREE[f](d)
    }
};
THREE.JSONLoader = function(a) { THREE.Loader.call(this, a) };
THREE.JSONLoader.prototype = new THREE.Loader;
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;
THREE.JSONLoader.prototype.supr = THREE.Loader.prototype;
THREE.JSONLoader.prototype.load = function(a) {
    var c = this,
        b = a.model,
        e = a.callback,
        f = a.texture_path ? a.texture_path : this.extractUrlbase(b);
    a = new Worker(b);
    a.onmessage = function(d) {
        c.createModel(d.data, e, f);
        c.onLoadComplete()
    };
    this.onLoadStart();
    a.postMessage((new Date).getTime())
};
THREE.JSONLoader.prototype.createModel = function(a, c, b) {
    var e = new THREE.Geometry,
        f = a.scale !== undefined ? a.scale : 1;
    this.init_materials(e, a.materials, b);
    (function(d) {
        if (a.version === undefined || a.version != 2) console.error("Deprecated file format.");
        else {
            var g, h, j, l, k, m, p, n, v, A, w, u, y, o, z = a.faces;
            m = a.vertices;
            var B = a.normals,
                I = a.colors,
                K = 0;
            for (g = 0; g < a.uvs.length; g++) a.uvs[g].length && K++;
            for (g = 0; g < K; g++) {
                e.faceUvs[g] = [];
                e.faceVertexUvs[g] = []
            }
            l = 0;
            for (k = m.length; l < k;) {
                p = new THREE.Vertex;
                p.position.x = m[l++] / d;
                p.position.y = m[l++] / d;
                p.position.z = m[l++] / d;
                e.vertices.push(p)
            }
            l = 0;
            for (k = z.length; l < k;) {
                d = z[l++];
                m = d & 1;
                j = d & 2;
                g = d & 4;
                h = d & 8;
                n = d & 16;
                p = d & 32;
                A = d & 64;
                d &= 128;
                if (m) {
                    w = new THREE.Face4;
                    w.a = z[l++];
                    w.b = z[l++];
                    w.c = z[l++];
                    w.d = z[l++];
                    m = 4
                } else {
                    w = new THREE.Face3;
                    w.a = z[l++];
                    w.b = z[l++];
                    w.c = z[l++];
                    m = 3
                }
                if (j) {
                    j = z[l++];
                    w.materials = e.materials[j]
                }
                j = e.faces.length;
                if (g)
                    for (g = 0; g < K; g++) {
                        u = a.uvs[g];
                        v = z[l++];
                        o = u[v * 2];
                        v = u[v * 2 + 1];
                        e.faceUvs[g][j] = new THREE.UV(o, v)
                    }
                if (h)
                    for (g = 0; g < K; g++) {
                        u = a.uvs[g];
                        y = [];
                        for (h = 0; h < m; h++) {
                            v = z[l++];
                            o =
                                u[v * 2];
                            v = u[v * 2 + 1];
                            y[h] = new THREE.UV(o, v)
                        }
                        e.faceVertexUvs[g][j] = y
                    }
                if (n) {
                    n = z[l++] * 3;
                    h = new THREE.Vector3;
                    h.x = B[n++];
                    h.y = B[n++];
                    h.z = B[n];
                    w.normal = h
                }
                if (p)
                    for (g = 0; g < m; g++) {
                        n = z[l++] * 3;
                        h = new THREE.Vector3;
                        h.x = B[n++];
                        h.y = B[n++];
                        h.z = B[n];
                        w.vertexNormals.push(h)
                    }
                if (A) {
                    p = z[l++];
                    p = new THREE.Color(I[p]);
                    w.color = p
                }
                if (d)
                    for (g = 0; g < m; g++) {
                        p = z[l++];
                        p = new THREE.Color(I[p]);
                        w.vertexColors.push(p)
                    }
                e.faces.push(w)
            }
        }
    })(f);
    (function() {
        var d, g, h, j;
        if (a.skinWeights) {
            d = 0;
            for (g = a.skinWeights.length; d < g; d += 2) {
                h = a.skinWeights[d];
                j = a.skinWeights[d + 1];
                e.skinWeights.push(new THREE.Vector4(h, j, 0, 0))
            }
        }
        if (a.skinIndices) {
            d = 0;
            for (g = a.skinIndices.length; d < g; d += 2) {
                h = a.skinIndices[d];
                j = a.skinIndices[d + 1];
                e.skinIndices.push(new THREE.Vector4(h, j, 0, 0))
            }
        }
        e.bones = a.bones;
        e.animation = a.animation
    })();
    (function(d) {
        if (a.morphTargets !== undefined) {
            var g, h, j, l, k, m, p, n, v;
            g = 0;
            for (h = a.morphTargets.length; g < h; g++) {
                e.morphTargets[g] = {};
                e.morphTargets[g].name = a.morphTargets[g].name;
                e.morphTargets[g].vertices = [];
                n = e.morphTargets[g].vertices;
                v = a.morphTargets[g].vertices;
                j = 0;
                for (l = v.length; j < l; j += 3) {
                    k = v[j] / d;
                    m = v[j + 1] / d;
                    p = v[j + 2] / d;
                    n.push(new THREE.Vertex(new THREE.Vector3(k, m, p)))
                }
            }
        }
        if (a.morphColors !== undefined) {
            g = 0;
            for (h = a.morphColors.length; g < h; g++) {
                e.morphColors[g] = {};
                e.morphColors[g].name = a.morphColors[g].name;
                e.morphColors[g].colors = [];
                l = e.morphColors[g].colors;
                k = a.morphColors[g].colors;
                d = 0;
                for (j = k.length; d < j; d += 3) {
                    m = new THREE.Color(16755200);
                    m.setRGB(k[d], k[d + 1], k[d + 2]);
                    l.push(m)
                }
            }
        }
    })(f);
    (function() {
        if (a.edges !== undefined) {
            var d, g, h;
            for (d = 0; d < a.edges.length; d +=
                2) {
                g = a.edges[d];
                h = a.edges[d + 1];
                e.edges.push(new THREE.Edge(e.vertices[g], e.vertices[h], g, h))
            }
        }
    })();
    e.computeCentroids();
    e.computeFaceNormals();
    e.computeEdgeFaces();
    c(e)
};
THREE.BinaryLoader = function(a) { THREE.Loader.call(this, a) };
THREE.BinaryLoader.prototype = new THREE.Loader;
THREE.BinaryLoader.prototype.constructor = THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr = THREE.Loader.prototype;
THREE.BinaryLoader.prototype = {
    load: function(a) {
        var c = a.model,
            b = a.callback,
            e = a.texture_path ? a.texture_path : THREE.Loader.prototype.extractUrlbase(c),
            f = a.bin_path ? a.bin_path : THREE.Loader.prototype.extractUrlbase(c);
        a = (new Date).getTime();
        c = new Worker(c);
        var d = this.showProgress ? THREE.Loader.prototype.updateProgress : null;
        c.onmessage = function(g) { THREE.BinaryLoader.prototype.loadAjaxBuffers(g.data.buffers, g.data.materials, b, f, e, d) };
        c.onerror = function(g) {
            alert("worker.onerror: " + g.message + "\n" + g.data);
            g.preventDefault()
        };
        c.postMessage(a)
    },
    loadAjaxBuffers: function(a, c, b, e, f, d) {
        var g = new XMLHttpRequest,
            h = e + "/" + a,
            j = 0;
        g.onreadystatechange = function() {
            if (g.readyState == 4) g.status == 200 || g.status == 0 ? THREE.BinaryLoader.prototype.createBinModel(g.responseText, b, f, c) : alert("Couldn't load [" + h + "] [" + g.status + "]");
            else if (g.readyState == 3) {
                if (d) {
                    j == 0 && (j = g.getResponseHeader("Content-Length"));
                    d({ total: j, loaded: g.responseText.length })
                }
            } else g.readyState == 2 && (j = g.getResponseHeader("Content-Length"))
        };
        g.open("GET", h, !0);
        g.overrideMimeType("text/plain; charset=x-user-defined");
        g.setRequestHeader("Content-Type", "text/plain");
        g.send(null)
    },
    createBinModel: function(a, c, b, e) {
        var f = function(d) {
            function g(t, x) {
                var C = k(t, x),
                    E = k(t, x + 1),
                    H = k(t, x + 2),
                    T = k(t, x + 3),
                    V = (T << 1 & 255 | H >> 7) - 127;
                C |= (H & 127) << 16 | E << 8;
                if (C == 0 && V == -127) return 0;
                return (1 - 2 * (T >> 7)) * (1 + C * Math.pow(2, -23)) * Math.pow(2, V)
            }

            function h(t, x) {
                var C = k(t, x),
                    E = k(t, x + 1),
                    H = k(t, x + 2);
                return (k(t, x + 3) << 24) + (H << 16) + (E << 8) + C
            }

            function j(t, x) { var C = k(t, x); return (k(t, x + 1) << 8) + C }

            function l(t, x) { var C = k(t, x); return C > 127 ? C - 256 : C }

            function k(t,
                x) { return t.charCodeAt(x) & 255 }

            function m(t) {
                var x, C, E;
                x = h(a, t);
                C = h(a, t + I);
                E = h(a, t + K);
                t = j(a, t + J);
                THREE.BinaryLoader.prototype.f3(u, x, C, E, t)
            }

            function p(t) {
                var x, C, E, H, T, V;
                x = h(a, t);
                C = h(a, t + I);
                E = h(a, t + K);
                H = j(a, t + J);
                T = h(a, t + G);
                V = h(a, t + D);
                t = h(a, t + L);
                THREE.BinaryLoader.prototype.f3n(u, z, x, C, E, H, T, V, t)
            }

            function n(t) {
                var x, C, E, H;
                x = h(a, t);
                C = h(a, t + R);
                E = h(a, t + O);
                H = h(a, t + S);
                t = j(a, t + P);
                THREE.BinaryLoader.prototype.f4(u, x, C, E, H, t)
            }

            function v(t) {
                var x, C, E, H, T, V, ca, da;
                x = h(a, t);
                C = h(a, t + R);
                E = h(a, t + O);
                H = h(a, t + S);
                T = j(a,
                    t + P);
                V = h(a, t + F);
                ca = h(a, t + M);
                da = h(a, t + Q);
                t = h(a, t + U);
                THREE.BinaryLoader.prototype.f4n(u, z, x, C, E, H, T, V, ca, da, t)
            }

            function A(t) {
                var x, C;
                x = h(a, t);
                C = h(a, t + N);
                t = h(a, t + W);
                THREE.BinaryLoader.prototype.uv3(u.faceVertexUvs[0], B[x * 2], B[x * 2 + 1], B[C * 2], B[C * 2 + 1], B[t * 2], B[t * 2 + 1])
            }

            function w(t) {
                var x, C, E;
                x = h(a, t);
                C = h(a, t + ea);
                E = h(a, t + fa);
                t = h(a, t + ga);
                THREE.BinaryLoader.prototype.uv4(u.faceVertexUvs[0], B[x * 2], B[x * 2 + 1], B[C * 2], B[C * 2 + 1], B[E * 2], B[E * 2 + 1], B[t * 2], B[t * 2 + 1])
            }
            var u = this,
                y = 0,
                o, z = [],
                B = [],
                I, K, J, G, D, L, R, O, S, P, F, M, Q,
                U, N, W, ea, fa, ga, Y, Z, $, aa, ba, X;
            THREE.Geometry.call(this);
            THREE.Loader.prototype.init_materials(u, e, d);
            o = {
                signature: a.substr(y, 8),
                header_bytes: k(a, y + 8),
                vertex_coordinate_bytes: k(a, y + 9),
                normal_coordinate_bytes: k(a, y + 10),
                uv_coordinate_bytes: k(a, y + 11),
                vertex_index_bytes: k(a, y + 12),
                normal_index_bytes: k(a, y + 13),
                uv_index_bytes: k(a, y + 14),
                material_index_bytes: k(a, y + 15),
                nvertices: h(a, y + 16),
                nnormals: h(a, y + 16 + 4),
                nuvs: h(a, y + 16 + 8),
                ntri_flat: h(a, y + 16 + 12),
                ntri_smooth: h(a, y + 16 + 16),
                ntri_flat_uv: h(a, y + 16 + 20),
                ntri_smooth_uv: h(a,
                    y + 16 + 24),
                nquad_flat: h(a, y + 16 + 28),
                nquad_smooth: h(a, y + 16 + 32),
                nquad_flat_uv: h(a, y + 16 + 36),
                nquad_smooth_uv: h(a, y + 16 + 40)
            };
            y += o.header_bytes;
            I = o.vertex_index_bytes;
            K = o.vertex_index_bytes * 2;
            J = o.vertex_index_bytes * 3;
            G = o.vertex_index_bytes * 3 + o.material_index_bytes;
            D = o.vertex_index_bytes * 3 + o.material_index_bytes + o.normal_index_bytes;
            L = o.vertex_index_bytes * 3 + o.material_index_bytes + o.normal_index_bytes * 2;
            R = o.vertex_index_bytes;
            O = o.vertex_index_bytes * 2;
            S = o.vertex_index_bytes * 3;
            P = o.vertex_index_bytes * 4;
            F = o.vertex_index_bytes *
                4 + o.material_index_bytes;
            M = o.vertex_index_bytes * 4 + o.material_index_bytes + o.normal_index_bytes;
            Q = o.vertex_index_bytes * 4 + o.material_index_bytes + o.normal_index_bytes * 2;
            U = o.vertex_index_bytes * 4 + o.material_index_bytes + o.normal_index_bytes * 3;
            N = o.uv_index_bytes;
            W = o.uv_index_bytes * 2;
            ea = o.uv_index_bytes;
            fa = o.uv_index_bytes * 2;
            ga = o.uv_index_bytes * 3;
            d = o.vertex_index_bytes * 3 + o.material_index_bytes;
            X = o.vertex_index_bytes * 4 + o.material_index_bytes;
            Y = o.ntri_flat * d;
            Z = o.ntri_smooth * (d + o.normal_index_bytes * 3);
            $ = o.ntri_flat_uv *
                (d + o.uv_index_bytes * 3);
            aa = o.ntri_smooth_uv * (d + o.normal_index_bytes * 3 + o.uv_index_bytes * 3);
            ba = o.nquad_flat * X;
            d = o.nquad_smooth * (X + o.normal_index_bytes * 4);
            X = o.nquad_flat_uv * (X + o.uv_index_bytes * 4);
            y += function(t) {
                for (var x, C, E, H = o.vertex_coordinate_bytes * 3, T = t + o.nvertices * H; t < T; t += H) {
                    x = g(a, t);
                    C = g(a, t + o.vertex_coordinate_bytes);
                    E = g(a, t + o.vertex_coordinate_bytes * 2);
                    THREE.BinaryLoader.prototype.v(u, x, C, E)
                }
                return o.nvertices * H
            }(y);
            y += function(t) {
                for (var x, C, E, H = o.normal_coordinate_bytes * 3, T = t + o.nnormals * H; t <
                    T; t += H) {
                    x = l(a, t);
                    C = l(a, t + o.normal_coordinate_bytes);
                    E = l(a, t + o.normal_coordinate_bytes * 2);
                    z.push(x / 127, C / 127, E / 127)
                }
                return o.nnormals * H
            }(y);
            y += function(t) {
                for (var x, C, E = o.uv_coordinate_bytes * 2, H = t + o.nuvs * E; t < H; t += E) {
                    x = g(a, t);
                    C = g(a, t + o.uv_coordinate_bytes);
                    B.push(x, C)
                }
                return o.nuvs * E
            }(y);
            Y = y + Y;
            Z = Y + Z;
            $ = Z + $;
            aa = $ + aa;
            ba = aa + ba;
            d = ba + d;
            X = d + X;
            (function(t) {
                var x, C = o.vertex_index_bytes * 3 + o.material_index_bytes,
                    E = C + o.uv_index_bytes * 3,
                    H = t + o.ntri_flat_uv * E;
                for (x = t; x < H; x += E) {
                    m(x);
                    A(x + C)
                }
                return H - t
            })(Z);
            (function(t) {
                var x,
                    C = o.vertex_index_bytes * 3 + o.material_index_bytes + o.normal_index_bytes * 3,
                    E = C + o.uv_index_bytes * 3,
                    H = t + o.ntri_smooth_uv * E;
                for (x = t; x < H; x += E) {
                    p(x);
                    A(x + C)
                }
                return H - t
            })($);
            (function(t) {
                var x, C = o.vertex_index_bytes * 4 + o.material_index_bytes,
                    E = C + o.uv_index_bytes * 4,
                    H = t + o.nquad_flat_uv * E;
                for (x = t; x < H; x += E) {
                    n(x);
                    w(x + C)
                }
                return H - t
            })(d);
            (function(t) {
                var x, C = o.vertex_index_bytes * 4 + o.material_index_bytes + o.normal_index_bytes * 4,
                    E = C + o.uv_index_bytes * 4,
                    H = t + o.nquad_smooth_uv * E;
                for (x = t; x < H; x += E) {
                    v(x);
                    w(x + C)
                }
                return H - t
            })(X);
            (function(t) {
                var x, C = o.vertex_index_bytes * 3 + o.material_index_bytes,
                    E = t + o.ntri_flat * C;
                for (x = t; x < E; x += C) m(x);
                return E - t
            })(y);
            (function(t) {
                var x, C = o.vertex_index_bytes * 3 + o.material_index_bytes + o.normal_index_bytes * 3,
                    E = t + o.ntri_smooth * C;
                for (x = t; x < E; x += C) p(x);
                return E - t
            })(Y);
            (function(t) {
                var x, C = o.vertex_index_bytes * 4 + o.material_index_bytes,
                    E = t + o.nquad_flat * C;
                for (x = t; x < E; x += C) n(x);
                return E - t
            })(aa);
            (function(t) {
                var x, C = o.vertex_index_bytes * 4 + o.material_index_bytes + o.normal_index_bytes * 4,
                    E = t + o.nquad_smooth *
                    C;
                for (x = t; x < E; x += C) v(x);
                return E - t
            })(ba);
            this.computeCentroids();
            this.computeFaceNormals()
        };
        f.prototype = new THREE.Geometry;
        f.prototype.constructor = f;
        c(new f(b))
    },
    v: function(a, c, b, e) { a.vertices.push(new THREE.Vertex(new THREE.Vector3(c, b, e))) },
    f3: function(a, c, b, e, f) { a.faces.push(new THREE.Face3(c, b, e, null, null, a.materials[f])) },
    f4: function(a, c, b, e, f, d) { a.faces.push(new THREE.Face4(c, b, e, f, null, null, a.materials[d])) },
    f3n: function(a, c, b, e, f, d, g, h, j) {
        d = a.materials[d];
        var l = c[h * 3],
            k = c[h * 3 + 1];
        h = c[h * 3 + 2];
        var m = c[j * 3],
            p = c[j * 3 + 1];
        j = c[j * 3 + 2];
        a.faces.push(new THREE.Face3(b, e, f, [new THREE.Vector3(c[g * 3], c[g * 3 + 1], c[g * 3 + 2]), new THREE.Vector3(l, k, h), new THREE.Vector3(m, p, j)], null, d))
    },
    f4n: function(a, c, b, e, f, d, g, h, j, l, k) {
        g = a.materials[g];
        var m = c[j * 3],
            p = c[j * 3 + 1];
        j = c[j * 3 + 2];
        var n = c[l * 3],
            v = c[l * 3 + 1];
        l = c[l * 3 + 2];
        var A = c[k * 3],
            w = c[k * 3 + 1];
        k = c[k * 3 + 2];
        a.faces.push(new THREE.Face4(b, e, f, d, [new THREE.Vector3(c[h * 3], c[h * 3 + 1], c[h * 3 + 2]), new THREE.Vector3(m, p, j), new THREE.Vector3(n, v, l), new THREE.Vector3(A, w, k)], null, g))
    },
    uv3: function(a, c, b, e, f, d, g) {
        var h = [];
        h.push(new THREE.UV(c, b));
        h.push(new THREE.UV(e, f));
        h.push(new THREE.UV(d, g));
        a.push(h)
    },
    uv4: function(a, c, b, e, f, d, g, h, j) {
        var l = [];
        l.push(new THREE.UV(c, b));
        l.push(new THREE.UV(e, f));
        l.push(new THREE.UV(d, g));
        l.push(new THREE.UV(h, j));
        a.push(l)
    }
};
THREE.SceneLoader = function() {
    this.onLoadStart = function() {};
    this.onLoadProgress = function() {};
    this.onLoadComplete = function() {};
    this.callbackSync = function() {};
    this.callbackProgress = function() {}
};
THREE.SceneLoader.prototype = {
    load: function(a, c) {
        var b = this,
            e = new Worker(a);
        e.postMessage(0);
        var f = THREE.Loader.prototype.extractUrlbase(a);
        e.onmessage = function(d) {
            function g(N, W) { return W == "relativeToHTML" ? N : f + "/" + N }

            function h() {
                for (n in D.objects)
                    if (!F.objects[n]) {
                        y = D.objects[n];
                        if (y.geometry !== undefined) {
                            if (I = F.geometries[y.geometry]) {
                                G = [];
                                for (U = 0; U < y.materials.length; U++) G[U] = F.materials[y.materials[U]];
                                o = y.position;
                                r = y.rotation;
                                q = y.quaternion;
                                s = y.scale;
                                q = 0;
                                G.length == 0 && (G[0] = new THREE.MeshFaceMaterial);
                                G.length > 1 && (G = [new THREE.MeshFaceMaterial]);
                                object = new THREE.Mesh(I, G);
                                object.name = n;
                                object.position.set(o[0], o[1], o[2]);
                                if (q) {
                                    object.quaternion.set(q[0], q[1], q[2], q[3]);
                                    object.useQuaternion = !0
                                } else object.rotation.set(r[0], r[1], r[2]);
                                object.scale.set(s[0], s[1], s[2]);
                                object.visible = y.visible;
                                F.scene.addObject(object);
                                F.objects[n] = object;
                                if (y.meshCollider) {
                                    var N = THREE.CollisionUtils.MeshColliderWBox(object);
                                    F.scene.collisions.colliders.push(N)
                                }
                                if (y.castsShadow) {
                                    N = new THREE.ShadowVolume(I);
                                    F.scene.addChild(N);
                                    N.position = object.position;
                                    N.rotation = object.rotation;
                                    N.scale = object.scale
                                }
                                y.trigger && y.trigger.toLowerCase() != "none" && (F.triggers[object.name] = { type: y.trigger, object: y })
                            }
                        } else {
                            o = y.position;
                            r = y.rotation;
                            q = y.quaternion;
                            s = y.scale;
                            q = 0;
                            object = new THREE.Object3D;
                            object.name = n;
                            object.position.set(o[0], o[1], o[2]);
                            if (q) {
                                object.quaternion.set(q[0], q[1], q[2], q[3]);
                                object.useQuaternion = !0
                            } else object.rotation.set(r[0], r[1], r[2]);
                            object.scale.set(s[0], s[1], s[2]);
                            object.visible = y.visible !== undefined ? y.visible :
                                !1;
                            F.scene.addObject(object);
                            F.objects[n] = object;
                            F.empties[n] = object
                        }
                    }
            }

            function j(N) {
                return function(W) {
                    F.geometries[N] = W;
                    h();
                    R -= 1;
                    b.onLoadComplete();
                    k()
                }
            }

            function l(N) { return function(W) { F.geometries[N] = W } }

            function k() {
                b.callbackProgress({ totalModels: S, totalTextures: P, loadedModels: S - R, loadedTextures: P - O }, F);
                b.onLoadProgress();
                R == 0 && O == 0 && c(F)
            }
            var m, p, n, v, A, w, u, y, o, z, B, I, K, J, G, D, L, R, O, S, P, F;
            D = d.data;
            d = new THREE.BinaryLoader;
            L = new THREE.JSONLoader;
            O = R = 0;
            F = {
                scene: new THREE.Scene,
                geometries: {},
                materials: {},
                textures: {},
                objects: {},
                cameras: {},
                lights: {},
                fogs: {},
                triggers: {},
                empties: {}
            };
            var M = !1;
            for (n in D.objects) { y = D.objects[n]; if (y.meshCollider) { M = !0; break } }
            if (M) F.scene.collisions = new THREE.CollisionSystem;
            if (D.transform) {
                M = D.transform.position;
                z = D.transform.rotation;
                var Q = D.transform.scale;
                M && F.scene.position.set(M[0], M[1], M[2]);
                z && F.scene.rotation.set(z[0], z[1], z[2]);
                Q && F.scene.scale.set(Q[0], Q[1], Q[2]);
                (M || z || Q) && F.scene.updateMatrix()
            }
            M = function() {
                O -= 1;
                k();
                b.onLoadComplete()
            };
            for (A in D.cameras) {
                z =
                    D.cameras[A];
                if (z.type == "perspective") K = new THREE.Camera(z.fov, z.aspect, z.near, z.far);
                else if (z.type == "ortho") {
                    K = new THREE.Camera;
                    K.projectionMatrix = THREE.Matrix4.makeOrtho(z.left, z.right, z.top, z.bottom, z.near, z.far)
                }
                o = z.position;
                z = z.target;
                K.position.set(o[0], o[1], o[2]);
                K.target.position.set(z[0], z[1], z[2]);
                F.cameras[A] = K
            }
            for (v in D.lights) {
                A = D.lights[v];
                K = A.color !== undefined ? A.color : 16777215;
                z = A.intensity !== undefined ? A.intensity : 1;
                if (A.type == "directional") {
                    o = A.direction;
                    light = new THREE.DirectionalLight(K,
                        z);
                    light.position.set(o[0], o[1], o[2]);
                    light.position.normalize()
                } else if (A.type == "point") {
                    o = A.position;
                    light = new THREE.PointLight(K, z);
                    light.position.set(o[0], o[1], o[2])
                }
                F.scene.addLight(light);
                F.lights[v] = light
            }
            for (w in D.fogs) {
                v = D.fogs[w];
                if (v.type == "linear") J = new THREE.Fog(0, v.near, v.far);
                else v.type == "exp2" && (J = new THREE.FogExp2(0, v.density));
                z = v.color;
                J.color.setRGB(z[0], z[1], z[2]);
                F.fogs[w] = J
            }
            if (F.cameras && D.defaults.camera) F.currentCamera = F.cameras[D.defaults.camera];
            if (F.fogs && D.defaults.fog) F.scene.fog =
                F.fogs[D.defaults.fog];
            z = D.defaults.bgcolor;
            F.bgColor = new THREE.Color;
            F.bgColor.setRGB(z[0], z[1], z[2]);
            F.bgColorAlpha = D.defaults.bgalpha;
            for (m in D.geometries) {
                w = D.geometries[m];
                if (w.type == "bin_mesh" || w.type == "ascii_mesh") {
                    R += 1;
                    b.onLoadStart()
                }
            }
            S = R;
            for (m in D.geometries) {
                w = D.geometries[m];
                if (w.type == "cube") {
                    I = new THREE.Cube(w.width, w.height, w.depth, w.segmentsWidth, w.segmentsHeight, w.segmentsDepth, null, w.flipped, w.sides);
                    F.geometries[m] = I
                } else if (w.type == "plane") {
                    I = new THREE.Plane(w.width, w.height,
                        w.segmentsWidth, w.segmentsHeight);
                    F.geometries[m] = I
                } else if (w.type == "sphere") {
                    I = new THREE.Sphere(w.radius, w.segmentsWidth, w.segmentsHeight);
                    F.geometries[m] = I
                } else if (w.type == "cylinder") {
                    I = new THREE.Cylinder(w.numSegs, w.topRad, w.botRad, w.height, w.topOffset, w.botOffset);
                    F.geometries[m] = I
                } else if (w.type == "torus") {
                    I = new THREE.Torus(w.radius, w.tube, w.segmentsR, w.segmentsT);
                    F.geometries[m] = I
                } else if (w.type == "icosahedron") {
                    I = new THREE.Icosahedron(w.subdivisions);
                    F.geometries[m] = I
                } else if (w.type == "bin_mesh") d.load({
                    model: g(w.url,
                        D.urlBaseType),
                    callback: j(m)
                });
                else if (w.type == "ascii_mesh") L.load({ model: g(w.url, D.urlBaseType), callback: j(m) });
                else if (w.type == "embedded_mesh")(w = D.embeds[w.id]) && L.createModel(w, l(m), "")
            }
            for (u in D.textures) {
                m = D.textures[u];
                if (m.url instanceof Array) { O += m.url.length; for (d = 0; d < m.url.length; d++) b.onLoadStart() } else {
                    O += 1;
                    b.onLoadStart()
                }
            }
            P = O;
            for (u in D.textures) {
                m = D.textures[u];
                if (m.mapping != undefined && THREE[m.mapping] != undefined) m.mapping = new THREE[m.mapping];
                if (m.url instanceof Array) {
                    d = [];
                    for (var U =
                            0; U < m.url.length; U++) d[U] = g(m.url[U], D.urlBaseType);
                    d = THREE.ImageUtils.loadTextureCube(d, m.mapping, M)
                } else { d = THREE.ImageUtils.loadTexture(g(m.url, D.urlBaseType), m.mapping, M); if (THREE[m.minFilter] != undefined) d.minFilter = THREE[m.minFilter]; if (THREE[m.magFilter] != undefined) d.magFilter = THREE[m.magFilter] }
                F.textures[u] = d
            }
            for (p in D.materials) {
                u = D.materials[p];
                for (B in u.parameters)
                    if (B == "envMap" || B == "map" || B == "lightMap") u.parameters[B] = F.textures[u.parameters[B]];
                    else if (B == "shading") u.parameters[B] = u.parameters[B] ==
                    "flat" ? THREE.FlatShading : THREE.SmoothShading;
                else if (B == "blending") u.parameters[B] = THREE[u.parameters[B]] ? THREE[u.parameters[B]] : THREE.NormalBlending;
                else if (B == "combine") u.parameters[B] = u.parameters[B] == "MixOperation" ? THREE.MixOperation : THREE.MultiplyOperation;
                else if (B == "vertexColors")
                    if (u.parameters[B] == "face") u.parameters[B] = THREE.FaceColors;
                    else if (u.parameters[B]) u.parameters[B] = THREE.VertexColors;
                if (u.parameters.opacity !== undefined && u.parameters.opacity < 1) u.parameters.transparent = !0;
                u = new THREE[u.type](u.parameters);
                F.materials[p] = u
            }
            h();
            b.callbackSync(F)
        }
    }
};
THREE.MarchingCubes = function(a, c) {
    THREE.Object3D.call(this);
    this.materials = c instanceof Array ? c : [c];
    this.init = function(b) {
        this.isolation = 80;
        this.size = b;
        this.size2 = this.size * this.size;
        this.size3 = this.size2 * this.size;
        this.halfsize = this.size / 2;
        this.delta = 2 / this.size;
        this.yd = this.size;
        this.zd = this.size2;
        this.field = new Float32Array(this.size3);
        this.normal_cache = new Float32Array(this.size3 * 3);
        this.vlist = new Float32Array(36);
        this.nlist = new Float32Array(36);
        this.firstDraw = !0;
        this.maxCount = 4096;
        this.count =
            0;
        this.hasPos = !1;
        this.hasNormal = !1;
        this.positionArray = new Float32Array(this.maxCount * 3);
        this.normalArray = new Float32Array(this.maxCount * 3)
    };
    this.lerp = function(b, e, f) { return b + (e - b) * f };
    this.VIntX = function(b, e, f, d, g, h, j, l, k, m) {
        g = (g - k) / (m - k);
        k = this.normal_cache;
        e[d] = h + g * this.delta;
        e[d + 1] = j;
        e[d + 2] = l;
        f[d] = this.lerp(k[b], k[b + 3], g);
        f[d + 1] = this.lerp(k[b + 1], k[b + 4], g);
        f[d + 2] = this.lerp(k[b + 2], k[b + 5], g)
    };
    this.VIntY = function(b, e, f, d, g, h, j, l, k, m) {
        g = (g - k) / (m - k);
        k = this.normal_cache;
        e[d] = h;
        e[d + 1] = j + g * this.delta;
        e[d +
            2] = l;
        e = b + this.yd * 3;
        f[d] = this.lerp(k[b], k[e], g);
        f[d + 1] = this.lerp(k[b + 1], k[e + 1], g);
        f[d + 2] = this.lerp(k[b + 2], k[e + 2], g)
    };
    this.VIntZ = function(b, e, f, d, g, h, j, l, k, m) {
        g = (g - k) / (m - k);
        k = this.normal_cache;
        e[d] = h;
        e[d + 1] = j;
        e[d + 2] = l + g * this.delta;
        e = b + this.zd * 3;
        f[d] = this.lerp(k[b], k[e], g);
        f[d + 1] = this.lerp(k[b + 1], k[e + 1], g);
        f[d + 2] = this.lerp(k[b + 2], k[e + 2], g)
    };
    this.compNorm = function(b) {
        var e = b * 3;
        if (this.normal_cache[e] == 0) {
            this.normal_cache[e] = this.field[b - 1] - this.field[b + 1];
            this.normal_cache[e + 1] = this.field[b - this.yd] -
                this.field[b + this.yd];
            this.normal_cache[e + 2] = this.field[b - this.zd] - this.field[b + this.zd]
        }
    };
    this.polygonize = function(b, e, f, d, g, h) {
        var j = d + 1,
            l = d + this.yd,
            k = d + this.zd,
            m = j + this.yd,
            p = j + this.zd,
            n = d + this.yd + this.zd,
            v = j + this.yd + this.zd,
            A = 0,
            w = this.field[d],
            u = this.field[j],
            y = this.field[l],
            o = this.field[m],
            z = this.field[k],
            B = this.field[p],
            I = this.field[n],
            K = this.field[v];
        w < g && (A |= 1);
        u < g && (A |= 2);
        y < g && (A |= 8);
        o < g && (A |= 4);
        z < g && (A |= 16);
        B < g && (A |= 32);
        I < g && (A |= 128);
        K < g && (A |= 64);
        var J = THREE.edgeTable[A];
        if (J == 0) return 0;
        var G = this.delta,
            D = b + G,
            L = e + G;
        G = f + G;
        if (J & 1) {
            this.compNorm(d);
            this.compNorm(j);
            this.VIntX(d * 3, this.vlist, this.nlist, 0, g, b, e, f, w, u)
        }
        if (J & 2) {
            this.compNorm(j);
            this.compNorm(m);
            this.VIntY(j * 3, this.vlist, this.nlist, 3, g, D, e, f, u, o)
        }
        if (J & 4) {
            this.compNorm(l);
            this.compNorm(m);
            this.VIntX(l * 3, this.vlist, this.nlist, 6, g, b, L, f, y, o)
        }
        if (J & 8) {
            this.compNorm(d);
            this.compNorm(l);
            this.VIntY(d * 3, this.vlist, this.nlist, 9, g, b, e, f, w, y)
        }
        if (J & 16) {
            this.compNorm(k);
            this.compNorm(p);
            this.VIntX(k * 3, this.vlist, this.nlist, 12, g, b, e, G,
                z, B)
        }
        if (J & 32) {
            this.compNorm(p);
            this.compNorm(v);
            this.VIntY(p * 3, this.vlist, this.nlist, 15, g, D, e, G, B, K)
        }
        if (J & 64) {
            this.compNorm(n);
            this.compNorm(v);
            this.VIntX(n * 3, this.vlist, this.nlist, 18, g, b, L, G, I, K)
        }
        if (J & 128) {
            this.compNorm(k);
            this.compNorm(n);
            this.VIntY(k * 3, this.vlist, this.nlist, 21, g, b, e, G, z, I)
        }
        if (J & 256) {
            this.compNorm(d);
            this.compNorm(k);
            this.VIntZ(d * 3, this.vlist, this.nlist, 24, g, b, e, f, w, z)
        }
        if (J & 512) {
            this.compNorm(j);
            this.compNorm(p);
            this.VIntZ(j * 3, this.vlist, this.nlist, 27, g, D, e, f, u, B)
        }
        if (J & 1024) {
            this.compNorm(m);
            this.compNorm(v);
            this.VIntZ(m * 3, this.vlist, this.nlist, 30, g, D, L, f, o, K)
        }
        if (J & 2048) {
            this.compNorm(l);
            this.compNorm(n);
            this.VIntZ(l * 3, this.vlist, this.nlist, 33, g, b, L, f, y, I)
        }
        A <<= 4;
        for (g = d = 0; THREE.triTable[A + g] != -1;) {
            b = A + g;
            e = b + 1;
            f = b + 2;
            this.posnormtriv(this.vlist, this.nlist, 3 * THREE.triTable[b], 3 * THREE.triTable[e], 3 * THREE.triTable[f], h);
            g += 3;
            d++
        }
        return d
    };
    this.posnormtriv = function(b, e, f, d, g, h) {
        var j = this.count * 3;
        this.positionArray[j] = b[f];
        this.positionArray[j + 1] = b[f + 1];
        this.positionArray[j + 2] = b[f + 2];
        this.positionArray[j +
            3] = b[d];
        this.positionArray[j + 4] = b[d + 1];
        this.positionArray[j + 5] = b[d + 2];
        this.positionArray[j + 6] = b[g];
        this.positionArray[j + 7] = b[g + 1];
        this.positionArray[j + 8] = b[g + 2];
        this.normalArray[j] = e[f];
        this.normalArray[j + 1] = e[f + 1];
        this.normalArray[j + 2] = e[f + 2];
        this.normalArray[j + 3] = e[d];
        this.normalArray[j + 4] = e[d + 1];
        this.normalArray[j + 5] = e[d + 2];
        this.normalArray[j + 6] = e[g];
        this.normalArray[j + 7] = e[g + 1];
        this.normalArray[j + 8] = e[g + 2];
        this.hasPos = !0;
        this.hasNormal = !0;
        this.count += 3;
        this.count >= this.maxCount - 3 && h(this)
    };
    this.begin =
        function() {
            this.count = 0;
            this.hasPos = !1;
            this.hasNormal = !1
        };
    this.end = function(b) {
        if (this.count != 0) {
            for (var e = this.count * 3; e < this.positionArray.length; e++) this.positionArray[e] = 0;
            b(this)
        }
    };
    this.addBall = function(b, e, f, d, g) {
        var h = this.size * Math.sqrt(d / g),
            j = f * this.size,
            l = e * this.size,
            k = b * this.size,
            m = Math.floor(j - h);
        m < 1 && (m = 1);
        j = Math.floor(j + h);
        j > this.size - 1 && (j = this.size - 1);
        var p = Math.floor(l - h);
        p < 1 && (p = 1);
        l = Math.floor(l + h);
        l > this.size - 1 && (l = this.size - 1);
        var n = Math.floor(k - h);
        n < 1 && (n = 1);
        h = Math.floor(k + h);
        h > this.size - 1 && (h = this.size - 1);
        for (var v, A, w, u, y, o; m < j; m++) {
            k = this.size2 * m;
            A = m / this.size - f;
            y = A * A;
            for (A = p; A < l; A++) {
                w = k + this.size * A;
                v = A / this.size - e;
                o = v * v;
                for (v = n; v < h; v++) {
                    u = v / this.size - b;
                    u = d / (1.0E-6 + u * u + o + y) - g;
                    u > 0 && (this.field[w + v] += u)
                }
            }
        }
    };
    this.addPlaneX = function(b, e) {
        var f, d, g, h, j, l = this.size,
            k = this.yd,
            m = this.zd,
            p = this.field,
            n = l * Math.sqrt(b / e);
        n > l && (n = l);
        for (f = 0; f < n; f++) {
            d = f / l;
            d *= d;
            h = b / (1.0E-4 + d) - e;
            if (h > 0)
                for (d = 0; d < l; d++) { j = f + d * k; for (g = 0; g < l; g++) p[m * g + j] += h }
        }
    };
    this.addPlaneY = function(b, e) {
        var f, d,
            g, h, j, l, k = this.size,
            m = this.yd,
            p = this.zd,
            n = this.field,
            v = k * Math.sqrt(b / e);
        v > k && (v = k);
        for (d = 0; d < v; d++) {
            f = d / k;
            f *= f;
            h = b / (1.0E-4 + f) - e;
            if (h > 0) { j = d * m; for (f = 0; f < k; f++) { l = j + f; for (g = 0; g < k; g++) n[p * g + l] += h } }
        }
    };
    this.addPlaneZ = function(b, e) {
        var f, d, g, h, j, l;
        size = this.size;
        yd = this.yd;
        zd = this.zd;
        field = this.field;
        dist = size * Math.sqrt(b / e);
        dist > size && (dist = size);
        for (g = 0; g < dist; g++) {
            f = g / size;
            f *= f;
            h = b / (1.0E-4 + f) - e;
            if (h > 0) { j = zd * g; for (d = 0; d < size; d++) { l = j + d * yd; for (f = 0; f < size; f++) field[l + f] += h } }
        }
    };
    this.reset = function() {
        var b;
        for (b = 0; b < this.size3; b++) {
            this.normal_cache[b * 3] = 0;
            this.field[b] = 0
        }
    };
    this.render = function(b) {
        this.begin();
        var e, f, d, g, h, j, l, k, m, p = this.size - 2;
        for (g = 1; g < p; g++) {
            m = this.size2 * g;
            l = (g - this.halfsize) / this.halfsize;
            for (d = 1; d < p; d++) {
                k = m + this.size * d;
                j = (d - this.halfsize) / this.halfsize;
                for (f = 1; f < p; f++) {
                    h = (f - this.halfsize) / this.halfsize;
                    e = k + f;
                    this.polygonize(h, j, l, e, this.isolation, b)
                }
            }
        }
        this.end(b)
    };
    this.generateGeometry = function() {
        var b = 0,
            e = new THREE.Geometry,
            f = [];
        this.render(function(d) {
            var g, h, j, l, k, m, p, n;
            for (g =
                0; g < d.count; g++) {
                p = g * 3;
                k = p + 1;
                n = p + 2;
                h = d.positionArray[p];
                j = d.positionArray[k];
                l = d.positionArray[n];
                m = new THREE.Vector3(h, j, l);
                h = d.normalArray[p];
                j = d.normalArray[k];
                l = d.normalArray[n];
                p = new THREE.Vector3(h, j, l);
                p.normalize();
                k = new THREE.Vertex(m);
                e.vertices.push(k);
                f.push(p)
            }
            nfaces = d.count / 3;
            for (g = 0; g < nfaces; g++) {
                p = (b + g) * 3;
                k = p + 1;
                n = p + 2;
                m = f[p];
                h = f[k];
                j = f[n];
                p = new THREE.Face3(p, k, n, [m, h, j]);
                e.faces.push(p)
            }
            b += nfaces;
            d.count = 0
        });
        return e
    };
    this.init(a)
};
THREE.MarchingCubes.prototype = new THREE.Object3D;
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;
THREE.edgeTable = new Int32Array([0, 265, 515, 778, 1030, 1295, 1541, 1804, 2060, 2309, 2575, 2822, 3082, 3331, 3593, 3840, 400, 153, 915, 666, 1430, 1183, 1941, 1692, 2460, 2197, 2975, 2710, 3482, 3219, 3993, 3728, 560, 825, 51, 314, 1590, 1855, 1077, 1340, 2620, 2869, 2111, 2358, 3642, 3891, 3129, 3376, 928, 681, 419, 170, 1958, 1711, 1445, 1196, 2988, 2725, 2479, 2214, 4010, 3747, 3497, 3232, 1120, 1385, 1635, 1898, 102, 367, 613, 876, 3180, 3429, 3695, 3942, 2154, 2403, 2665, 2912, 1520, 1273, 2035, 1786, 502, 255, 1013, 764, 3580, 3317, 4095, 3830, 2554, 2291, 3065, 2800, 1616, 1881, 1107,
    1370, 598, 863, 85, 348, 3676, 3925, 3167, 3414, 2650, 2899, 2137, 2384, 1984, 1737, 1475, 1226, 966, 719, 453, 204, 4044, 3781, 3535, 3270, 3018, 2755, 2505, 2240, 2240, 2505, 2755, 3018, 3270, 3535, 3781, 4044, 204, 453, 719, 966, 1226, 1475, 1737, 1984, 2384, 2137, 2899, 2650, 3414, 3167, 3925, 3676, 348, 85, 863, 598, 1370, 1107, 1881, 1616, 2800, 3065, 2291, 2554, 3830, 4095, 3317, 3580, 764, 1013, 255, 502, 1786, 2035, 1273, 1520, 2912, 2665, 2403, 2154, 3942, 3695, 3429, 3180, 876, 613, 367, 102, 1898, 1635, 1385, 1120, 3232, 3497, 3747, 4010, 2214, 2479, 2725, 2988, 1196, 1445, 1711, 1958, 170,
    419, 681, 928, 3376, 3129, 3891, 3642, 2358, 2111, 2869, 2620, 1340, 1077, 1855, 1590, 314, 51, 825, 560, 3728, 3993, 3219, 3482, 2710, 2975, 2197, 2460, 1692, 1941, 1183, 1430, 666, 915, 153, 400, 3840, 3593, 3331, 3082, 2822, 2575, 2309, 2060, 1804, 1541, 1295, 1030, 778, 515, 265, 0
]);
THREE.triTable = new Int32Array([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1, 3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1, 3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1, 9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1, 8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1, 3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1, 1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1, 4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1, 4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1, 2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1, 9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1, 10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1, 5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1, 5, 4, 8, 5,
    8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1, 0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1, 1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1, 8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1, 2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, 7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, 9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1, 2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1, 11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1, 9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1, 5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1, 11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1, 11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1, 9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1, 5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1, 2, 3, 11, 10, 6,
    5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1, 6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1, 3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1, 6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1, 6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, 1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1, 8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1, 7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1, 3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1, 0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, 9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1, 8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1, 5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1, 0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1, 6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1, 10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
    10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1, 8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1, 1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1, 0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, 10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1, 3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1, 6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1, 9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1, 8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1, 3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
    6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1, 10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1, 10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1, 1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1, 7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1, 7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1, 1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1, 11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
    8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1, 0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1, 7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1, 7,
    2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1, 2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, 1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1, 10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1, 10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1, 0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1, 7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1, 6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1, 9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1, 6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1, 4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1, 10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1, 8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, 0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1, 1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1, 10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1, 4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1, 10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1, 9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1, 7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1, 3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1, 7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1, 3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1, 6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1, 9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1, 1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1, 4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1, 7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1, 6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1, 0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1, 6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1, 0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1, 11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1, 6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1, 5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1, 9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1, 1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1, 1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1, 10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1, 0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1, 5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1, 10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1, 11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1, 9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1, 7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1, 2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, 8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1, 9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1, 9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1, 1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1, 9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1, 9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, 5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1, 0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1, 10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1, 2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1, 0, 4, 11, 0, 11, 3, 4, 5, 11,
    2, 11, 1, 5, 1, 11, -1, 0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1, 9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1, 5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1, 3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1, 5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1, 9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1, 1, 10, 11, 1, 11,
    4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1, 3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1, 4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1, 9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1, 11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1, 11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1, 2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1, 9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1, 3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1, 1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1, 4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1, 3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1, 0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1, 9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1, 1, 10,
    2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
]);
THREE.Trident = function(a) {
    function c(d) { return new THREE.Mesh(new THREE.Cylinder(30, 0.1, a.length / 20, a.length / 5), new THREE.MeshBasicMaterial({ color: d })) }

    function b(d, g) {
        var h = new THREE.Geometry;
        h.vertices = [new THREE.Vertex, new THREE.Vertex(d)];
        return new THREE.Line(h, new THREE.LineBasicMaterial({ color: g }))
    }
    THREE.Object3D.call(this);
    var e = Math.PI / 2,
        f;
    a = a || THREE.Trident.defaultParams;
    if (a !== THREE.Trident.defaultParams)
        for (f in THREE.Trident.defaultParams) a.hasOwnProperty(f) || (a[f] = THREE.Trident.defaultParams[f]);
    this.scale = new THREE.Vector3(a.scale, a.scale, a.scale);
    this.addChild(b(new THREE.Vector3(a.length, 0, 0), a.xAxisColor));
    this.addChild(b(new THREE.Vector3(0, a.length, 0), a.yAxisColor));
    this.addChild(b(new THREE.Vector3(0, 0, a.length), a.zAxisColor));
    if (a.showArrows) {
        f = c(a.xAxisColor);
        f.rotation.y = -e;
        f.position.x = a.length;
        this.addChild(f);
        f = c(a.yAxisColor);
        f.rotation.x = e;
        f.position.y = a.length;
        this.addChild(f);
        f = c(a.zAxisColor);
        f.rotation.y = Math.PI;
        f.position.z = a.length;
        this.addChild(f)
    }
};
THREE.Trident.prototype = new THREE.Object3D;
THREE.Trident.prototype.constructor = THREE.Trident;
THREE.Trident.defaultParams = { xAxisColor: 16711680, yAxisColor: 65280, zAxisColor: 255, showArrows: !0, length: 100, scale: 1 };
THREE.PlaneCollider = function(a, c) {
    this.point = a;
    this.normal = c
};
THREE.SphereCollider = function(a, c) {
    this.center = a;
    this.radius = c;
    this.radiusSq = c * c
};
THREE.BoxCollider = function(a, c) {
    this.min = a;
    this.max = c;
    this.dynamic = !0;
    this.normal = new THREE.Vector3
};
THREE.MeshCollider = function(a, c, b, e) {
    this.vertices = a;
    this.faces = c;
    this.normals = b;
    this.box = e;
    this.numFaces = this.faces.length;
    this.normal = new THREE.Vector3
};
THREE.CollisionSystem = function() {
    this.collisionNormal = new THREE.Vector3;
    this.colliders = [];
    this.hits = []
};
THREE.Collisions = new THREE.CollisionSystem;
THREE.CollisionSystem.prototype.merge = function(a) {
    this.colliders = this.colliders.concat(a.colliders);
    this.hits = this.hits.concat(a.hits)
};
THREE.CollisionSystem.prototype.rayCastAll = function(a) {
    a.direction.normalize();
    this.hits.length = 0;
    var c, b, e, f, d = 0;
    c = 0;
    for (b = this.colliders.length; c < b; c++) {
        f = this.colliders[c];
        e = this.rayCast(a, f);
        if (e < Number.MAX_VALUE) {
            f.distance = e;
            e > d ? this.hits.push(f) : this.hits.unshift(f);
            d = e
        }
    }
    return this.hits
};
THREE.CollisionSystem.prototype.rayCastNearest = function(a) {
    var c = this.rayCastAll(a);
    if (c.length == 0) return null;
    for (var b = 0; c[b] instanceof THREE.MeshCollider;) {
        var e = this.rayMesh(a, c[b]);
        if (e < Number.MAX_VALUE) { c[b].distance = e; break }
        b++
    }
    if (b > c.length) return null;
    return c[b]
};
THREE.CollisionSystem.prototype.rayCast = function(a, c) {
    if (c instanceof THREE.PlaneCollider) return this.rayPlane(a, c);
    else if (c instanceof THREE.SphereCollider) return this.raySphere(a, c);
    else if (c instanceof THREE.BoxCollider) return this.rayBox(a, c);
    else if (c instanceof THREE.MeshCollider && c.box) return this.rayBox(a, c.box)
};
THREE.CollisionSystem.prototype.rayMesh = function(a, c) {
    for (var b = this.makeRayLocal(a, c.mesh), e = Number.MAX_VALUE, f = 0; f < c.numFaces / 3; f++) {
        var d = f * 3;
        d = this.rayTriangle(b, c.vertices[c.faces[d + 0]], c.vertices[c.faces[d + 1]], c.vertices[c.faces[d + 2]], e, this.collisionNormal);
        if (d < e) {
            e = d;
            c.normal.copy(this.collisionNormal);
            c.normal.normalize()
        }
    }
    return e
};
THREE.CollisionSystem.prototype.rayTriangle = function(a, c, b, e, f, d) {
    var g = THREE.CollisionSystem.__v1,
        h = THREE.CollisionSystem.__v2;
    d.set(0, 0, 0);
    g.sub(b, c);
    h.sub(e, b);
    d.cross(g, h);
    h = d.dot(a.direction);
    if (!(h < 0)) return Number.MAX_VALUE;
    g = d.dot(c) - d.dot(a.origin);
    if (!(g <= 0)) return Number.MAX_VALUE;
    if (!(g >= h * f)) return Number.MAX_VALUE;
    g /= h;
    h = THREE.CollisionSystem.__v3;
    h.copy(a.direction);
    h.multiplyScalar(g);
    h.addSelf(a.origin);
    if (Math.abs(d.x) > Math.abs(d.y))
        if (Math.abs(d.x) > Math.abs(d.z)) {
            a = h.y - c.y;
            d = b.y -
                c.y;
            f = e.y - c.y;
            h = h.z - c.z;
            b = b.z - c.z;
            e = e.z - c.z
        } else {
            a = h.x - c.x;
            d = b.x - c.x;
            f = e.x - c.x;
            h = h.y - c.y;
            b = b.y - c.y;
            e = e.y - c.y
        }
    else if (Math.abs(d.y) > Math.abs(d.z)) {
        a = h.x - c.x;
        d = b.x - c.x;
        f = e.x - c.x;
        h = h.z - c.z;
        b = b.z - c.z;
        e = e.z - c.z
    } else {
        a = h.x - c.x;
        d = b.x - c.x;
        f = e.x - c.x;
        h = h.y - c.y;
        b = b.y - c.y;
        e = e.y - c.y
    }
    c = d * e - b * f;
    if (c == 0) return Number.MAX_VALUE;
    c = 1 / c;
    e = (a * e - h * f) * c;
    if (!(e >= 0)) return Number.MAX_VALUE;
    c *= d * h - b * a;
    if (!(c >= 0)) return Number.MAX_VALUE;
    if (!(1 - e - c >= 0)) return Number.MAX_VALUE;
    return g
};
THREE.CollisionSystem.prototype.makeRayLocal = function(a, c) {
    var b = THREE.CollisionSystem.__m;
    THREE.Matrix4.makeInvert(c.matrixWorld, b);
    var e = THREE.CollisionSystem.__r;
    e.origin.copy(a.origin);
    e.direction.copy(a.direction);
    b.multiplyVector3(e.origin);
    b.rotateAxis(e.direction);
    e.direction.normalize();
    return e
};
THREE.CollisionSystem.prototype.rayBox = function(a, c) {
    var b;
    if (c.dynamic && c.mesh && c.mesh.matrixWorld) b = this.makeRayLocal(a, c.mesh);
    else {
        b = THREE.CollisionSystem.__r;
        b.origin.copy(a.origin);
        b.direction.copy(a.direction)
    }
    var e = 0,
        f = 0,
        d = 0,
        g = 0,
        h = 0,
        j = 0,
        l = !0;
    if (b.origin.x < c.min.x) {
        e = c.min.x - b.origin.x;
        e /= b.direction.x;
        l = !1;
        g = -1
    } else if (b.origin.x > c.max.x) {
        e = c.max.x - b.origin.x;
        e /= b.direction.x;
        l = !1;
        g = 1
    }
    if (b.origin.y < c.min.y) {
        f = c.min.y - b.origin.y;
        f /= b.direction.y;
        l = !1;
        h = -1
    } else if (b.origin.y > c.max.y) {
        f = c.max.y -
            b.origin.y;
        f /= b.direction.y;
        l = !1;
        h = 1
    }
    if (b.origin.z < c.min.z) {
        d = c.min.z - b.origin.z;
        d /= b.direction.z;
        l = !1;
        j = -1
    } else if (b.origin.z > c.max.z) {
        d = c.max.z - b.origin.z;
        d /= b.direction.z;
        l = !1;
        j = 1
    }
    if (l) return -1;
    l = 0;
    if (f > e) {
        l = 1;
        e = f
    }
    if (d > e) {
        l = 2;
        e = d
    }
    switch (l) {
        case 0:
            h = b.origin.y + b.direction.y * e;
            if (h < c.min.y || h > c.max.y) return Number.MAX_VALUE;
            b = b.origin.z + b.direction.z * e;
            if (b < c.min.z || b > c.max.z) return Number.MAX_VALUE;
            c.normal.set(g, 0, 0);
            break;
        case 1:
            g = b.origin.x + b.direction.x * e;
            if (g < c.min.x || g > c.max.x) return Number.MAX_VALUE;
            b = b.origin.z + b.direction.z * e;
            if (b < c.min.z || b > c.max.z) return Number.MAX_VALUE;
            c.normal.set(0, h, 0);
            break;
        case 2:
            g = b.origin.x + b.direction.x * e;
            if (g < c.min.x || g > c.max.x) return Number.MAX_VALUE;
            h = b.origin.y + b.direction.y * e;
            if (h < c.min.y || h > c.max.y) return Number.MAX_VALUE;
            c.normal.set(0, 0, j)
    }
    return e
};
THREE.CollisionSystem.prototype.rayPlane = function(a, c) {
    var b = a.direction.dot(c.normal),
        e = c.point.dot(c.normal);
    if (b < 0) b = (e - a.origin.dot(c.normal)) / b;
    else return Number.MAX_VALUE;
    return b > 0 ? b : Number.MAX_VALUE
};
THREE.CollisionSystem.prototype.raySphere = function(a, c) {
    var b = c.center.clone().subSelf(a.origin);
    if (b.lengthSq < c.radiusSq) return -1;
    var e = b.dot(a.direction.clone());
    if (e <= 0) return Number.MAX_VALUE;
    b = c.radiusSq - (b.lengthSq() - e * e);
    if (b >= 0) return Math.abs(e) - Math.sqrt(b);
    return Number.MAX_VALUE
};
THREE.CollisionSystem.__v1 = new THREE.Vector3;
THREE.CollisionSystem.__v2 = new THREE.Vector3;
THREE.CollisionSystem.__v3 = new THREE.Vector3;
THREE.CollisionSystem.__nr = new THREE.Vector3;
THREE.CollisionSystem.__m = new THREE.Matrix4;
THREE.CollisionSystem.__r = new THREE.Ray;
THREE.CollisionUtils = {};
THREE.CollisionUtils.MeshOBB = function(a) {
    a.geometry.computeBoundingBox();
    var c = a.geometry.boundingBox,
        b = new THREE.Vector3(c.x[0], c.y[0], c.z[0]);
    c = new THREE.Vector3(c.x[1], c.y[1], c.z[1]);
    b = new THREE.BoxCollider(b, c);
    b.mesh = a;
    return b
};
THREE.CollisionUtils.MeshAABB = function(a) {
    var c = THREE.CollisionUtils.MeshOBB(a);
    c.min.addSelf(a.position);
    c.max.addSelf(a.position);
    c.dynamic = !1;
    return c
};
THREE.CollisionUtils.MeshColliderWBox = function(a) {
    for (var c = a.geometry.vertices, b = c.length, e = a.geometry.faces, f = e.length, d = [], g = [], h = [], j = 0; j < b; j++) d.push(new THREE.Vector3(c[j].position.x, c[j].position.y, c[j].position.z));
    for (j = 0; j < f; j++) {
        g.push(e[j].a, e[j].b, e[j].c);
        h.push(new THREE.Vector3(e[j].normal.x, e[j].normal.y, e[j].normal.z))
    }
    c = new THREE.MeshCollider(d, g, h, THREE.CollisionUtils.MeshOBB(a));
    c.mesh = a;
    return c
};