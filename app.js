'use strict';

const {
  getInfoAll,
  toggleLight,
  toggleBrightness
} = require('./controller.js');

/*
 * This is printed on program start and whenever the user
 * calls the "help" command.
 */
const printAvailableCommands = () => {
  console.log(
    'Available commands:'
    + '\n\tshow all'
    + '\n\tset brightness <light id> <number %>'
    + '\n\ttoggle on|off <light_id>'
    + '\n\thelp'
    + '\n\texit\n'
  );
};

/**
 * Presents the user with an input field to enter commands.
 * The callback function parameter is the sentence split into
 * an array, ie. ['show', 'all'] or ['toggle','off', '1'].
 */
const prompt = (statement, callback) => {
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdin.resume();
  stdout.write(statement);

  stdin.once('data', function (data) {
    callback(data.toString().trim().split(/\s+/));
  });
};

/*
 * Returns null if any of the parameters are incorrect.
 * Returns the appropriate controller function otherwise.
 */
const parseCommand = (command) => {
  switch (command[0]) {

    default:
      console.log(`ERROR: Unrecognized command ${command[0]}.`);
      return null;

    case 'help':
      printAvailableCommands();
      return null;

    case 'exit':
      process.exit();
      return null;

    case 'show':
      if (command[1] !== 'all') {
        console.log(`ERROR: Unrecognized command ${command[1]}.`);
        return null;
      }
      return getInfoAll(false);

    case 'set':
      if (command[1] !== 'brightness') {
        console.log(`ERROR: Unrecognized command ${command[1]}.`);
        return null;
      } else {
        const id = command[2];
        const briVal = command[3];

        if (!Number(briVal)) {
         console.log('ERROR: Brightness value is not a number.');
         return null;
        } else if (briVal > 100 || briVal < 0) {
          console.log('ERROR: Brightness value must be between 0 and 100.');
          return null;
        }
        return toggleBrightness(id, briVal);
      }

    case 'toggle':
      if (command[1] === 'on') {
        return toggleLight(command[2], true);
      } else if (command[1] === 'off') {
        return toggleLight(command[2], false);
      }
      console.log(`ERROR: Unrecognized command ${command[1]}.`);
  }
};

/**
 * A recursive function that determines which controller function
 * should be called. It also calls itself until an exit command
 * stops the process.
 */
const getUserInput = () => {
  prompt('\nEnter a command: ', (input) => {
    if (input.length > 100) process.exit();

    const command = input.map(i => i.toLowerCase());
    const callController = parseCommand(command);

    if (callController) {
      callController
        .then((output) => {
          console.log(output);
          getUserInput();
        })
        .catch((err) => {
          console.log(`ERROR: ${err}`);
          getUserInput();
        });
    } else {
      getUserInput();
    }

  });
};

// PROGRAM BEGIN
console.log('\nWelcome to the Philips Hue light controller tool.');
printAvailableCommands();

getInfoAll(true)
  .then((infoAll) => {
    console.log(infoAll);
    getUserInput();
  })
  .catch((err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log('ERROR: Server is offline.');
    } else console.log(err);
  });
