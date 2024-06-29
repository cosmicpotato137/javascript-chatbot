#!/bin/bash

# Start the Python server in a new terminal window
gnome-terminal -- python ./backend/server.py &

# Change directory to frontend and start the development server in a new terminal window
cd frontend
gnome-terminal -- npm run dev &

# Open the default browser at localhost:3000
xdg-open http://localhost:3000