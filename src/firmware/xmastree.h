
/* Buzzer pin */
#define PIN_BUZZER          D0

/* LEDs control pins */
#define PIN_LED_CLOCK       D1
#define PIN_LED_DATA        D2

/* 5-way button pins */
#define PIN_CENTER          D6
#define PIN_UP              D4
#define PIN_DOWN            A0
#define PIN_LEFT            D5
#define PIN_RIGHT           D3

/* LED count */
#define TOTAL_LED           25

/* Button IDs */
#define BUTTON_NONE         -1
#define BUTTON_CENTER       0
#define BUTTON_UP           1
#define BUTTON_DOWN         2
#define BUTTON_LEFT         3
#define BUTTON_RIGHT        4

/* Toggle state */
#define STATE_NONE          0   // Stop LED animation and song
#define STATE_ANIMATION     1   // Playing animation only
#define STATE_SONG          2   // Playing song only
#define STATE_BOTH          3   // Playing song and animation
#define STATE_MAX           3

