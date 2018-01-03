# Releasing

- merge your PR to `master`
- prepare the app for deployment: `$ npm run deploy`
- bump the app version: `$ npm version <[<newversion> | major | minor | patch | ...>` [[docs](https://docs.npmjs.com/cli/version)]
- push your updates: `$ git push origin master --follow-tags`
- create GitHub release [[here](https://github.com/particle-iot/xmastree/releases)]

Once pushed, GitHub will publish the updates (usually takes ~10m max) 👍
