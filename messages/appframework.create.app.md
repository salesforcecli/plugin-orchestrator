# summary

Create a new AppFramework app from a template.

# description

Creates a new app from an existing template. The app will be initialized with the configuration defined in the template.

# flags.target-org.summary

Username or alias of the target org.

# flags.target-org.description

Username or alias of the target org. Not required if the `target-org` configuration variable is already set.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

Override the api version used for api requests made by this command.

# flags.name.summary

Name for the new app (required)

# flags.name.description

A unique identifier for the app. Must be unique within your org.

# flags.label.summary

Label for the new app

# flags.label.description

A human-readable label for the app. If not provided, the name will be used.

# flags.description.summary

Description of the new app

# flags.description.description

A description of what the app does.

# flags.template-id.summary

ID of the template to use for creating the app

# flags.template-id.description

ID of an existing template to use for creating the app. Either template-id or template-name must be provided.

# flags.template-name.summary

Name of the template to use for creating the app

# flags.template-name.description

Name of an existing template to use for creating the app. Either template-id or template-name must be provided.

# flags.runtime-method.summary

Runtime method for the app (sync or async)

# flags.runtime-method.description

Specifies how the app's runtime operates, either synchronously or asynchronously.

# flags.log-level.summary

Log level for the app

# flags.log-level.description

Sets the logging level for the app. Valid options are: debug, info, warn, error.

# fetchingTemplate

Fetching template information...

# creatingApp

Creating app from template...

# createSuccess

Successfully created app with ID: %s

# noTemplateSpecified

Either template-id or template-name must be specified.

# error.TemplateNotFound

Template not found. Please check the template ID or name and try again.

# error.TemplateNotFound.Actions

- Verify that the template exists in your organization
- Check that you have spelled the template name correctly
- Try using the template ID instead of the name

# error.AppCreationError

An error occurred while creating the app: %s

# error.AppCreationError.Actions

- Check the error message above for more details
- Ensure that AppFramework is enabled in your org
- Ensure that your user has the necessary permissions

# examples

- Create a new app using a template ID:
  <%= config.bin %> <%= command.id %> --target-org myOrg --name "my_app" --template-id 01t000000000123
- Create a new app using a template name:
  <%= config.bin %> <%= command.id %> --target-org myOrg --name "sales_app" --template-name "Sales_Template"
- Create a new app with additional details:
  <%= config.bin %> <%= command.id %> --target-org myOrg --name "analytics_app" --template-name "Analytics_Template" --label "My Analytics App" --description "Custom analytics application" --runtime-method async --log-level debug
