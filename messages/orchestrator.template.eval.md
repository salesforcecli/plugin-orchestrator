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

- Test JSON transformation with document file only:
  <%= config.bin %> <%= command.id %> --document-file ./document.json --target-org myorg

- Test with document, values, and rules files:
  <%= config.bin %> <%= command.id %> --document-file ./document.json --values-file ./values.json --definition-file ./rules.json --target-org myorg

- Test with specific API version:
  <%= config.bin %> <%= command.id %> --document-file ./document.json --target-org myorg --api-version 60.0
