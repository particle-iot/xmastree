# Particle Christmas Tree Firmware

## Introduction

The firmware of the Xmas Tree circuit board is based on Wiring to be run on Particle devices like the Photon and the Electron (or other compatible device like RedBear Duo) with cloud connectivity. For the details and installation, please refer to the Xmas Tree [user manual](/README.md). It controls the main components of the tree includes the 25 LEDs, the 5-way joystick and the piezo speaker. It detects the 5-way joystick buttons for user inputs to select LED animations and Xmas songs to play.

With the firmware, you will be able to learn how to use the Photon and the Electron connected to the cloud and demostrates how to:

* define cloud functions for controlling the tree over the Particle cloud
* generate tones using the piezo buzzer
* create beautiful animation effects using the LEDs
* control the tree state using the 5-way joystick

Feel free to hack, modify or inspire any new features in the firmware source code and remember to share with everyone for your great work. An example of new feature is to add an ultrasonic sensor to the tree for motion detection and then the tree starts to play a paricular song or LED animation.

## How It Works

The firmware keeps track of user inputs by monitoring the 5-way joystick button and performs the following tasks:

|BUTTON|TASKS|
|:---  |:--- |
|UP    |Play Previous Animation| 
|DOWN  |Play Next Animation|
|LEFT  |Play Previous Song|
|RIGHT |Play Next Song|
|CENTER|Toggle Tree State|

The CENTER button controls the tree with four states by toggling the following sequence:

*	(S) --> Play Both Song and Animation --> Stop Both --> Play Animation Only --> Play Song Only --> (S) 

## Source Files

### xmastree.ino

The firmware starts from the [xmastree.ino](/src/firmware/xmastree.ino) and it calls the `setup()` function at once for setting up and initialize the hardware components:

* `ledsInit()`, LEDs by using the dotstar library
* `joystickPortInit()`, 5-way joystick button with interrupt enabled
* `buzzerPortInit()`, piezo speaker

It also exposes the tree cloud functions and variables, subscribes to the tree cloud events as well:

* `cloudInit()`

After that, it will create two threads (as workers) for processing the pre-defined songs and animations:

* `animationWorker`
* `songWorker`
  
Finally, it runs the `loop()` function repeatedly to keep track of buttons and cloud events.

It calls `processButtons()` for user inputs and by adding/subtracting the variables `currentState`, `currentSong` and `currentAnimation` so that the threads can handle how to play the songs and animations. Also, it calls `processCloud()` for any events coming from the cloud over the Internet and controlling the variables as well.

Note: You can set the brightness of the LEDs to higher but less than 80 is highly recommanded for safety (too hot) and your eyes (too bright).
 
* `#define LED_BRIGHTNESS      30` 

### xmastree.h

The [xmastree.h](/src/firmware/xmastree.h) header file defines the hardware pins of the components such as the piezo speaking and the 5-way joystick. It also defines some macros for using in the source code. Normally, you do not need to modify this file.  

### songs.h

The [songs.h](/src/firmware/songs.h) file contains some pre-defined Xmas songs to be gernerated by the piezo speaker. You can modify it by adding your favorite songs there.

### animations.h

The [animations.h](/src/firmware/animations.h) file contains some pre-defined LED animations to be gernerated by the 25 LEDs. You can modify it by adding your own LED animations there.

### Cloud Variables/Functions/Events

The cloud items are exposed for the [Web App](https://spark.github.io/xmastree) to control the tree over the Internet so that you can control the tree remotely.

#### Variables

|NAME     |DESCRIPTION |
|:---     |:--- |
|whoami   |Variable `projName`, the current project name `xmastree` will be sent out by default|
|version  |Variable `version`, the current firmware version |
|currSong |Variable `currentSong`, the current song index |
|currAnim |Variable `currentAnimation`, the current LED animation index |
|currState|Variable `currentState`, the current state of the tree |
|songCount|Variable `songCount`, the number of songs available |
|animCount|Variable `animationCount`, the number of animations available |

#### Functions
 
|NAME     |DESCRIPTION |
|:---     |:--- |
|setState |`setState()`, set the current state of the tree state (none, song only, led animation only, both)|
|playSong |`playSong(String index)`, play song by index|
|stopSong |`stopSong()`, stop song|
|playAnim |`playAnimation(String index)`, play LED animation by index|
|stopAnim |`stopAnimation()`, stop LED animation|

#### Events (Publishing)

|NAME           |DESCRIPTION |
|:---           |:--- |
|xtreeConnected |Variable `ProjName`, the xmas tree will publish event "xtreeConnected" with the variable once it connects to the clould |
|stateChanged   |Variable `currentState`, when the center button pressed, event "stateChanged" will be published with the current state|
|animChanged    |Variable `currentAnimation`, when the animation changed, event "animChanged" will be published with the current animation ID|
|songChanged    |Variable `currentSong`, when the song changed, event "songChanged" will be published with the current song ID|

You can add your own events to the firmware and use the [console](https://console.particle.io/events) to monitor the cloud events for testing.

## Credits

* [midiToArduino](https://www.extramaster.net/tools/midiToArduino/)

## References

* [Main Page](https://github.com/spark/xmastree)
* [User Manual](/README.md)
* [Web App](https://spark.github.io/xmastree)
