# Comma.AI Visualizer

A simple react app that will display 1,000 trips from the SF Bay Area, each of which is a JSON file containing an array of coordinates and speed sampled at once per second. Ultimately creating a interactive map visualizing the distribution of speeds along trips recorded with our dash cam app Chffr.

![screenshot](https://i.imgur.com/8NrXkpN.jpg)

*You can also find a video demo of the application [here](https://drive.google.com/file/d/1v-TLlvxP4YQXIeShOHzNi8RzBbZtWnSl/view?usp=sharing)*

## Features

* React 16
* Webpack 4
* Babel
* Staging ES Next Features
* Hot Module Replacement

## Installation

* `git clone https://github.com/ProjectBarks/comma-ai-visualize.git`
* cd comma-ai-visualize
* npm run builddb
* npm start

## Requirements

- PostgreSQL
- Set the following environment variables: `PGHOST=localhost; PGPORT=5432; PGDATABASE=comma`
- Node v9.0.0