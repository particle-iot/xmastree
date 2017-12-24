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

#define ANIMATION_COUNT     5

#define WHITEOVERRAINBOW    0
#define RAINBOWFADE2WHITE   1
#define PULSEWHITE          2
#define REDGREEN            3
#define SPARKCYAN           4

/* Animation List */
String animationList = "White Over Rainbow, Rainbow Fade To White, Pulse White, Red on Green, Spark with Particle Cyan";

/* An indicator to exit the current LED animation */
bool changeAnimation = false;

uint8_t red(uint32_t c)
{
  return (c >> 8);
}

uint8_t green(uint32_t c)
{
  return (c >> 16);
}

uint8_t blue(uint32_t c)
{
  return (c);
}

uint32_t Color(uint8_t r, uint8_t g, uint8_t b, uint8_t w)
{
  return ((uint32_t) w << 24) | ((uint32_t) r << 16) | ((uint32_t) g <<  8) | b;
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos)
{
    WheelPos = 255 - WheelPos;
    
    if (WheelPos < 85) {
        return Color(255 - WheelPos * 3, 0, WheelPos * 3, 0);
    }
    
    if (WheelPos < 170) {
        WheelPos -= 85;
        return Color(0, WheelPos * 3, 255 - WheelPos * 3, 0);
    }
    
    WheelPos -= 170;
    
    return Color(WheelPos * 3, 255 - WheelPos * 3, 0, 0);
}

bool delayAnimation(unsigned duration)
{
    while (duration > 0 && !changeAnimation) {
        unsigned thisDelay = duration > 100 ? 100 : duration;
        delay(thisDelay);
        duration -= thisDelay;
    }
  
    return changeAnimation;
}

bool randomDiff(uint8_t *buf, uint8_t len)
{
    for (uint8_t i = 0; i < len; i++) {
        for (uint8_t j = 0; j < len; j++) {
            if (i != j && buf[i] == buf[j]) {
                return false;
            }
        }
    }
    
    return true;
}

/*
 *
 *      LED Animations
 *
 */

void whiteOverRainbow(uint8_t wait, uint8_t whiteSpeed, uint8_t whiteLength )
{
    if (whiteLength >= leds.numPixels())
        whiteLength = leds.numPixels() - 1;

    int head = whiteLength - 1;
    int tail = 0;

    int loops = 10;
    int loopNum = 0;

    static unsigned long lastTime = 0;

    while (true) {
        for (int j = 0; j < 256; j++) {

            if (changeAnimation)
                return;
                
            for (uint16_t i = 0; i < leds.numPixels(); i++) {
                if ( (i >= tail && i <= head) || (tail > head && i >= tail) || (tail > head && i <= head) )
                    leds.setPixelColor( i, Color(255, 255, 255, 255) );
                else
                    leds.setPixelColor( i, Wheel( ( ( i * 256 / leds.numPixels() ) + j ) & 255 ) );
            }

            if (millis() - lastTime > whiteSpeed) {
                head++;
                tail++;
                
                if (head == leds.numPixels())
                    loopNum++;
            
                lastTime = millis();
            }

            if (loopNum == loops)
                return;
    
            head %= leds.numPixels();
            tail %= leds.numPixels();
            leds.show();
            delay(wait);
        }
    }
}

void rainbowFade2White(uint8_t wait, int rainbowLoops, int whiteLoops)
{
    float fadeMax = 100.0;
    int fadeVal = 0;
    uint32_t wheelVal;
    int redVal, greenVal, blueVal;

    for (int k = 0 ; k < rainbowLoops; k ++) {
        for (int j = 0; j < 256; j++) { // 5 cycles of all colors on wheel
        
            if (changeAnimation)
                return;
                
            for (int i = 0; i < leds.numPixels(); i++) {

                wheelVal = Wheel( ( (i * 256 / leds.numPixels() ) + j) & 255 );

                redVal = red(wheelVal) * float(fadeVal/fadeMax);
                greenVal = green(wheelVal) * float(fadeVal/fadeMax);
                blueVal = blue(wheelVal) * float(fadeVal/fadeMax);

                leds.setPixelColor(i, leds.Color( 255 - redVal, 255 - greenVal, 255 - blueVal));
            }

            /* First loop, fade in! */
            if (k == 0 && fadeVal < fadeMax-1)
                fadeVal++;

            /* Last loop, fade out! */
            else if (k == rainbowLoops - 1 && j > 255 - fadeMax)
                fadeVal--;

            leds.show();
            delay(wait);
        }
    }

    if (delayAnimation(500))
        return;

    for (int k = 0; k < whiteLoops; k ++) {
        for (int j = 0; j < 256 ; j++) {

            if (changeAnimation)
                return;

            for (uint16_t i = 0; i < leds.numPixels(); i++) {
                
                if (redVal + 1 < 255)
                    redVal++;
                if (greenVal + 1 < 255)
                    greenVal++;
                if (blueVal + 1 < 255)
                    blueVal++;

                leds.setPixelColor(i, leds.Color(redVal, greenVal, blueVal));
            }
            
            leds.show();
        }

        if (delayAnimation(2000))
            return;
    
        for (int j = 255; j >= 0 ; j--) {

            if (changeAnimation)
                return;

            for (uint16_t i = 0; i < leds.numPixels(); i++)
                leds.setPixelColor(i, leds.Color(j,j,j));
            
            leds.show();
        }
    }

    if (delayAnimation(500))
        return;
}

void pulseWhite(uint8_t wait)
{
    for (int j = 0; j < 256 ; j++) {

        if (changeAnimation)
            return;

        for (uint16_t i = 0; i < leds.numPixels(); i++)
            leds.setPixelColor(i, leds.Color(j,j,j));
        
        delay(wait);
        leds.show();
    }

    for (int j = 255; j >= 0 ; j--) {
        
        if (changeAnimation)
            return;

        for (uint16_t i = 0; i < leds.numPixels(); i++)
            leds.setPixelColor(i, leds.Color(j,j,j));
        
        delay(wait);
        leds.show();
    }
}

void redGreen(uint8_t wait)
{
    uint16_t j = 0;
    while(true) {

        if (changeAnimation)
            return;

        for (uint16_t i = 0; i < leds.numPixels(); i++) {
            leds.setPixelColor(i, (i + j) % 3 == 0 ? leds.Color(255,0,0) : leds.Color(0,255,0));
        }
        j = (j + 1) % 3;
        
        leds.show();
        delayAnimation(wait);
    }
}

void sparkCyan(uint8_t wait)
{
    uint8_t leftOnIndex[3], rightOnIndex[3];
    
    while(true) {
        
        for (uint8_t i = 0; i < 3; i++) {
            leftOnIndex[i]  = random(13);
            rightOnIndex[i] = random(12);
        }
        
        while (!randomDiff(leftOnIndex, 3)) {
            for (uint8_t i = 0; i < 3; i++) {
                leftOnIndex[i]  = random(13);
            }
        }
        
        while (!randomDiff(rightOnIndex, 3)) {
            for (uint8_t i = 0; i < 3; i++) {
                rightOnIndex[i]  = random(12);
            }
        }
        
        for (int j = 0; j < 256 ; j++) {

            if (changeAnimation)
                return;
    
            for (uint16_t i = 0; i < leds.numPixels(); i++) {
                
                if (i < 13) {
                    if (i == leftOnIndex[0] || i == leftOnIndex[1] || i == leftOnIndex[2])
                        leds.setPixelColor(i, leds.Color(0,j,j));
                    else
                        leds.setPixelColor(i, leds.Color(0,0,0));
                }
                else {
                    uint8_t index = i - 13;
                    if (index == rightOnIndex[0] || index == rightOnIndex[1] || index == rightOnIndex[2])
                        leds.setPixelColor(i, leds.Color(0,j,j));
                    else
                        leds.setPixelColor(i, leds.Color(0,0,0));
                }
            }
            
            delay(wait);
            leds.show();
        }
        
        for (int j = 255; j >= 0 ; j--) {
        
            if (changeAnimation)
                return;
    
            for (uint16_t i = 0; i < leds.numPixels(); i++) {
                
                if (i < 13) {
                    if (i == leftOnIndex[0] || i == leftOnIndex[1] || i == leftOnIndex[2])
                        leds.setPixelColor(i, leds.Color(0,j,j));
                    else
                        leds.setPixelColor(i, leds.Color(0,0,0));
                }
                else {
                    uint8_t index = i - 13;
                    if (index == rightOnIndex[0] || index == rightOnIndex[1] || index == rightOnIndex[2])
                        leds.setPixelColor(i, leds.Color(0,j,j));
                    else
                        leds.setPixelColor(i, leds.Color(0,0,0));
                }
            }
            
            delay(wait);
            leds.show();
        }
    }
}
