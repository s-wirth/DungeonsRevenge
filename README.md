# Dungeon's Revenge

Welcome to Sophie's roguelike, Wirthslike. Feel free to change the name.

* `master`: ![master build status](https://codeship.com/projects/aa8d5cc0-5d18-0133-84df-5e493a25d753/status?branch=master)
* `staging`: ![staging build status](https://codeship.com/projects/aa8d5cc0-5d18-0133-84df-5e493a25d753/status?branch=staging)

## Setup

All dependencies are managed through NPM (the Node Package Manager). The node version is listed in `.node-version`, you
can install Node by hand or with an environment manager like nodenv or NVM (I recommend nodenv).

```
npm install
```

## Development

All build scripts are registered in `package.json`. For normal development you'll probably only need:

* `npm run serve`: runs a local development server and automatically recompiles your code while you work

## Structure

* Code lives in `src/`
* Output will go in `public/`

Both locations are configured in `package.json`, so you can change them if you want.

## Continuous integration & deployment

CI happens on the [Codeship](https://codeship.com)!

Whenever you push to `master` it will automatically be deployed to Firebase. You can see the production
app here: https://wirthlike.firebaseapp.com

Whenever you push to `staging` it will be deployed to the staging Firebase app: https://wirthlike-staging.firebaseapp.com

## Documentation (it's not very up to date...)
[Documentation](https://s-wirth.github.io/RoguelikeDocumentation/)

## Manual Deployment

You can manually deploy to Firebase by running:

```
npm run build-production # Build the production JS, CSS, HTML
firebase deploy # Deploys to the production app by default
# firebase deploy --firebase wirthslike-staging # Deploy the staging app
```

## ToDo List

* [x] Sight (done)
    * [x] Basic Sight (done)
    * [x] Enemies In Sight (done)
    * [x] Memory (done)
    * [x] Floor Tiles (done)
* [x] Intro / Death Screens (done)
* [x] Sprites (done)
    * [x] Player (done)
    * [x] Enemy (done)
    * [x] Environment (done)
* [x] Boss Level (done)
    * [x] Boss Enemy (done)
    * [x] Special Level (done)
    * [x] Winning Screen (done)
* [x] Performance Fix (done)
* [x] Skill/Battle Behaviour
    * [x] Level Ups
    * [x] Getting Stronger
    * [x] Healing
    * [ ] Random Damage Control
    * [x] Smarter Enemy Movement
    * [x] Enemies Targeting On Sight
* [x] Environment Decoration (at least kinda...)
* [ ] Animation
* [ ] InGame Items
    * [ ] Item Drop on Kill
    * [ ] Healing Potion
    * [ ] Weapons(?)
* [ ] Tile Inspection
* [ ] Track Score Online
