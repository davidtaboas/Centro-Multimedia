#!/bin/bash
DISPLAY=:0 xset dpms force on
DISPLAY=:0 xset s off
DISPLAY=:0 xset -dpms
DISPLAY=:0 xset s noblank
DISPLAY=:0 xdotool key ctrl