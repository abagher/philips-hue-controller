# philips-hue-controller
A small terminal based program that will print out text based on the state of the lights.

#### Install and run the Philips Hue Simulator on Port 8080
```
sudo npm install -g hue-simulator
sudhue-simulator --port=8080
```

#### Open a new terminal window, clone project, and go to directory
```
cd philips-hue-controller
```

#### Install dependencies
```
npm install
```

#### Run the controller app
```
node app.js
```

#### Sample commands:
```
$ show all               // shows all available lights
[
    {
        "name": "Hue Lamp 1",
        "id": "1",
        "on": true,
        "brightness": 100
    },
    {
        "name": "Hue Lamp 2",
        "id": "2",
        "on": false,
        "brightness": 0
    }
]

$ set brightness 1 20    // sets the brightness of light 1 to 20%
{
    "id": "1",
    "brightness": 20
}

$ toggle off 1           // turns off light 1
{
    "id": "1",
    "on": false
}

$ toggle on 2            // turns on light 2
{
    "id": "1",
    "on": true
}

```
