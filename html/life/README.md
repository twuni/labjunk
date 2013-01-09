# Conway's Game of Life

This is an implementation of [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life) in color.
A live example can be found at [http://labs.twuni.org/life/](http://labs.twuni.org/life/).

## Configuration

You can control the simulation's behavior and initial conditions via querystring parameters:

 * `blending`: This determines the color of each living cell. Can be one of the following values: (default: **average**)
   * **add**: The color of a cell is the sum of the colors of its living neighbors.
   * **average**: The color of a cell is the average of the colors of its living neighbors.
   * **multiply**: The color of a cell is the product of the colors of its living neighbors.
   * **sumproduct**: The color a cell is determined by summing the product of the colors of its neighbors.
 * `density`: This determines the density of the initial, randomly generated state. Must be a number between 0 and 1. (default: **0.1**)
