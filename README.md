PACT Games

Phones are controllers too games....

You must run 'yarn build' on api packages to generate avatarImages

Note that `lerna` must be a dependency instead of a devDependency because Heroku needs lerna to actually launch the app but strips out devDependencies during its build process.
