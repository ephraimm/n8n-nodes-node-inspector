# Claude Code Configuration

## Project Notes

### Lint Command
Run `npm run lint` to check code style.

### Build Command
Run `npm run build` to compile TypeScript.

### Publishing
Use `/publish` command for full automated workflow, or manual steps:
1. `npm run lint && npm run build`
2. `npm version [patch|minor|major]`
3. `npm publish`
4. `git push && git push --tags`