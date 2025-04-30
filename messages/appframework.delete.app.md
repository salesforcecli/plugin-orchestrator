# summary

Delete an AppFramework app.

# description

Deletes an app from AppFramework. Either the app ID or app name must be provided to identify the app.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

Overrides your default org.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

Override the api version used for api requests made by this command.

# flags.app-id.summary

ID of the app to delete.

# flags.app-id.description

Specify the ID of the app to delete. Either this or --app-name is required.

# flags.app-name.summary

Name of the app to delete.

# flags.app-name.description

Specify the name of the app to delete. Either this or --app-id is required.

# flags.no-prompt.summary

Skip confirmation prompt before deleting.

# flags.no-prompt.description

Disables the confirmation prompt that normally appears before deleting an app. Use with caution.

# noAppSpecified

No app specified for deletion. You must specify either an app ID with --app-id or an app name with --app-name.

# fetchingApp

Fetching app details...

# deletingApp

Deleting app...

# noAppFound

No app found with the specified ID or name.

# confirmDelete

Are you sure you want to delete the app '%s'? This action cannot be undone.

# deleteCancelled

App deletion cancelled.

# deleteSuccess

Successfully deleted app with ID: %s

# error.DeleteError

Failed to delete app: %s

# error.DeleteError.Actions

- Check that the app ID or name is correct
- Verify you have permissions to delete apps in this org
- Ensure your authentication to the org is valid
- Try running with --debug for more details

# examples

- Delete an app using its ID:
  <%= config.bin %> <%= command.id %> --app-id 01t5e000006lOjDAA2

- Delete an app using its name:
  <%= config.bin %> <%= command.id %> --app-name MyAppName
