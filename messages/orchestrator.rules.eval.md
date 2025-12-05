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

# flags.document.summary

Path to JSON document file to transform.

# flags.document.description

Path to the JSON document file (dashboard, lens, etc.) that will be transformed by the rules.

# flags.variables.summary

Path to Analytics variables.json file.

# flags.variables.description

Path to the variables.json file containing variable definitions used in transformations.

# flags.rules.summary

Path to Analytics rules.json file.

# flags.rules.description

Path to the rules.json file containing transformation rules and macro definitions.

# examples

- Test JSON transformation with Analytics files:
  <%= config.bin %> <%= command.id %> --document ./dashboard.json --variables ./variables.json --rules ./rules.json --target-org myorg

- Test with specific API version:
  <%= config.bin %> <%= command.id %> --document ./dashboard.json --variables ./variables.json --rules ./rules.json --target-org myorg --api-version 60.0
