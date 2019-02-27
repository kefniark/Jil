# JIL - HTML5 Game UI

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1aa993a6b3f1434d9d7be61a58e1adbe)](https://app.codacy.com/app/kefniark/jil?utm_source=github.com&utm_medium=referral&utm_content=kefniark/jil&utm_campaign=Badge_Grade_Dashboard)
[![Coverage Status](https://coveralls.io/repos/github/kefniark/jil/badge.svg?branch=master)](https://coveralls.io/github/kefniark/jil?branch=master)
[![Build Status](https://img.shields.io/travis/kefniark/jil/master.svg)](https://travis-ci.org/kefniark/jil)
[![NPM Version](https://img.shields.io/npm/v/jil.svg)](https://npmjs.org/package/jil)
[![NPM Downloads](https://img.shields.io/npm/dm/jil.svg)](https://npmjs.org/package/jil)
[![License](https://img.shields.io/npm/l/jil.svg)](https://npmjs.org/package/jil)

[![NPM](https://nodei.co/npm/jil.png)](https://nodei.co/npm/jil/)

* [**Demo**](https://kefniark.github.io/jil/dist/samples/)
* [**API Doc**](https://kefniark.github.io/jil/dist/docs/)

![Logo](./logo.png)

## **UI Framework for HTML5 Games**:
To build a **HTML5 Game UI**, there are usually two choices:
* Use the **GUI system** provided by your engine (each one is different with their limitations).
* Use **HTML/CSS** (but usual CSS framework like bootstrap are not designed for games)
Which in both case can be annoying and time consuming.

The idea behind **JIL** is to provide the best of both world, in a user friendly way.
 * Auto-scaling and Centering
 * Vector positioning (`pivot`, `anchor`, `position`, `scale`, `rotation`)
 * Fast HTML5/CSS3 (Use CSS3 transform & Virtual dom)
 * Tween integration (Provide an easy way to animate your UI)
 * Layer & Layout system (Easier to organize UI than table or flexbox)
 * Engine agnostic (Work with HTML canvas and dont interfer with 2D/3D Engine):
   - Babylon.js
   - Pixi
   - Phaser
   - Three.js
   - ...

> This is still a project in **early development**
>
> I plan later, to make a small editor to design scene UI and export them in `*.json`

---

## Usage

This library is exported with `UMD (Universal Module Definition)`:

### CDN
You can use directly in your webpage `https://cdn.jsdelivr.net/npm/jil@latest/dist/jil.min.js`

and call ```jil.SceneManager.init()```

### NPM
Or install it through `npm` / `yarn`
```sh
npm install jil
```

and
```ts
import { SceneManager } from 'jil';

SceneManager.init();
```

---

## Dev Usage

#### Install
```sh
npm install
```
 - clone this repository and run this command

#### Dev
```sh
npm run dev
```
 - this will start a dev server on http://localhost:8080

#### Build
```sh
npm run build
```
 - this will update the `dist` folder
    - code
    - documentation
    - typescript definition file `jil.d.ts`
