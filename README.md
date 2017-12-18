# PARTICLE CHRISTMAS TREE

![](/hardware/images/header.jpg)

It's a Happy Hardware Holiday for all! Meet the Particle Christmas Tree, a limited edition PCB packed full of cheer with customizable light patterns and holiday tunes. Use your tree with a Particle Photon or Electron to light up the LEDs and play music. Control your tree from the onboard joystick or from the Christmas Tree Web App.

Learn how to get started below. Happy Holidays from Team Particle!

## THINGS YOU'LL NEED
 - Christmas Tree
 - Micro USB cable
 - USB power supply (2A minimum rating)
 - Your Photon or Electron (new to Particle? Get started [here](https://docs.particle.io/guide/getting-started).)
 - Eggnog (optional)

## STEPS 

You can setup the tree in a matter of minutes.

1. Insert the Photon into the socket
1. Plug in the USB power supply
1. Flash [the Christmas tree firmware from the Web IDE][Firmware shared app] - no downloads required.
1. [Open the web interface][Web interface] and spread the cheer!

[Firmware shared app]: https://go.particle.io/shared_apps/5a376f09e59b629f5c000c8e
[Web interface]: https://spark.github.io/xmastree

<p align="center">
<img src="/hardware/images/steps-all.png">
</p>

## GET TO KNOW YOUR TREE

![](/hardware/images/description.png)

### Joystick

The joystick is a 5 way button: up, down, left, right, and center (push in) then you can reprogram the usage any way you'd like. We have setup the button for you in the Christmas tree firmware to toggle light patterns and music.

|DIR   | PIN |
|:---  |:--- |
|UP    |D4| 
|DOWN  |A0|
|LEFT  |D5|
|RIGHT |D3|
|CENTER|D6|

### Dotstar RGB LEDs

The tree has 25 of the [APA102](http://www.led-color.com/upload/201604/APA102-2020%20SMD%20LED.pdf) 2020 RGB LEDs (also commonly known as dotstars) connected in a daisy chain. These LEDs are individually addressable using two pins, data and clock. These tiny stars are incredibly bright and fast. At full brightness, with all colors turned ON, each LED will consume about 60mA of current. So 25 of them will consume a max of 1.5Amp. This is why we recommend powering the tree with a **5VDC power supply that can source at least 2Amp.** Most modern USB phone chargers should be able to meet this demand.

### Photon/Electron Socket

The two dual-row headers allow you to use either the Particle Photon or the Electron. Please take care of the orientation and position of the device while plugging in.

### Piezo speaker

At the back of the tree you'll find a piezo speaker connected to pin D0. The firmware includes several 8-bit holiday tunes but you can also compose your own. This speaker can be a bit loud. If you'd like to reduce the volume, you can put a piece of tape on its opening.

### Headers for breadboarding

These pins breakout the power and control signal of the tree. You can mount the tree on a breadboard with the help of these pins. This will allow you to connect different hardware to your tree, daisy chain multiple trees, add more LEDs or even control it with other microcontrollers.


|PIN     |DESCRIPTION|
|:-------|:----------|
|D1      | Connected to the D1 pin of the Particle device and acts as CLOCK IN to the LEDs.|
|D2      | Connected to the D2 pin of the Particle device and acts as DATA IN to the LEDs.|
|DATA OUT| DATA OUT pin of the LEDs.|
|CLK OUT | CLOCK OUT pin of the LEDs.|
|VIN     | Input power to the tree and Particle device. This pin is connected to the VIN pin of the Particle device. 5VDC max .|
|GND     | Connected to the ground.|

## SETTING UP THE TREE 

You can either use a Particle Photon or an Electron to control the tree. Since the dotstar RGB LEDs work at 5VDC, you'll need to make sure that the USB cable is plugged in at all times to power the tree, unless you have powered the tree via a separate power source via the VIN pin.

> **NOTE:** When controlled by an Electron, the tree will not work with just the LiPo battery plugged in. You'll need to connect the USB cable as well or other external 5V DC power source.

![](/hardware/images/tree-plugged.png)

## WAYS TO SET UP THE TREE

### As an ornament

The easiest way to setup the tree is to hang it as an ornament while powering over USB. You can also rig up your own 5V power supply cable and plug it into the header.


### On a breadboard

You can use the bottom header to mount the tree on a breadboard and power/control it via your own choice of hardware or to daisy chain the tree to other trees or dotstar projects.

![](/hardware/images/bb.png)

## USING THE WEB INTERFACE

<p align="center">
<a href="https://spark.github.io/xmastree" target="_blank">
<img src="/hardware/images/webinterface_preview.png" width=400>
</a></p>

There is [a hosted version of the web interface you can use to control your tree][Web interface]. Simply login with your Particle account, select your device and you'll be able to control the LEDs and music from a desktop or mobile browser.

## MODIFYING THE FIRMWARE

[![firmware](https://img.shields.io/badge/Particle%20Shared%20App-XMASTREE-blue.svg?style=for-the-badge&colorA=00aedf&colorB=555555)][Firmware shared app]

Import the firmware to your Particle account in the Web IDE with the button above. You'll be
able to add new songs or tweak the functionality to your heart's
content.

Click [here](FIRMWARE.md) for more information about the Xmas Tree firmware.

## CONNECT

Having problems or have awesome suggestions? Connect with us on our [forum](https://community.particle.io/).
