# PrintNode

A server that relays print commands to GoDEX barcode printer connected via serial port, from other apps using MQTT. Provides web interface to setup and test the printer.

Intended to be deployed on a RaspberryPi using resin.io.
---

###To install:
```sh
npm install

bower install
```

### To build for development:
```sh
grunt
```

### To build for production:
```sh
grunt build
```

### To run app:
```sh
npm start
```