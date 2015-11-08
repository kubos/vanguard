#!/bin/bash
# Basic script to modulate through pyhton AFSK $1 - Callsign $2 - message data 
aprs --callsign $1 --output - "$2" | play -t wav -
