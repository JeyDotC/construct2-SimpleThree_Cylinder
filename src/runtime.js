/*
Copyright 2020 Jeysson Guevara (JeyDotC)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.SimpleThree_Cylinder = function (runtime) {
    this.runtime = runtime;
};

(function () {
    const Mode = {
        Vertical: 0,
        Horizontal: 1
    };

    const VerticalHotSpot = {
        Top: 0,
        Center: 1,
        Bottom: 2
    };

    const behaviorProto = cr.behaviors.SimpleThree_Cylinder.prototype;

    /////////////////////////////////////
    // Behavior type class
    behaviorProto.Type = function (behavior, objtype) {
        this.behavior = behavior;
        this.objtype = objtype;
        this.runtime = behavior.runtime;

        this.simpleThree = undefined;
    };

    const behtypeProto = behaviorProto.Type.prototype;

    behtypeProto.onCreate = function () {

    };

    /////////////////////////////////////
    // Behavior instance class
    behaviorProto.Instance = function (type, inst) {
        this.type = type;
        this.behavior = type.behavior;
        this.inst = inst;				// associated object instance to modify
        this.runtime = type.runtime;

        this.verticalHeight = 32;
        this.verticalHotspot = 1;
        this.elevation = 0;
        this.rotationX = 0;
        this.rotationZ = 0;
        this.secondaryRadius = -1;
        this.mode = Mode.Vertical;
        this.radialSegments = 8;
        this.openEnded = false;
        this.thetaLength = 6.283185307179586;
    };

    const behinstProto = behaviorProto.Instance.prototype;

    function toVerticalHotspot(hotspotEnum) {
        switch (hotspotEnum) {
            case VerticalHotSpot.Top:
                return 0;
            case VerticalHotSpot.Center:
                return 0.5;
            case VerticalHotSpot.Bottom:
                return 1;
        }

        return 1;
    }

    function toAnisotropyValue(anisotropy, maxAnisotropy) {
        switch (anisotropy) {
            case 0: return Math.min(1, maxAnisotropy);
            case 1: return Math.min(2, maxAnisotropy);
            case 2: return Math.min(4, maxAnisotropy);
            case 3: return Math.min(8, maxAnisotropy);
            case 4: return Math.min(16, maxAnisotropy);
            case 5: return maxAnisotropy;
        }
        console.warn('Unknown value, returning default 1.');
        return 1;
    }

    const toMinificationFilter = (filter) => {
        switch (filter) {
            case 0: return THREE.NearestFilter;
            case 1: return THREE.NearestMipmapNearestFilter;
            case 2: return THREE.NearestMipmapLinearFilter;
            case 3: return THREE.LinearFilter;
            case 4: return THREE.LinearMipmapNearestFilter;
            case 5: return THREE.LinearMipmapLinearFilter;
        }
    }

    behinstProto.createGeometry = function createGeometry() {
        const mainRadius3D = this.pixelsTo3DUnits(this.inst.height / 2);
        const secondaryRadius3D = this.pixelsTo3DUnits(this.secondaryRadius);
        const cylinderHeight3D = this.pixelsTo3DUnits(
            this.mode === Mode.Vertical
                ? this.verticalHeight
                : this.inst.width
        );
        this.heightSegments = Math.ceil(
            this.mode === Mode.Vertical
                ? this.verticalHeight / (this.inst.type.texture_img.height || 0.1)
                : this.inst.width / (this.inst.type.texture_img.width || 0.1)
        ) || 1;

        // radiusTop : Float, 
        // radiusBottom : Float, 
        // height : Float, 
        // radialSegments : Integer, 
        // heightSegments : Integer,
        // openEnded : Boolean,
        // thetaStart : Float,
        // thetaLength : Float
        const geometry = new THREE.CylinderGeometry(
            secondaryRadius3D,
            mainRadius3D,
            cylinderHeight3D,
            this.radialSegments,
            this.heightSegments,
            this.openEnded,
            0,
            this.thetaLength
        );

        if (this.mode === Mode.Horizontal) {
            geometry.rotateZ(cr.to_radians(-90))
        }

        return geometry;
    }

    function CylinderStatus(behaviorInstance) {

        this.update = function () {
            this.width = behaviorInstance.inst.width;
            this.verticalHeight = behaviorInstance.verticalHeight;
            this.height = behaviorInstance.inst.height;
        };

        this.hasChanged = function () {
            return (
                this.width != behaviorInstance.inst.width ||
                this.verticalHeight != behaviorInstance.verticalHeight ||
                this.height != behaviorInstance.inst.height
            );
        };

        this.update();
    }

    behinstProto.findSimpleThreeInstance = function () {
        const simpleThreeInstances = Object.values(this.runtime.objectsByUid)
            .filter(instance => instance.plugin instanceof cr.plugins_.SimpleThree);

        if (simpleThreeInstances.length === 0) {
            return undefined;
        }

        return simpleThreeInstances[0];
    };


    behinstProto.onCreate = function () {
        this.mode = this.properties[0]; // 0=Vertical, 1=Horizontal
        this.secondaryRadius = this.properties[1] >= 0 ? this.properties[1] : this.inst.height / 2;
        this.radialSegments = this.properties[2];
        this.openEnded = this.properties[3] === 1;
        this.thetaLength = this.properties[4];

        this.verticalHeight = this.properties[5];
        this.verticalHotspot = toVerticalHotspot(this.properties[6]);
        this.elevation = this.properties[7];
        this.rotationX = cr.to_radians(this.properties[8]);
        this.rotationZ = cr.to_radians(this.properties[9]);
        this.render2D = this.properties[11] === 1;
        this.magnificationFilter = this.properties[12] === 0 ? THREE.LinearFilter : THREE.NearestFilter;
        this.minificationFilter = toMinificationFilter(this.properties[13]);

        if (!this.render2D) {
            this.inst.drawGL = this.inst.drawGL_earlyZPass = this.inst.draw = () => { };
        }

        this.cylinderStatus = new CylinderStatus(this);

        this.pivot = new THREE.Group();
        this.simpleThree = this.findSimpleThreeInstance();
        this.pixelsTo3DUnits = v => v;

        if (this.simpleThree === undefined) {
            console.warn('No simpleThree Object found. If it exists in this layout and you see this message, try moving the SimpleThree object to the bottom of the layer.');
            return;
        }

        const anisotropy = this.anisotropy = toAnisotropyValue(this.properties[10], this.simpleThree.renderer.getMaxAnisotropy());

        this.pixelsTo3DUnits = this.simpleThree.pixelsTo3DUnits.bind(this.simpleThree);

        const geometry = this.createGeometry();

        const textureFile = this.inst.type.texture_file;

        let material = undefined;
        const onTextureLoad = () => {
            this.simpleThree.runtime.redraw = true;
        };

        const textureSettings = {
            textureFile,
            opacity: this.inst.opacity,
            anisotropy,
            onLoad: onTextureLoad,
            magnificationFilter: this.magnificationFilter,
            minificationFilter: this.minificationFilter,
            isBox: !this.openEnded,
            repeats: [
                this.radialSegments,
                this.heightSegments,
            ],
        };

        material = createMaterial(textureSettings);

        this.box = new THREE.Mesh(geometry, material);

        this.box.position.y = this.pixelsTo3DUnits((this.verticalHotspot - 0.5) * this.verticalHeight);

        if (this.inst.hasOwnProperty('hotspotX')) {
            this.box.position.x = this.pixelsTo3DUnits((0.5 - this.inst.hotspotX) * this.inst.width);
        }
        if (this.inst.hasOwnProperty('hotspotY')) {
            this.box.position.z = this.pixelsTo3DUnits((0.5 - this.inst.hotspotY) * this.inst.height);
        }

        this.pivot.add(this.box);
        this.pivot.rotation.order = 'YXZ';
        this.updatePivot();

        this.simpleThree.scene.add(this.pivot);
    };

    behinstProto.updatePivot = function () {
        this.pivot.position.set(
            this.pixelsTo3DUnits(this.inst.x),
            this.pixelsTo3DUnits(this.elevation),
            this.pixelsTo3DUnits(this.inst.y)
        );
        this.pivot.rotation.set(
            -this.rotationX,
            -this.inst.angle,
            -this.rotationZ
        );
    };

    behinstProto.updateGeometry = function () {
        if (!this.box) {
            return;
        }
        this.box.geometry = this.createGeometry();
    };

    function createMaterial({ textureFile, repeats, isBox, opacity, anisotropy, onLoad, minificationFilter, magnificationFilter }) {
        const [repeatVertical, repeatHorizontal] = repeats;
        const texture = new THREE.TextureLoader().load(textureFile, onLoad);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = anisotropy;
        texture.magFilter = magnificationFilter;
        texture.minFilter = minificationFilter;

        texture.repeat.set(repeatVertical, repeatHorizontal);
        const side = isBox ? THREE.FrontSide : THREE.DoubleSide;

        return new THREE.MeshStandardMaterial({
            map: texture,
            side: side,
            transparent: !isBox,
            alphaTest: isBox ? 0 : 0.5,
            opacity,
        });
    }

    behinstProto.onDestroy = function () {
        // called when associated object is being destroyed
        // note runtime may keep the object and behavior alive after this call for recycling;
        // release, recycle or reset any references here as necessary
        this.pivot.remove(this.box);
        this.simpleThree?.scene?.remove(this.pivot);
        this.pivot = undefined;
        this.box = undefined;
    };

    // called when saving the full state of the game
    behinstProto.saveToJSON = function () {
        // return a Javascript object containing information about your behavior's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        return {
            "vh": this.verticalHeight,
            "e": this.elevation,
            "rx": this.rotationX,
            "rz": this.rotationZ,
            "sr": this.secondaryRadius,
            "m": this.mode,
            "rs": this.radialSegments,
            "oe": this.openEnded,
            "tl": this.thetaLength,
        };
    };

    // called when loading the full state of the game
    behinstProto.loadFromJSON = function (o) {
        this.verticalHeight = o["vh"];
        this.elevation = o["e"];
        this.rotationX = o["rx"];
        this.rotationZ = o["rz"];
        this.secondaryRadius = o["sr"];
        this.mode = o["m"];
        this.radialSegments = o["rs"];
        this.openEnded = o["oe"];
        this.thetaLength = o["tl"];
    };

    behinstProto.tick = function () {
        const dt = this.runtime.getDt(this.inst);
        // called every tick for you to update this.inst as necessary
        if (this.cylinderStatus.hasChanged()) {
            this.cylinderStatus.update();
            this.updateGeometry();
        }
        this.updatePivot();
    };

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    behinstProto.getDebuggerValues = function (propsections) {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.
        propsections.push({
            "title": this.type.name,
            "properties": [
                { "name": "Vertical Height", "value": this.verticalHeight },
                { "name": "Elevation", "value": this.elevation },
                { "name": "Rotation X", "value": cr.to_degrees(this.rotationX) },
                { "name": "Rotation Z", "value": cr.to_degrees(this.rotationZ) },
                { "name": "Secondary Radius", "value": this.secondaryRadius },
                { "name": "Mode", "value": this.mode },
                { "name": "Radial Segments", "value": this.radialSegments },
                { "name": "Open Ended", "value": this.openEnded },
                { "name": "Theta Length", "value": this.thetaLength }
            ]
        });
    };

    behinstProto.onDebugValueEdited = function (header, name, value) {
        const acts = this.behavior.acts;
        switch (name) {
            case "Vertical Height":
                acts.SetVerticalHeightFrom2D.bind(this)(value);
                break;
            case "Elevation":
                acts.SetElevationFrom2D.bind(this)(value);
                break;
            case "Rotation X":
                acts.SetRotationXFrom2D.bind(this)(value);
                break;
            case "Rotation Z":
                acts.SetRotationZFrom2D.bind(this)(value);
                break;
            case "Secondary Radius":
                acts.SetSecondaryRadiusFrom2D.bind(this)(value);
                break;
            case "Radial Segments":
                acts.SetRadialSegments.bind(this)(value);
                break;
            case "Open Ended":
                acts.SetOpenEnded.bind(this)(value);
                break;
            case "Theta Length":
                acts.SetThetaLength.bind(this)(value);
                break;
        }
    };

    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {
    }

    // Conditions here ...
    Cnds.prototype.CompareVerticalHeight = function (cmp, value) {
        return cr.do_cmp(this.verticalHeight, cmp, value);
    };

    Cnds.prototype.CompareElevation = function (cmp, value) {
        return cr.do_cmp(this.elevation, cmp, value);
    };

    Cnds.prototype.CompareRotationX = function (cmp, value) {
        return cr.do_cmp(this.rotationX, cmp, cr.to_radians(value));
    };

    Cnds.prototype.CompareRotationZ = function (cmp, value) {
        return cr.do_cmp(this.rotationZ, cmp, cr.to_radians(value));
    };

    behaviorProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {
    }

    Acts.prototype.SetSecondaryRadiusFrom2D = function (secondaryRadius) {
        this.secondaryRadius = secondaryRadius;
        this.updateGeometry();
    };

    Acts.prototype.SetRadialSegments = function (radialSegments) {
        this.radialSegments = radialSegments;
        this.updateGeometry();
    };

    Acts.prototype.SetOpenEnded = function (openEnded) {
        this.openEnded = openEnded;
        this.updateGeometry();

        this.box.material.side = !this.openEnded ? THREE.FrontSide : THREE.DoubleSide;
        this.box.material.transparent = this.openEnded;
        this.box.material.alphaTest = !this.openEnded ? 0 : 0.5;
    };

    Acts.prototype.SetThetaLength = function (thetaLength) {
        this.thetaLength = thetaLength;
        this.updateGeometry();
    };

    Acts.prototype.SetVerticalHeightFrom2D = function (verticalHeight) {
        this.verticalHeight = verticalHeight;
        this.updateGeometry();
    };

    Acts.prototype.SetElevationFrom2D = function (elevation) {
        this.elevation = elevation;
        this.updateGeometry();
    };

    Acts.prototype.SetRotationXFrom2D = function (angle) {
        this.rotationX = cr.to_radians(angle);
    };

    Acts.prototype.SetRotationZFrom2D = function (angle) {
        this.rotationZ = cr.to_radians(angle);
    };

    // Actions here ...

    behaviorProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {
    }

    Exps.prototype.Mode = function (ret) {
        ret.set_float(this.mode);
    };
    Exps.prototype.SecondaryRadius = function (ret) {
        ret.set_float(this.secondaryRadius);
    };
    Exps.prototype.RadialSegments = function (ret) {
        ret.set_float(this.radialSegments);
    };
    Exps.prototype.OpenEnded = function (ret) {
        ret.set_float(this.openEnded);
    };
    Exps.prototype.ThetaLength = function (ret) {
        ret.set_float(this.thetaLength);
    };

    Exps.prototype.VerticalHeight = function (ret) {
        ret.set_float(this.verticalHeight);
    };

    Exps.prototype.Elevation = function (ret) {
        ret.set_float(this.elevation);
    };

    Exps.prototype.RotationX = function (ret) {
        ret.set_float(cr.to_degrees(this.rotationX));
    };

    Exps.prototype.RotationZ = function (ret) {
        ret.set_float(cr.to_degrees(this.rotationZ));
    };

    // Expressions here ...

    behaviorProto.exps = new Exps();

}());
