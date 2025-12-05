# summary

Test JSON transformation rules using the jsonxform/transformation endpoint.

# description

Preview how transformation rules will modify JSON documents before deploying templates. This command uses a sample transformation to test the jsonxform/transformation endpoint with built-in User and Org context variables.

# flags.target-org.summary

Username or alias for the target org; overrides default target org.

# flags.target-org.description

The username or alias of the target org where the jsonxform/transformation endpoint will be called. This org provides the User and Org context variables used in the transformation.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

API version to use for the transformation request. Defaults to the org's configured API version.

# flags.template-path.summary

Path to a local template directory to test.

# flags.template-path.description

Full path to a local Analytics template directory containing template-info.json and other template files. Use this to test rules from a specific template.

# flags.template-name.summary

Name of a local template to test.

# flags.template-name.description

Name or label of a template found in the local project. The command will search for templates in standard SFDX project paths.

# flags.project-dir.summary

Path to SFDX project root directory.

# flags.project-dir.description

Root directory of the SFDX project to search for templates. Defaults to current working directory.

# flags.no-prompt.summary

Skip interactive template selection.

# flags.no-prompt.description

Skip interactive template selection. Requires --template-path, --template-name, or --document-file to be specified. Useful for scripting and CI environments.

# flags.document-file.summary

Path to JSON document file to transform.

# flags.document-file.description

Path to the JSON document file that will be transformed by the rules.

# flags.values-file.summary

Path to JSON values file for variables.

# flags.values-file.description

Path to JSON file containing variables used in transformations.

# flags.definition-file.summary

Path to JSON rules definition file.

# flags.definition-file.description

Path to JSON file containing transformation rules and definitions.

# examples

- Test JSON transformation with sample rules:
  <%= config.bin %> <%= command.id %> --target-org myorg

- Test with specific API version:
  <%= config.bin %> <%= command.id %> --target-org myorg --api-version 60.0

- Test a specific local template by path:
  <%= config.bin %> <%= command.id %> --template-path ./force-app/main/default/appTemplates/MyTemplate --target-org myorg

- Test a local template by name:
  <%= config.bin %> <%= command.id %> --template-name working_template_1 --target-org myorg

- Test with custom project directory:
  <%= config.bin %> <%= command.id %> --template-name MyTemplate --project-dir /path/to/project --target-org myorg

- Skip interactive prompts with specific template (useful for CI/automation):
  <%= config.bin %> <%= command.id %> --no-prompt --template-name MyTemplate --target-org myorg

- Test with direct file paths (useful for CI/automation):
  <%= config.bin %> <%= command.id %> --document-file ./document.json --values-file ./values.json --definition-file ./rules.json --target-org myorg
