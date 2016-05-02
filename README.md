## MapBiomas

A tool to monitor the transformation of the global biome over the years, providing statistical analysis options for these data


## Setup

First, clone this repository. Then,

```sh
$ cd mapbiomas/
$ bin/setup
$ npm install
```

## Running

```sh
$ rails server
$ webpack --watch
```

## Testing
```sh
$ rspec
```

## About the assets pipeline
Since we use the `react-rails` gem to render the root components, we need to expose them (and `React` itself) as globals. Do this in the `index.js` file (which is the `Webpack` entry file).

Import the css from external `npm` libraries in the `libraries_css.js` file.
