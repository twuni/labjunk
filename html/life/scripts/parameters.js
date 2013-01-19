define( function() {

  var Parameters = [
    {
      name: "density",
      type: "float",
      description: "Determines the density of living cells in the simulation's initial state.",
      defaultValue: 0.1
    }, {
      name: "decay",
      type: "int",
      description: "Determines the number of render cycles consumed by dying cells. Setting this to 0 will improve performance.",
      defaultValue: 3
    }, {
      name: "pause",
      type: "int",
      description: "Determines the time, in milliseconds, to pause the simulation after the most recent interaction has occurred.",
      defaultValue: 1000
    }, {
      name: "speed",
      type: "int",
      description: "Determines the speed of the simulation, in milliseconds per generation.",
      defaultValue: 100
    }, {
      name: "size",
      type: "int",
      description: "Determines the size of each cell, in pixels.",
      defaultValue: 32
    }, {
      name: "shadows",
      type: "string",
      description: "Determines whether to render the grid and cells with a shadow layer. Turning this off improves performance.",
      defaultValue: "yes",
      choices: /(yes|no)/
    }, {
      name: "grid",
      type: "string",
      description: "Determines whether to render the grid. Turning this off improves performance.",
      defaultValue: "yes",
      choices: /(yes|no)/
    }, {
      name: "blending",
      type: "string",
      description: "Determines how the genetic material (i.e: the color) of parent cells are blended together in each generation's offspring.",
      defaultValue: "average",
      choices: /(add|average|multiply|sumproduct|monotone)/
    }, {
      name: "b",
      type: "string",
      description: "Determines the rule for how many neighbors a dead cell requires in order to be born.",
      defaultValue: "3"
    }, {
      name: "s",
      type: "string",
      description: "Determines the rule for how many neighbors a living cell requires in order to survive.",
      defaultValue: "23"
    }
  ];

  Parameters.describe = function() {
    for( var i = 0; i < this.length; i++ ) {
      console.log( this[i].name, "(" + this[i].type + ")", this[i].description, "(default: " + this[i].defaultValue + ")", this[i].choices ? "Options: " + this[i].choices.toString() : "" );
    }
  };

  Parameters.fromQueryString = function() {

    var parameters = {};

    var tokens = location.search.substring(1).split(/[=&]/);
    for( var i = 0; i < tokens.length; i += 2 ) {
      if( !tokens[i] ) {
        continue;
      }
      parameters[tokens[i]] = tokens[i+1];
    }

    for( var i = 0; i < Parameters.length; i++ ) {

      var Parameter = Parameters[i];
      var value = parameters[Parameter.name];

      if( value === undefined || Parameter.choices && !Parameter.choices.test(value) || ( isNaN(value) && /(float|int)/.test(Parameter.type) ) ) {
        parameters[Parameter.name] = Parameter.defaultValue;
        continue;
      }

      if( Parameter.type === "float" ) {
        parameters[Parameter.name] = parseFloat( value );
        continue;
      }

      if( Parameter.type === "int" ) {
        parameters[Parameter.name] = parseInt( value );
        continue;
      }

    }

    return parameters;

  };

  return Parameters;

} );
