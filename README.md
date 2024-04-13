# Legend of Arlo : The Guardian's Gauntlet

## Brief Description and Backstory

In an alternate timeline after The Legend of Zelda: Breath of the Wild, Link and Lyra have a son named Arlo. As remnants of Ganon begin to stir, Link entrusts the Master Sword to the Guardian’s Gauntlet, leaving a message for Arlo to retrieve it and defeat Ganon. Arlo, now a young adult, embarks on a dangerous journey to claim the sword and fulfill his destiny. Players take on the role of Arlo, navigating puzzles and facing foes in the Gauntlet to reach the Master Sword and then planning the escape. The game culminates in Arlo's daring escape with the sword, determining the fate of Hyrule.

## How to Run

- Navigate to the root directory
- Run `npm install --save-dev vite` to install Vite
- Run `npm install --save-three` to install Three.js
- Run `npx vite` to start the server
- Open the browser and navigate to the server displayed in the terminal

## How to Play

- Use the arrow keys to move Arlo
- You should reach the Master Sword in the middle of the map to retrieve it.
- Once you have the sword, you will need to escape the Gauntlet to complete the game.
- To escape, you must head to the end shrine.
- Be careful of the enemies and obstacles in your path.
- If enemies detect you there is a very low chance that you will survive.
- You need to plan the retrieval carefully so that you will reach the end shrine before the enemies do.

## Topics Implemented

### Complex Movement Algorithms

#### Wander

- The enemies wander around the map.
- `Guardian.js` lines 61 - 87 shows the implementation
- `State.js` line 64 shows it being called.

### Pathfinding

#### Jump Point Search

- After the player retrieves the sword enemies use JPS to find the shortest path to reach the End Shrine before the player.
- `GameMap.js` lines 109 - 292 shows the implementation
- `State.js` line 104 shows it being called.

### Decision Making

- The enemies and the player uses state machines to make decisions.
- `State.js` and `Player.js` shows the implementation.

### Procedural Content Generation

- The map is procedurally generated using a Cellular Automata.
- `CellularAutomata.js` shows the implementation.

### Other Topic

#### Pursue

- The enemies pursue the player when they detect the player.
- `Guardian.js` lines 36 - 42 shows the implementation.
- `State.js` line 92 shows it being called.

#### Arrive

- The guardians use arrive to reach the player when they detect the player.
- The guardians use arrive to reach the end shrine at the end of the game.
- `Guardian.js` lines 44 - 59 shows the implementation.
- `State.js` line 132 shows it being called.

#### Team

- This project was completed solely by me.

#### Video

- [Link to the video](https://youtu.be/GwHdAy27ecE)
