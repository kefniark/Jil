## Getting Started

The idea behind **JIL** is to provide the best of both world, in a user friendly way.

Check the [README](../README.md) to install the library in your project.

## The Structure

To design the UI of your project, you need to understand Jil structure.

 > Scene -> Layer -> Components

1. The whole game is split in `Scene`. Usually you will have few of them (`intro`, `menu`, `game`, `result`) but this is up to you to define which one you want
2. Each `Scene` contains `Layer`. Usually something like (`background`, `canvas`, `ui`, `effect`) but once again it's up to you to define which one you want
3. `Layer` can contains many UI component, or `Panel` (a container of component)

At the beginning, you need to initialize the UI and need to define your native resolution.
```ts
jil.SceneManager.init(1280, 720);
```
**Jil** will use this resolution and scale up or down all the child components. So your game should look the same at any resolution.

## Position / Size

Unlike normal `HTML`, **Jil** use anchored position. There are few things to know:

* **Anchor**: Position in the parent (example align center right)
* **Pivot**: Position of the object based on the Anchor (example center)
* **Size**: Parent based in %
* **Position**: Parent based in %

### Few example
1. *Top Left* (1/4 of his parent size)
    * anchor: 0, 0
    * pivot: 0, 0
    * size: 0.5, 0.5

2. *Center* (1/8 of his parent size)
    * anchor: 0.5, 0.5
    * pivot: 0.5, 0.5
    * size: 0.25, 0.25

## Pixel position

Working only with `%` can be quite challenging. So **Jil** provides two helpers `.positionPx` and `.SizePx`.

They work exactly like `position` and `size`, and you can switch from one unit to the other:
```ts
img.position.set(0.5, 0.5);
// img.positionPx.x -> 640;
// img.positionPx.y -> 360;

img.positionPx.y = 720;
// img.position.x -> 0.5;
// img.position.y -> 1;
```

## Let's see the code

So let's create a scene with an image (we can customize it with `style` and `class` like any html element)
```ts
// initialize
jil.SceneManager.init();

// create scene
const sceneIntro = jil.SceneManager.create("intro");
const layer = sceneIntro.createLayer("introLayer");

// add image to the layer
layer.createImage("logo", {
    scr: "https://image.jpg",
    size: [0.5, 0.5],
    pivot: [0.5, 0.5],
    anchor: [0.5, 0.5],
    class: 'myImg',
    style: {
        border: 1px solid black;
    }
});
```

## And more

* Button
* Canvas
* Checkbox
* Image
* Input
* Radio
* Select
* Text
* ...

[More samples](https://kefniark.github.io/jil/dist/samples/)