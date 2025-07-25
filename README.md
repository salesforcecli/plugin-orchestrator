**NOTE: This template for sf plugins is not yet official. Please consult with the Platform CLI team before using this template.**

# Salesforce Orchestrator Plugin

[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/license/apache-2-0)

A Salesforce CLI plugin for working with apps, templates, assets, and services.

## Installation

If you want to contribute to the plugin or run it from source:

```bash
# Clone the repository
git clone https://github.com/salesforcecli/plugin-orchestrator.git
cd plugin-orchestrator

# Install dependencies
yarn install

# Build the plugin
yarn build

# Link to your local SF CLI
sf plugins link .
```

## Running Locally for Development

When developing the plugin, you can run it in several ways:

### Using the linked plugin

After linking the plugin with `sf plugins link .`, you can run commands normally:

```bash
sf orchestrator template list --help
```

### Using the local run file

```bash
# Run a command using the local development script
./bin/dev.js orchestrator template list --help
```

### Running Tests

```bash
# Run all tests
yarn test

# Run unit tests only
yarn test:only

# Run NUTs (Node Unit Tests)
yarn test:nuts
```

## Commands

The plugin provides commands for working with templates and apps.

### Template Commands

```bash
# List templates in an org
sf orchestrator template list -o <target-org>

# Display details of a specific template
sf orchestrator template display -o <target-org> --template-id <id>

# Create a new template
sf orchestrator template create -o <target-org> --name <template-name> [--label <label>] [--type <type>]

# Update an existing template
sf orchestrator template update -o <target-org> --template-id <id> [--label <new-label>] [--description <text>]

# Delete a template
sf orchestrator template delete -o <target-org> --template-id <id>
```

### App Commands

```bash
# List apps in an org
sf orchestrator app list -o <target-org>

# Display details of a specific app
sf orchestrator app display -o <target-org> --app-id <id>

# Create a new app
sf orchestrator app create -o <target-org> --name <app-name> [--label <label>] [--template-id <template-id>]

# Update an existing app
sf orchestrator app update -o <target-org> --app-id <id> [--label <new-label>] [--description <text>]

# Delete an app
sf orchestrator app delete -o <target-org> --app-id <id>
```

## Issues

Please report any issues at https://github.com/salesforcecli/plugin-orchestrator/issues

## Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#installation)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Sign CLA (see [CLA](#cla) below).
9. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

### CLA

External contributors will be required to sign a Contributor's License
Agreement. You can do so by going to https://cla.salesforce.com/sign-cla.

## Learn about `sf` plugins

Salesforce CLI plugins are based on the [oclif plugin framework](https://oclif.io/docs/introduction). Read the [plugin developer guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_plugins.meta/sfdx_cli_plugins/cli_plugins_architecture_sf_cli.htm) to learn about Salesforce CLI plugin development.

This repository contains a lot of additional scripts and tools to help with general Salesforce node development and enforce coding standards. You should familiarize yourself with some of the [node developer packages](#tooling) used by Salesforce.

Additionally, there are some tests that the Salesforce CLI will enforce if this plugin is ever bundled with the CLI. These test are included by default under the `posttest` script and it is required to keep these tests active in your plugin if you plan to have it bundled.

### Tooling

- [@salesforce/core](https://github.com/forcedotcom/sfdx-core)
- [@salesforce/kit](https://github.com/forcedotcom/kit)
- [@salesforce/sf-plugins-core](https://github.com/salesforcecli/sf-plugins-core)
- [@salesforce/ts-types](https://github.com/forcedotcom/ts-types)
- [@salesforce/ts-sinon](https://github.com/forcedotcom/ts-sinon)
- [@salesforce/dev-config](https://github.com/forcedotcom/dev-config)
- [@salesforce/dev-scripts](https://github.com/forcedotcom/dev-scripts)

This plugin is bundled with the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli). For more information on the CLI, read the [getting started guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm).

We always recommend using the latest version of these commands bundled with the CLI, however, you can install a specific version or tag if needed.
