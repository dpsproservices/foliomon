#!/bin/bash
ps aux | grep startFoliomon.sh | grep bash | awk '{print $2}' | xargs kill
pkill node