## kbc-cli

> command line tool that works with [Keboola Connection (KBC)](https://developers.keboola.com/)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kbc-cli.svg)](https://npmjs.org/package/@productboard/kbc-cli)
[![Downloads/week](https://img.shields.io/npm/dw/kbc-cli.svg)](https://npmjs.org/package/@productboard/kbc-cli)
[![License](https://img.shields.io/npm/l/kbc-cli.svg)](https://github.com/productboardlabs/kbc-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @productboard/kbc-cli
$ kbc-cli COMMAND
running command...
$ kbc-cli (-v|--version|version)
@productboard/kbc-cli/0.0.1 darwin-x64 node-v10.15.3
$ kbc-cli --help [COMMAND]
USAGE
  $ kbc-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`kbc-cli help [COMMAND]`](#kbc-cli-help-command)
* [`kbc-cli init`](#kbc-cli-init)
* [`kbc-cli pull`](#kbc-cli-pull)
* [`kbc-cli push`](#kbc-cli-push)

## `kbc-cli help [COMMAND]`

display help for kbc-cli

```
USAGE
  $ kbc-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `kbc-cli init`

initialize local Keboola project

```
USAGE
  $ kbc-cli init

OPTIONS
  --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/productboardlabs/kbc-cli/blob/v0.0.1/src/commands/init.ts)_

## `kbc-cli pull`

pull transformations and store them locally

```
USAGE
  $ kbc-cli pull

OPTIONS
  --configOnly  pull only configurations without queries or scripts
  --help        show CLI help
```

_See code: [src/commands/pull.ts](https://github.com/productboardlabs/kbc-cli/blob/v0.0.1/src/commands/pull.ts)_

## `kbc-cli push`

push transformation to KBC

```
USAGE
  $ kbc-cli push

OPTIONS
  --check    check if local configuration and active KBC configuration do not differ
  --help     show CLI help
  --verbose  print response from KBC
```

_See code: [src/commands/push.ts](https://github.com/productboardlabs/kbc-cli/blob/v0.0.1/src/commands/push.ts)_
<!-- commandsstop -->
