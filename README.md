# JIL - HTML5 Game UI

![Logo](./logo.png)

**UI Framework for HTML5 Games**:
 * Autoscale and centering
 * Vector positioning (`pivot`, `anchor`, `position`, `scale`, `rotation`)
 * Fast HTML5/CSS3 (Use CSS3 transform & Virtual dom)
 * Tween integration (Provide an easy way to write animation)
 * Layer system make it easy to organize UI
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

## Links
* [**Demo**](https://kefniark.github.io/jil/dist/samples/)
* [**API Doc**](https://kefniark.github.io/jil/dist/docs/)

---

## Usage

#### Manual
You can download and use `dist/jil.js`

#### NPM
```
npm install jil
```

---

## Dev Usage

#### Install
```
npm install
```
 - clone this repository and run this command

#### Dev
```
npm run dev
```
 - this will start a dev server on http://localhost:8080

#### Build
```
npm run build
```
 - this will update the `dist` folder
    - code
    - documentation
    - typescript definition file `jil.d.ts`