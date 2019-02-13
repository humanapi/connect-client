# Contributing

### Version Control

Step 1: Create feature branch
Step 2: Make changes as needed
Step 3: Increase the version per semver and add -beta to the end
Step 3: Create a PR
Step 4: Execute `npm run build` to build the package
Step 5: Publish the package as a beta version: `npm publish --tag beta`
Step 6: Once PR is approved and beta version is tested, merge into master
Step 7: Remove -beta from version
Step 8: Run `npm publish`
