#/bin/bash
npm version $1
npx svelte-kit package
cd ./package
npm publish
