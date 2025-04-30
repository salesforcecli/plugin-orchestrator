# summary

Update an AppFramework app with a new template.

# description

Updates an existing AppFramework app with a new template. You must specify either the app-id or app-name flag to identify the app to update, and either the template-id or template-name flag to identify the template to use for the update.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

Overrides your default org.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

Override the api version used for api requests made by this command.

# flags.app-id.summary

ID of the app to update.

# flags.app-id.description

Specify the ID of the app to update. Either this or app-name is required.

# flags.app-name.summary

Name of the app to update.

# flags.app-name.description

Specify the name of the app to update. Either this or app-id is required.

# flags.template-id.summary

ID of the template to use for the update.

# flags.template-id.description

Specify the ID of the template to use for the update. Either this or template-name is required.

# flags.template-name.summary

Name of the template to use for the update.

# flags.template-name.description

Specify the name of the template to use for the update. Either this or template-id is required.

# flags.label.summary

New label for the app.

# flags.label.description

Optionally specify a new label for the app.

# flags.description.summary

New description for the app.

# flags.description.description

Optionally specify a new description for the app.

# flags.runtime-method.summary

Runtime method for the app.

# flags.runtime-method.description

Optionally specify a runtime method (sync or async) for the app.

# flags.log-level.summary

Log level for the app.

# flags.log-level.description

Optionally specify a log level (debug, info, warn, error) for the app.

# noAppSpecified

No app specified for update. You must specify either an app ID with --app-id or an app name with --app-name.

# noTemplateSpecified

No template specified for update. You must specify either a template ID with --template-id or a template name with --template-name.

# fetchingApp

Fetching app details...

# fetchingTemplate

Fetching template details...

# updatingApp

Updating app...

# noAppFound

No app found with the specified ID or name.

# noTemplateFound

No template found with the specified ID or name.

# updateSuccess

Successfully updated app: %s

# error.UpdateError

Failed to update app: %s

# error.UpdateError.Actions

- Check that the app ID or name is correct
- Check that the template ID or name is correct
- Verify you have permissions to update apps in this org
- Ensure your authentication to the org is valid
- Try running with --debug for more details

# examples

- Update an app by ID with a template ID:
  <%= config.bin %> <%= command.id %> --app-id 00Dxx0000000001 --template-id 00Dxx0000000002

- Update an app by name with a template name:
  <%= config.bin %> <%= command.id %> --app-name "My App" --template-name "My Template"

- Update an app with a new label and description:
  <%= config.bin %> <%= command.id %> --app-id 00Dxx0000000001 --template-id 00Dxx0000000002 --label "New Label" --description "New description"
