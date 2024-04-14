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
function GetBehaviorSettings()
{
	return {
		"name":			"SimpleThree Cylinder",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"SimpleThree_Cylinder",			// this is used to SimpleThree_Cylinder this behavior and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Converts a tiled background in a 3D cylinder.",
		"author":		"JeyDotC",
		"help url":		"https://github.com/JeyDotC/construct2-SimpleThree_Cylinder",
		"category":		"Three Js",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

if (typeof module !== 'undefined') {
	module.exports = { settings: GetBehaviorSettings(), type: 'Behavior'};
}
// Actions
AddNumberParam("Secondary Radius", "The cylinder's secondary radius in 2D Pixels.", 0);
AddAction(0, 0, "Set Cylinder Secondary radius from 2D pixels", "Cylinder", "Cylinder secondary radius to <b>{0}</b>", "Set the Cylinder's secondary radius from 2D pixel length.", "SetSecondaryRadiusFrom2D");

AddNumberParam("Radial segments", "The cylinder's number of segments.", 8);
AddAction(1, 0, "Set Cylinder radial segments", "Cylinder", "Cylinder radial segments to <b>{0}</b>", "Set the Cylinder's radial segments, more segments mean smoother cylinder.", "SetRadialSegments");

AddComboParamOption('No');
AddComboParamOption('Yes');
AddComboParam('Open Ended', 'Wether the cylinder is open ended.', 0);
AddAction(2, 0, "Set Cylinder open ended", "Cylinder", "Set Cylinder open ended to <b>{0}</b>", "Sets if Cylinder is open ended or not.", "SetOpenEnded");

AddNumberParam("Theta Length", "The cylinder's theta length.", 6.283185307179586);
AddAction(3, 0, "Set Cylinder theta length", "Cylinder", "Cylinder theta length to <b>{0}</b>", "Set the Cylinder's theta length, e.g. 2 * PI means fully closed cylinder, PI means half a cylinder. ", "SetThetaLength");


AddNumberParam("Vertical height", "The cylinder's vertical height in 2D Pixels.", 0);
AddAction(4, 0, "Set Cylinder Vertical Height from 2D pixels", "Cylinder: Vertical Mode", "Cylinder height to <b>{0}</b>", "Set the Cylinder's vertical height from 2D pixel length, only applies for vertical mode.", "SetVerticalHeightFrom2D");

AddNumberParam("Elevation", "The new cylinder's elevation in 2D Pixels.", 0);
AddAction(5, 0, "Set Cylinder Elevation from 2D pixels", "Transform", "Cylinder Elevation to <b>{0}</b>", "Set the Cylinder's Elevation from 2D pixel length.", "SetElevationFrom2D");

AddNumberParam("Rotation X", "The cylinder's X axis rotation in degrees.", 0);
AddAction(6, 0, "Set Cylinder X axis rotation", "Transform", "Cylinder X axis rotation to <b>{0}</b> degrees", "Set the Cylinder's X axis rotation in degrees.", "SetRotationXFrom2D");

AddNumberParam("Rotation Z", "The cylinder's Z axis rotation in degrees.", 0);
AddAction(7, 0, "Set Cylinder Z Axis Rotation", "Transform", "Cylinder Z axis rotation to <b>{0}</b> degrees", "Set the Cylinder's Z axis rotation in degrees.", "SetRotationZFrom2D");

// Conditions
AddCmpParam("Comparison", "");
AddNumberParam("Value", "Value to compare Vertical Height with", "0");
AddCondition(0, 0, "Compare Vertical Height", "Cylinder: Vertical Mode", "Vertical Height is {0} to <i>{1}</i>", "Compare the Cylinder's current Vertical Height.", "CompareVerticalHeight" );

AddCmpParam("Comparison", "");
AddNumberParam("Value", "Value to compare Elevation with", "0");
AddCondition(1, 0, "Compare Elevation", "Transform", "Elevation is {0} to <i>{1}</i>", "Compare the Cylinder's current Elevation.", "CompareElevation" );

AddCmpParam("Comparison", "");
AddNumberParam("Angle (degrees)", "Angle to compare Rotation X with in degrees", "0");
AddCondition(2, 0, "Compare Rotation X", "Transform", "Rotation X is {0} to <i>{1}</i>", "Compare the Cylinder's current Rotation X.", "CompareRotationX" );

AddCmpParam("Comparison", "");
AddNumberParam("Angle (degrees)", "Angle to compare Rotation Z with in degrees", "0");
AddCondition(3, 0, "Compare Rotation Z", "Transform", "Rotation Z is {0} to <i>{1}</i>", "Compare the Cylinder's current Rotation Z.", "CompareRotationZ" );

// Expressions
AddExpression(0, ef_return_number, "Mode", "Cylinder", "Mode", "The Cylinder mode.");
AddExpression(1, ef_return_number, "Secondary Radius", "Cylinder", "SecondaryRadius", "The Cylinder Secondary Radius.");
AddExpression(2, ef_return_number, "Radial Segments", "Cylinder", "RadialSegments", "The Cylinder Radial Segments.");
AddExpression(3, ef_return_number, "Open Ended", "Cylinder", "OpenEnded", "Is the Cylinder open ended.");
AddExpression(4, ef_return_number, "Theta Length", "Cylinder", "ThetaLength", "The Cylinder theta length.");
AddExpression(5, ef_return_number, "Vertical Height", "Cylinder: Vertical Mode", "VerticalHeight", "The Cylinder Vertical Height in Pixels.");
AddExpression(6, ef_return_number, "Elevation", "Transform", "Elevation", "The Cylinder Elevation in Pixels.");
AddExpression(7, ef_return_number, "Rotation X", "Transform", "RotationX", "The Cylinder Rotation X in Degrees.");
AddExpression(8, ef_return_number, "Rotation Z", "Transform", "RotationZ", "The Cylinder Rotation Z in Degrees.");

////////////////////////////////////////
ACESDone();

var property_list = [
	/*--*/new cr.Property(ept_section, "Cylinder"),
	/* 0*/new cr.Property(ept_combo, "Mode", "Vertical", "The cylinder's mode. Both use the tiled background's height as the cylinder's diameter, Horizontal mode uses the width for length, whereas Vertical mode uses the Vertical Height.", "Vertical|Horizontal"),
	/* 1*/new cr.Property(ept_float, "Secondary Radius", -1, "The cylinder's secondary radius in 2D pixels, set negative value to use the same as main radius."),
	/* 2*/new cr.Property(ept_integer, "Radial Segments", 8, "The cylinder's radial segments, more segments, smoother cylinder."),
	/* 3*/new cr.Property(ept_combo, "Open Ended", "No", "Is the cylinder open ended?.", "No|Yes"),
	/* 4*/new cr.Property(ept_float, "Theta Length", 6.283185307179586, "The cylinder's openness. 2 * PI means fully closed."),
	
	/*--*/new cr.Property(ept_section, "Cylinder: Vertical Mode"),
	/* 5*/new cr.Property(ept_integer, "Vertical height", 32, "The cylinder's vertical height in 2D pixels."),
	
	/*--*/new cr.Property(ept_section, "Transform"),
	/* 6*/new cr.Property(ept_combo, "Vertical hotspot", "Bottom", "Choose the location of the vertical hot spot in the object.", "Top|Center|Bottom"),
	/* 7*/new cr.Property(ept_integer, "Elevation", 0, "How height is this cylinder elevated from ground in 2D pixels."),
	/* 8*/new cr.Property(ept_float, "Rotation X", 0, "Rotation on the X axis in degrees."),
	/* 9*/new cr.Property(ept_float, "Rotation Z", 0, "Rotation on the Z axis in degrees."),

	/*--*/new cr.Property(ept_section, "Advanced"),
	/*10*/new cr.Property(ept_combo, "Anisotropy", "1", "The number of samples taken along the axis through the pixel that has the highest density of texels. Max will use renderer.getMaxAnisotropy method. The behavior will make sure the value is at most the maximum supported.", "1|2|4|8|16|Max"),
	/*11*/new cr.Property(ept_combo, "Enable 2D Render", "Disabled", "If whether or not this object's 2D render will happen, disabling it saves a lot of processing power.", "Disabled|Enabled"),
	/*12*/new cr.Property(ept_combo, "Magnification Filter", "Linear", "How the texture is sampled when a texel covers more than one pixel.", "Linear|Nearest"),
	/*13*/new cr.Property(ept_combo, "Minification Filter", "Linear Filter", "How the texture is sampled when a texel covers less than one pixel.", "Nearest Filter|Nearest Mipmap Nearest Filter|Nearest Mipmap Linear Filter|Linear Filter|Linear Mipmap Nearest Filter|Linear Mipmap Linear Filter"),
];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
};

// Class representing an individual instance of the behavior in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};
