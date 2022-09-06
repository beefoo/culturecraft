# CultureCraft
## Paint with open culture

CultureCraft is like a simple painting program, but instead of painting with colors, you are painting with fragments of visual culture from renowned museums and libraries such as the Met, the Smithsonian, and the New York Public Library.

## Run locally

This is a simple static web app that can be run locally using [NodeJS](https://nodejs.org/en/) like:

```
git clone https://github.com/beefoo/culturecraft.git
cd culturecraft
npm install
npm run
```

## Using your own image collections

1. Place your images in `./ingest/images/`.
1. Edit `config.json`, specifically the `collections` key with metadata about your collections
1. Update `metadata.csv` with your images' metadata.
   - You'll need at least fields: _index_, _id_, _title_, _url_, _source_, and _filename_
   - _index_ is a sequential integer starting at zero, which will be used to enforce item order
   - _id_ must be unique
   - _source_ must match the collection _id_ as defined in `config.json`
   - `filename` must match the image's filename in `./ingest/images/`
1. If you haven't already, run `npm install`
1. Run `npm run ingest` which will generate image thumbnails and json in the app directory
1. Run `npm run credits` which will update the `./site/index.html` and `./site/credits.html` with collection and item metadata.
1. View the app locally by running `npm start`


