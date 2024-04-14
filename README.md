# SimpleThree Cylinder
**Type:** Behavior

Converts a tiled background in a 3D cylinder.

# Properties

| Name | Type | Description | Options |
|------|------|-------------|---------|
| | | **Cylinder**| |
|**Mode**| _combo_ | The cylinder's mode. Both use the tiled background's height as the cylinder's diameter, Horizontal mode uses the width for length, whereas Vertical mode uses the Vertical Height. Default value: `Vertical` | - Vertical<br/>- Horizontal |
|**Secondary Radius**| _float_ | The cylinder's secondary radius in 2D pixels, set negative value to use the same as main radius. Default value: `-1` |  |
|**Radial Segments**| _integer_ | The cylinder's radial segments, more segments, smoother cylinder. Default value: `8` |  |
|**Open Ended**| _combo_ | Is the cylinder open ended?. Default value: `No` | - No<br/>- Yes |
|**Theta Length**| _float_ | The cylinder's openness. 2 * PI means fully closed. Default value: `6.283185307179586` |  |
| | | **Cylinder: Vertical Mode**| |
|**Vertical height**| _integer_ | The cylinder's vertical height in 2D pixels. Default value: `32` |  |
| | | **Transform**| |
|**Vertical hotspot**| _combo_ | Choose the location of the vertical hot spot in the object. Default value: `Bottom` | - Top<br/>- Center<br/>- Bottom |
|**Elevation**| _integer_ | How height is this cylinder elevated from ground in 2D pixels.  |  |
|**Rotation X**| _float_ | Rotation on the X axis in degrees.  |  |
|**Rotation Z**| _float_ | Rotation on the Z axis in degrees.  |  |
| | | **Advanced**| |
|**Anisotropy**| _combo_ | The number of samples taken along the axis through the pixel that has the highest density of texels. Max will use renderer.getMaxAnisotropy method. The behavior will make sure the value is at most the maximum supported. Default value: `1` | - 1<br/>- 2<br/>- 4<br/>- 8<br/>- 16<br/>- Max |
|**Enable 2D Render**| _combo_ | If whether or not this object's 2D render will happen, disabling it saves a lot of processing power. Default value: `Disabled` | - Disabled<br/>- Enabled |
|**Magnification Filter**| _combo_ | How the texture is sampled when a texel covers more than one pixel. Default value: `Linear` | - Linear<br/>- Nearest |
|**Minification Filter**| _combo_ | How the texture is sampled when a texel covers less than one pixel. Default value: `Linear Filter` | - Nearest Filter<br/>- Nearest Mipmap Nearest Filter<br/>- Nearest Mipmap Linear Filter<br/>- Linear Filter<br/>- Linear Mipmap Nearest Filter<br/>- Linear Mipmap Linear Filter |

# ACES

## Actions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Cylinder**| |
|**Set Cylinder Secondary radius from 2D pixels**| Set the Cylinder's secondary radius from 2D pixel length. | - **Secondary Radius** _number_: The cylinder's secondary radius in 2D Pixels.  |
|**Set Cylinder radial segments**| Set the Cylinder's radial segments, more segments mean smoother cylinder. | - **Radial segments** _number_ = `8`: The cylinder's number of segments.  |
|**Set Cylinder open ended**| Sets if Cylinder is open ended or not. | - **Open Ended** _combo_: Wether the cylinder is open ended.  **Options**: (`No`, `Yes`) |
|**Set Cylinder theta length**| Set the Cylinder's theta length, e.g. 2 * PI means fully closed cylinder, PI means half a cylinder.  | - **Theta Length** _number_ = `6.283185307179586`: The cylinder's theta length.  |
| |**Cylinder: Vertical Mode**| |
|**Set Cylinder Vertical Height from 2D pixels**| Set the Cylinder's vertical height from 2D pixel length, only applies for vertical mode. | - **Vertical height** _number_: The cylinder's vertical height in 2D Pixels.  |
| |**Transform**| |
|**Set Cylinder Elevation from 2D pixels**| Set the Cylinder's Elevation from 2D pixel length. | - **Elevation** _number_: The new cylinder's elevation in 2D Pixels.  |
|**Set Cylinder X axis rotation**| Set the Cylinder's X axis rotation in degrees. | - **Rotation X** _number_: The cylinder's X axis rotation in degrees.  |
|**Set Cylinder Z Axis Rotation**| Set the Cylinder's Z axis rotation in degrees. | - **Rotation Z** _number_: The cylinder's Z axis rotation in degrees.  |

## Conditions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Cylinder: Vertical Mode**| |
|**Compare Vertical Height**| Compare the Cylinder's current Vertical Height. | - **Comparison** _comparison_:  <br />- **Value** _number_ = `0`: Value to compare Vertical Height with  |
| |**Transform**| |
|**Compare Elevation**| Compare the Cylinder's current Elevation. | - **Comparison** _comparison_:  <br />- **Value** _number_ = `0`: Value to compare Elevation with  |
|**Compare Rotation X**| Compare the Cylinder's current Rotation X. | - **Comparison** _comparison_:  <br />- **Angle (degrees)** _number_ = `0`: Angle to compare Rotation X with in degrees  |
|**Compare Rotation Z**| Compare the Cylinder's current Rotation Z. | - **Comparison** _comparison_:  <br />- **Angle (degrees)** _number_ = `0`: Angle to compare Rotation Z with in degrees  |

## Expressions

| Name | Type | Description | Parameters |
|------|------|-------------|------------|
| | |**Cylinder**| |
|**Mode**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.Mode`</small>|`number`| The Cylinder mode. |  |
|**Secondary Radius**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.SecondaryRadius`</small>|`number`| The Cylinder Secondary Radius. |  |
|**Radial Segments**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.RadialSegments`</small>|`number`| The Cylinder Radial Segments. |  |
|**Open Ended**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.OpenEnded`</small>|`number`| Is the Cylinder open ended. |  |
|**Theta Length**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.ThetaLength`</small>|`number`| The Cylinder theta length. |  |
| | |**Cylinder: Vertical Mode**| |
|**Vertical Height**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.VerticalHeight`</small>|`number`| The Cylinder Vertical Height in Pixels. |  |
| | |**Transform**| |
|**Elevation**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.Elevation`</small>|`number`| The Cylinder Elevation in Pixels. |  |
|**Rotation X**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.RotationX`</small>|`number`| The Cylinder Rotation X in Degrees. |  |
|**Rotation Z**<br/><small>**Usage:** `MyObject.SimpleThree Cylinder.RotationZ`</small>|`number`| The Cylinder Rotation Z in Degrees. |  |