# Conway's Game of Life

This is an implementation of [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life) in color.
A live example can be found at [http://labs.twuni.org/life/](http://labs.twuni.org/life/).

## Configuration

You can control the simulation's behavior and initial conditions via querystring parameters:

 * `speed`: This determines the interval, in milliseconds, between each generation. (default: **100**) [Example](http://labs.twuni.org/life/?speed=100)
 * `blending`: This determines the color of each living cell. Can be one of the following values: (default: **average**)
   * **add**: The color of a cell is the sum of the colors of its living neighbors. [Example](http://labs.twuni.org/life/?blending=add)
   * **average**: The color of a cell is the average of the colors of its living neighbors. [Example](http://labs.twuni.org/life/?blending=average)
   * **multiply**: The color of a cell is the product of the colors of its living neighbors. [Example](http://labs.twuni.org/life/?blending=multiply)
   * **sumproduct**: The color a cell is determined by summing the product of the colors of its neighbors. [Example](http://labs.twuni.org/life/?blending=sumproduct)
 * `density`: This determines the density of the initial, randomly generated state. Must be a number between 0 and 1. (default: **0.1**) [Example](http://labs.twuni.org/life/?density=0.1)
 * `decay`: This determines how many animation frames it takes for a dead cell to fade away. (default: **3**) [Example](http://labs.twuni.org/life/?decay=3)
 * `size`: This determines the size of each cell (in pixels). (default: **8**) [Example](http://labs.twuni.org/life/?size=8)
