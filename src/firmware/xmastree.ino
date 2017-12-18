/*
 *      Copyright 2017 Particle Industries, Inc.
 *
 *      Licensed under the Apache License, Version 2.0 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 *
 */

/*
 *      Project: Xmas Tree
 *
 *      Description:
 *          This is a Xmas tree with 25 LEDs, a piezo buzzer and a 5-way joystick designed for Particle Photon
 *          and Electron connected to the cloud which demostrates how to:
 *              1.  define cloud functions for controlling the tree over the Particle Cloud.
 *              2.  generate tones using the piezo buzzer
 *              3.  create beautiful effects using the LEDs
 *              4.  control the tree state using the 5-way joystick.
 *
 */

#include "xmastree.h"       // All macros (#define) are in xmastree.h
#include <dotstar.h>

/* Project name and version */
#define WHOAMI              "XmasTree"
#define VERSION             1

/* LED brightness value */
/* Warning: less than 80 is highly recommended for safety and for your eyes */
#define LED_BRIGHTNESS      30

/* Project name and version */
const char projName[] = WHOAMI;
const int version = VERSION;

/* Current song selected */
int currentSong = 0;

/* Current animation selected */
int currentAnimation = 0;

/* Current state of the effect when pressing the center button */
int currentState = STATE_NONE;

/* Set to TRUE to play the current song repeatedly */
bool repeatSong = FALSE;

/* Current button down */
volatile int buttonState = BUTTON_NONE;

/* Create an instance for the xmasTree LEDs, each LED controlled by two pins, DATA and Clock */
Adafruit_DotStar leds = Adafruit_DotStar(TOTAL_LED, PIN_LED_DATA, PIN_LED_CLOCK, DOTSTAR_BGR);

/* Two threads will be used for processing songs and LED animations */
Thread *animationWorker, *songWorker;

/* LEDs hardware initialization */
void ledsInit()
{
    leds.setBrightness(LED_BRIGHTNESS);
    leds.begin();
    leds.clear();
    stopLED();
}

/* 5-way joystick hardware initialization */
void joystickPortInit()
{
    /* Set pins to input with internal pull-up */
    pinMode(PIN_CENTER, INPUT_PULLUP);
    pinMode(PIN_UP, INPUT_PULLUP);
    pinMode(PIN_DOWN, INPUT_PULLUP);
    pinMode(PIN_LEFT, INPUT_PULLUP);
    pinMode(PIN_RIGHT, INPUT_PULLUP);
    
    /* Using interrupts for the pins */
    attachInterrupt(PIN_CENTER, buttonHandler, FALLING);
    attachInterrupt(PIN_UP, buttonHandler, FALLING);
    attachInterrupt(PIN_DOWN, buttonHandler, FALLING);
    attachInterrupt(PIN_LEFT, buttonHandler, FALLING);
    attachInterrupt(PIN_RIGHT, buttonHandler, FALLING);
}

/* Piezo buzzer hardware initialization */
void buzzerPortInit(void)
{
    pinMode(PIN_BUZZER, OUTPUT);
}

/* Set all the LEDs to color, e.g. "0xFF0000" = Red */
int playLED(String color)
{
    for (int i = 0; i < TOTAL_LED; i++)
        leds.setPixelColor(i, strtol(color, NULL, 0));
    leds.show();
}

/* Turn off all LEDs */
void stopLED()
{
    playLED("0x000000"); // R,G,B = 0,0,0
}

void playTone(int freq, int duration)
{
    Serial.println("playTone");
    tone(PIN_BUZZER, freq, duration);
}

void stopTone(String)
{
    noTone(PIN_BUZZER);
}

/* For publishing the device-connected event to the cloud */
void publishConnected()
{
    Serial.println("publishConnected");
    Particle.publish("xtreeConnected", projName);
}

/* For publishing the effect state changed event to the cloud */
void publishStateChanged()
{
    Serial.println("publishStateChanged");
    Particle.publish("stateChanged", String(currentState));
}

/* For publishing the animation changed event to the cloud */
void publishAnimationChanged()
{
    Serial.println("publishAnimationChanged");
    Particle.publish("animChanged", String(currentAnimation));
}

/* For publishing the song changed event to the cloud */
void publishSongChanged()
{
    Serial.println("publishSongChanged");
    Particle.publish("songChanged", String(currentSong));
}

#include "songs.h"
#include "animations.h"

/* The no. of songs and LED animations, defined in songs.h and animations.h */
int songCount = SONG_COUNT; 
int animationCount = ANIMATION_COUNT;

/* Play a song by the song ID */
int playSong(String songIndex)
{
    Serial.println("playSong");
    
    /* Stop the current playing song at once */
    changeSong = true;

    /* Set the current song and the song worker will play it */
    currentSong = atoi(songIndex);

    /* Update the tree current state */    
    if (currentState == STATE_NONE)
        currentState = STATE_SONG;
    else if (currentState == STATE_ANIMATION)
        currentState = STATE_BOTH;
    
    return 1;
}

/* Stop the current song playing */
int stopSong(String)
{
    Serial.println("stopSong");

    /* Stop the current playing song at once */
    changeSong = true;

    /* Update the tree current state */    
    if (currentState == STATE_SONG)
        currentState = STATE_NONE;
    else if (currentState == STATE_BOTH)
        currentState = STATE_ANIMATION;
        
    return 1;
}

/* Play a LED animation by the animation ID */
int playAnimation(String animationIndex)
{
    Serial.println("playAnimation");

    /* Stop the current playing animation at once */
    changeAnimation = true;

    /* Set the current song and the animation worker will play it */
    currentAnimation = atoi(animationIndex);

    /* Update the tree current state */    
    if (currentState == STATE_NONE)
        currentState = STATE_ANIMATION;
    else if (currentState == STATE_SONG)
        currentState = STATE_BOTH;

    return 1;
}

/* Stop the LED cureent playing animation */
int stopAnimation(String)
{
    Serial.println("stopAnimation");

    /* Stop the current playing animation at once */
    changeAnimation = true;
    stopLED();

    /* Update the tree current state */
    if (currentState == STATE_ANIMATION)
        currentState = STATE_NONE;
    else if (currentState == STATE_BOTH)
        currentState = STATE_SONG;

    return 1;
}

/* Toggle the state of the tree for the Center button */
int toggleState()
{
    currentState++;
    if (currentState > STATE_MAX)
        currentState = 0;
    
    Serial.println("toggleState");

    if (currentState == STATE_NONE || currentState == STATE_SONG)
        stopAnimation("");

    if (currentState == STATE_NONE || currentState == STATE_ANIMATION)
        stopSong("");

    return currentState;
}

/* Set the state of the tree */
int setState(String state)
{
    Serial.println("setState");

    if (String(currentState) == state)
        return 0;
        
    if ( (state == "BOTH") || (state == String(STATE_BOTH)) ) {
        playSong(String(currentSong));
        playAnimation(String(currentAnimation));
        currentState = STATE_BOTH;
    } else if ( (state == "SONG") || (state == String(STATE_SONG)) ) {
        playSong(String(currentSong));
        stopAnimation("");
        currentState = STATE_SONG;
    } else if ( (state == "ANIMATION") || (state == String(STATE_ANIMATION)) ) {
        stopSong("");
        playAnimation(String(currentAnimation));
        currentState = STATE_ANIMATION;
    } else if ( (state == "NONE") || (state == String(STATE_NONE)) ) {
        stopSong("");
        stopAnimation("");
        currentState = STATE_NONE;
    } else
        return -1;
    
    return 1;
}

/* Start playing the next song */
int nextSong()
{
    Serial.println("nextSong");

    /* if the state is not playing song, then do nothing */ 
    if ( (currentState == STATE_SONG) || (currentState == STATE_BOTH) ) {
        currentSong++;
        if (currentSong == songCount)
            currentSong = 0;
        
        changeSong = true;
    }

    return currentSong;
}

/* Start playing the previous song */
int prevSong()
{
    Serial.println("prevSong");

    if ( (currentState == STATE_SONG) || (currentState == STATE_BOTH) ) {
        currentSong--;
        if (currentSong < 0)
            currentSong = songCount-1;
                
        changeSong = true;
    }

    return currentSong;
}

/* Start playing the next animation */
int nextAnimation()
{
    Serial.println("nextAnimation");

    if ( (currentState == STATE_ANIMATION) || (currentState == STATE_BOTH) ) {
        currentAnimation++;
        if (currentAnimation == animationCount)
            currentAnimation = 0;
            
        changeAnimation = true;
    }

    return currentAnimation;
}

/* Start playing the previous LED animation */
int prevAnimation()
{
    Serial.println("prevAnimation");

    if ( (currentState == STATE_ANIMATION) || (currentState == STATE_BOTH) ) {
        currentAnimation--;
        if (currentAnimation < 0)
            currentAnimation = animationCount-1;

        changeAnimation = true;
    }
    
    return currentAnimation;
}

/* Process the button states */
int buttonPressed(String direction)
{
    Serial.print("buttonPressed: ");
    Serial.println(direction);
    
    if ( direction == "CENTER" || direction == String(BUTTON_CENTER) )
        return toggleState();
    else if ( direction == "UP" || direction == String(BUTTON_UP) )
        return prevAnimation();
    else if ( direction == "DOWN" || direction == String(BUTTON_DOWN) )
        return nextAnimation();
    else if ( direction == "LEFT" || direction == String(BUTTON_LEFT) )
        return prevSong();
    else if ( direction == "RIGHT" || direction == String(BUTTON_RIGHT) )
        return nextSong();
    else
        return -1;
}

/* Interrupt handler for the 5-way joystick */
void buttonHandler()
{
    if (digitalRead(PIN_CENTER) == LOW)
        buttonState = BUTTON_CENTER;
    else if (digitalRead(PIN_UP) == LOW)
        buttonState = BUTTON_UP;
    else if (digitalRead(PIN_DOWN) == LOW)
        buttonState = BUTTON_DOWN;
    else if (digitalRead(PIN_LEFT) == LOW)
        buttonState = BUTTON_LEFT;
    else if (digitalRead(PIN_RIGHT) == LOW)
        buttonState = BUTTON_RIGHT;
}

/* Process buttons for the 5-way joystick */
void processButtons()
{
    if (buttonState != BUTTON_NONE) {

        /* Wait until button up */        
        if ( (digitalRead(PIN_CENTER) == LOW) || (digitalRead(PIN_UP) == LOW) ||
            (digitalRead(PIN_DOWN) == LOW) || (digitalRead(PIN_LEFT) == LOW) ||
            (digitalRead(PIN_RIGHT) == LOW) )
            return;
        
        if (buttonState == BUTTON_CENTER)
            buttonPressed("CENTER");
        else if (buttonState == BUTTON_UP)
            buttonPressed("UP");
        else if (buttonState == BUTTON_DOWN)
            buttonPressed("DOWN");
        else if (buttonState == BUTTON_LEFT)
            buttonPressed("LEFT");
        else if (buttonState == BUTTON_RIGHT)
            buttonPressed("RIGHT");
        
        /* Clear the button state */
        buttonState = BUTTON_NONE;
    }
}

/* Button pressed from the cloud */ 
void buttonEventHandler(const char *event, const char *data)
{
    if (String(event) == "btnPressed")
        buttonPressed(String(data));
}

/* Process LED animations */
void processAnimations()
{
    /* This is an endless loop to process the animations one by one */
    while (1) {
        changeAnimation = false;

       if (currentState == STATE_BOTH || currentState == STATE_ANIMATION) {
            if (currentAnimation == WHITEOVERRAINBOW)
                whiteOverRainbow(20,75,5); 
            else if (currentAnimation == RAINBOWFADE2WHITE)
                rainbowFade2White(3, 6, 1);
            else if (currentAnimation == PULSEWHITE)
                pulseWhite(5);
            else if (currentAnimation == REDGREEN)
                redGreen(500);
        }

        delay(250);
    }
}

/* Process songs */
void processSongs()
{
    /* This is an endless loop to process the songs one by one */
    while (1) {
        changeSong = false;

        if ( (currentState == STATE_BOTH) || (currentState == STATE_SONG) ) {
            if (currentSong == SONG_JOYTOTHEWORLD)
                playJoyToTheWorld();
            else if (currentSong == SONG_WEWHISHYOUAMERRYXMAS)
                playWeWishYouAMerryXmas();
            else if (currentSong == SONG_RUDOLFTHEREDNOSEDREINDEER)
                playRudolfTheRedNosedReindeer();
            else if (currentSong == SONG_JINGLEBELLS)
                playJingleBells();
            else if (currentSong == SONG_SILENTNIGHT)
                playSilentNight();
        }

        delay(2000);
    }
}

/* Cloud functions, variables, events initialization */
void cloudInit()
{
    /* Cloud variables */
    Particle.variable("whoami", projName);
    Particle.variable("version", version);
    
    Particle.variable("songList", songList);
    Particle.variable("animList", animationList);

    Particle.variable("currSong", currentSong);
    Particle.variable("currAnim", currentAnimation);
    Particle.variable("currState", currentState);
    Particle.variable("songCount", songCount);
    Particle.variable("animCount", animationCount);

    /* Cloud functions */
    Particle.function("playLED", playLED);
    Particle.function("btnPressed", buttonPressed);
    Particle.function("setState", setState);
    Particle.function("playSong", playSong);
    Particle.function("playAnim", playAnimation);
    Particle.function("stopSong", stopSong);
    Particle.function("stopAnim", stopAnimation);

    /* Cloud subscription */
    Particle.subscribe("btnPressed", buttonEventHandler);
    
    /* Publish this event once connected to the cloud */
    publishConnected();
}

/* Process cloud events */
void processCloud()
{
    static int savedSong = -1;
    static int savedAnimation = -1;
    static int savedState = -1;

    if (savedSong != currentSong) {
        savedSong = currentSong;
        publishSongChanged();
    }
    
    if (savedAnimation != currentAnimation) {
        savedAnimation = currentAnimation;
        publishAnimationChanged();
    }

    if (savedState != currentState) {
        savedState = currentState;
        publishStateChanged();
    }
}

/* Print out the tree state to serial port */
void printTree()
{
    static int savedSong = -1;
    static int savedAnimation = -1;
    static int savedState = -1;
    
    if (savedState != currentState) {
        Serial.print("Current State: ");
        Serial.println(currentState);
        savedState = currentState;
    }

    if (savedSong != currentSong) {
        Serial.print("Current Song: ");
        Serial.println(currentSong);
        savedSong = currentSong;
    }

    if (savedAnimation != currentAnimation) {
        Serial.print("Current Animation: ");
        Serial.println(currentAnimation);
        savedAnimation = currentAnimation;
    }
}

/* Wiring programming starts from setup() and then calling loop() */
void setup()
{
    /* LEDs setup */
    ledsInit();
    
    /* 5-way joystick setup */
    joystickPortInit();

    /* Buzzer setup */
    buzzerPortInit();

    /* Cloud functions and variables setup */
    cloudInit();
    
    /* Creating a thread for processing LED animations and songs */
    /* So that I can just need to keep track of the buttons and the cloud activities */
    animationWorker = new Thread("animation", processAnimations);
    songWorker = new Thread("song", processSongs);
    
    /* Start to play the 1st song and LED animation */
    playSong("0");
    playAnimation("0");
}

/* This will be called repeatedly */
void loop()
{
    /* Print the tree info. */
    printTree();
    
    /* Check if button pressed */
    processButtons();
    
    /* Process the Cloud events */
    processCloud();
}
