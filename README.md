<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  

## Description

Gerenciador de Palestras feito em NestJS

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Working

```bash
#POST
Send a post request to endpoint: https://task-lectures.herokuapp.com/lectures with a payload like this JSON:

{"data":[
        "Writing Fast Tests Against Enterprise Rails 60min",
        "Overdoing it in Python 45min",
        "Lua for the Masses 30min",
        "Ruby Errors from Mismatched Gem Versions 45min",
        "Common Ruby Errors 45min",
        "Rails for Python Developers lightning",
        "Communicating Over Distance 60min",
        "Accounting-Driven Development 45min",
        "Woah 30min",
        "Sit Down and Write 30min",
        "Pair Programming vs Noise 45min",
        "Rails Magic 60min",
        "Ruby on Rails: Why We Should Move On 60min",
        "Clojure Ate Scala (on my project) 45min",
        "Programming in the Boondocks of Seattle 30min",
        "Ruby vs. Clojure for Back-End Development 30min",
        "Ruby on Rails Legacy App Maintenance 60min",
        "A World Without HackerNews 30min",
        "User Interface CSS in Rails Apps 30min"
      ]
}

and than, see what happens. =)
```

## Test

```bash
# unit tests
$ npm run test

PS: Existe um probleminha neste teste, porém ainda não sei como resolver.

```