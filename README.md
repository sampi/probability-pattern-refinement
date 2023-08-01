# Probability Pattern Refinement

## Project Overview

"Probability Pattern Refinement" is a unique interpretation of the Rock, Paper, Scissors game developed using React for the desktop web.

It is designed as a single-player game and includes a distinctive feature that allows players to customize their weapons, as well as establishing which weapon can defeat the others.

The game brings uniqueness to the classic Rock, Paper, Scissors by allowing players to customize their weapons and dictate which weapon can overpower the others.

The theme and general styling of this game are inspired by the TV series [Severance](<https://en.wikipedia.org/wiki/Severance_(TV_series)>).

## DEMO

[Try it at https://probability.sampi.io](https://probability.sampi.io)

## Screenshots

Dark mode is recommended for a better experience.

<p align="center">
  <img alt="Main screen" src="/.github/screenshot-01.png" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="End game screen" src="/.github/screenshot-02.png" width="45%">
</p>

<p align="center">
  <img alt="Rules editor" src="/.github/screenshot-03.png" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Rules editor in light mode" src="/.github/screenshot-04.png" width="45%">
</p>

## Technology Stack

### [TypeScript](https://www.typescriptlang.org/)

I chose TypeScript because it was a requirement for this project but also because I am most proficient in JS/TS so I could complete the project in the shortest possible time.

### [React](https://react.dev/)

I also chose React because of the task and time constraints due to my familiarity with the framework.

### [Vite](https://vitejs.dev/) + [SWC](https://swc.rs/)

I really like to use Vite for building and hot reloading because it's so much faster than the tools that I used before it.

Because this is a new and small project where I didn't need to think about integration with different build plugins I could also try to work with SWC instead of Babel and I didn't run into any issues.

### [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

I wanted to use Recoil because of the simple API but then I remembered that I wanted to try Zustand for a while now.

I am using a single store in a single file for the whole application. I wasted a couple of hours trying to set up slicing with TypeScript but I wasn't happy with how the solution looked.

I like this state management library, but Recoil is much better integrated into React - I ran into a problem where I would call a React State setter and a Zustand setter in the same `useEffect()` and the Zustand state would update before the rendering finished. Maybe I am not used to working with this library, but I liked the simplicity of it - although the documentation is really missing more advanced but very common use cases.

### [Immer](https://immerjs.github.io/immer/)

Together with Zustand I also tried out Immer to simplify working with immutable data and I really like this approach. It was a bit tricky to realize that I can't use destructuring with nested properties of the draft object because it's a proxy and it will not update itself if it is changed like this, but once I cleared that up, it worked really well and the syntax is much more readable than cloning nested objects and returning them.

### [React Flow](https://reactflow.dev/)

As I was reading the Wikipedia article for [Rock, Paper, Scissors](https://en.wikipedia.org/wiki/Rock_paper_scissors), I noticed the nice graph representations in the Additional weapons section so I started thinking if I could implement something similar in the time I have - but then decided that it would take too long to calculate positions and draw `<canvas>` or `<svg>` myself, so I found React Flow.

I used an example from their documentation to draw lines from any part of a node to another, then I changed the curly bezier curves to straight lines, added TypeScript types to everything and I had a nice visual representation of the rules.

### [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) + [eslint-config-standard-with-typescript](https://github.com/standard/eslint-config-standard-with-typescript)

These are industry standards so there is not much to say, except that I tried to use the new [flat configuration files](https://eslint.org/docs/latest/use/configure/configuration-files-new) feature and I wasted several hours trying to make everything work which was a really bad use of time. Almost none of the plugins are ready for the new config, even using the compatibility features in the [migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) didn't help, I ran into a lot of issues with the plugins not being able to use the TypeScript compiler to resolve the files, so I had to roll back to the old configuration style, and then everything started working again.

## Installation & Setup

### Prerequisites

- [NodeJS v14.18+/16+](https://nodejs.org/en) with npm

I tested the project using NodeJS v18, but any version supported by Vite/TypeScript should be good.

### Install & Run locally

To set up the project, clone the git repository to your development machine.

```sh
git clone https://github.com/sampi/probability-pattern-refinement.git
cd probability-pattern-refinement/
```

After that, you can go ahead and install all npm dependencies.

```sh
npm install
```

This should be enough to start the project locally using the development server.

```sh
npm run dev
```

## Project Structure

Here are the most important parts of the application, I left some parts out to make it easier to see what's going on.

```
probability-pattern-refinement/
├── src/
│   └── components/
│       ├── Countdown         # separate countdown component
│       ├── EditorModal       # weapon editor modal
│       ├── Header            # game title and edit weapons button
│       ├── Leaderboard       # show scores of all players
│       ├── Modal             # generic modal using <dialog>
│       ├── NameModal         # ask the name of the user
│       ├── ResultTable       # show the results of a play
│       ├── Score             # show the player's current score
│       ├── WeaponPicker      # pick a weapon during countdown
│       ├── WeaponsMap        # React Flow weapons visualizer
│       ├── WeaponsTable      # table-based configuration component
│       ├── index.css         # :root CSS definitions
│       ├── main.tsx          # entrypoint
│       ├── store.ts          # Zustand store
│       └── utils.ts          # Utilities and additional types
├── index.html                # HTML entrypoint
├── tsconfig.json             # TSConfig used for building the app
└── tsconfig.node.json        # TSConfig used for Node-based tools
```

### Countdown component

This component starts the countdown the moment it is mounted, and then it will call a callback once the timer finishes.

This way it doesn't have to re-render the entire containing component every second.

### Modal / EditorModal / NameModal components

I am using the `<dialog>` component here, and ran into some interesting issues using `::backdrop` and the top-layer for rendering.
For example, my CSS custom properties didn't work because I learned of the separation between the two layers.

I also wanted to solve adding animations when the dialog opens/closes, which can be solved by adding an extra container `<div>` to animate the content after the dialog is open.

## Testing

Normally to run the tests, I would use [Jest](https://jestjs.io/) or [vitest](https://vitest.dev/) but this project doesn't have any explicit tests written.

### Compile-time testing

The extensive strict TypeScript type checking during compile time and the strict ESLint rules disallowing any funny business already helps a lot to make it really hard to make mistakes.

To check these, just run the `lint` script and then the `build` script and that should be sufficient to check that the code is sound.

```sh
npm run lint && npm run build
```

### Unit Testing

I looked through the code and the only part that I think would require tests is in `src/components/WeaponsMap/utils.ts`.

There is a lot of positional logic there, so I would pass examples where I check for intersecting nodes and very far-away nodes, and also check from every direction as well. I would probably write this in a way that I programmatically generate the tests to be able to test every happy case quickly.

The rest of the application doesn't require unit testing because the logic is too simple and atomic and I would be practically testing if my tests work, but I would definitely like to add E2E tests to make sure all functionality works.

## Deployment

This project uses GitHub Pages to get deployed, using the old-school `gh-pages` branch and not the new GitHub Actions way.

To generate the output and push it to `origin/remote/gh-pages`, I use the (`gh-pages`)[https://www.npmjs.com/package/gh-pages] npm package.

```sh
npm run deploy
```

## Missing Features

I only had a weekend to work on the project so I had to cut some corners and couldn't finish everything that I wanted.

### Mobile support

I kept putting off testing on mobile and then in the end I decided that I am not going to make it work.

What is missing for this is just a bit of extra CSS to make sure the modal dialogs are usable, then some changes to the weapon picker UI to make sure it fits on the smaller screen.

The inspiration came from the big desktop machine-style UI from Severance, so I think it's ok for a game like this to not work on mobile.

### Animations

I only managed to animate the show/hide state of the modal dialog.

I wanted to animate the following:

- The countdown should get larger with every second, pulsing with time.
- When the countdown ends the player's and user's weapon would crash into each other and explode into the results card.
- When a score increases on the right-hand side, then it would animate a bit in size to show the player what changed.
- When logging off, a CRT turn off effect would show.
- When adding a new weapon in the editor, it would push into the graph and the nodes would exhibit a bit of physics between them as the forces even out.

These are just some ideas, I might get more as I would be implementing them

### WeaponMap improvements

The React Flow-based `WeaponsMap` looks nice and informative but the design doesn't fit with the rest of the application. I wanted to spend some time making it look more future retro but ran out of time.

### Better styling

The `WeaponsTable` component looks a bit out of place compared to the main screens so a bit of extra visual styling of the buttons and borders would help here.

Also, the white mode visuals don't look very good compared to the dark mode.

### Better CRT effect

I tried to emulate an old CRT screen by having a background-colored 1px grid over the whole UI, as well as darkening the edges of the screen.

This could be done better using some distortion effect on the whole screen, scanlines, etc.

## Approach & Planning

The development process was both systematic and spontaneous.

### Ideation & Design

Before proceeding to development, I sketched different models and explored styles that would give the game a bit of flavor and I landed on using the visual language of Severance because I really liked it on the TV screen.

### Tool selection

Choosing the right tools is extremely important, I compared different libraries for state management and looked at different node/graph rendering approaches. I took the needs of the project and bundle size/development implications into account while making a decision.

### Prototyping & Development

Initially, all the functionalities were developed within a single component (`App.tsx`) devoid of any styling. As I proceeded, I refactored them into smaller chunks for better clarity and organization.

### Styling

After all functionality was working I moved on to the styling aspect. Adhering to 'Severance' inspired visuals, I styled the game using CSS to get the right aesthetic appeal.

### Refinement

In this stage, I went through the code a few times and also tested edge cases during testing to make sure that the game is stable and works as intended.

## Time Spent

I spent about two days on the project, give or take a few hours of bootstrapping before.

I wasted a lot of time battling with ESLint, but that time was well spent looking at the future, because now I have knowledge on how to use the flat configuration files, which will come in v9.0.0.

I also spent extra time learning (and trying out slicing) with Zustand, and also spent time understanding React Flow.

I could have finished the project faster but I also wanted to learn something new while I have the opportunity to do so.

## Future Improvements

### Different levels of enemies

I looked into different algorithms to play Rock, Paper, Scissors against, and even though true random is the best strategy in the long run, humans are not very good at random so it's possible to beat them more efficiently using some tricks that look at repeating patterns and use those against the player.

I was also thinking of hooking it up to ChatGPT or something so the player could play against AI, and maybe also relay some messages from it as it wins or loses.

### Optimal strategy calculator

Once the rules become unbalanced (some weapons defeat more weapons than others) - like in the Rock-Paper-Scissors-Fire-Water example on Wikipedia, then it would be beneficial to calculate which weapons should be used at what fraction of the time to achieve optimal strategy.

---

Thank you for reading through the documentation, I hope you enjoyed it.

Feedback and suggestions are always welcome, feel free to reach out if you have any questions - I have enabled GitHub Discussions for this repository.

---

### Acknowledgements

These are places where I copied code from, understood it, and then modified it.

- [React Flow - Floating Edges example](https://reactflow.dev/docs/examples/edges/floating-edges/)
- [Andrew Bone - React: Using native dialogs to make a modal popup](https://dev.to/link2twenty/react-using-native-dialogs-to-make-a-modal-popup-4b25)
- [victorquinn - `window.crypto.getRandomValues()` to get random integers](https://github.com/chancejs/chancejs/issues/232#issuecomment-182500222)

Thank you to the developers who wrote these docs/articles/posts.

### Advertisement

We are thrilled to introduce our Probability Pattern Refinement innovation. Styled as a classic "Rock, Paper, Scissors" contest, this innovative application is expertly crafted using React technology.

Designed for individual engagement, it offers a flexible realm of play where the rules are subject to your preference. Experience the simplicity of traditional game mechanics revitalized with a modern twist. Striking the perfect balance between familiarity and novelty, the Probability Pattern Refinement invites you to create your own rules and challenge yourself in a distinctive gaming environment.

Experience this one-of-a-kind adventure, created exclusively for discerning players like you.
