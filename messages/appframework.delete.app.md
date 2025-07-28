# summary

Delete an app.

# description

Delete an orchestrated app from your org.

You can identify the app to delete by either its unique ID or its name. App IDs are guaranteed to be unique, while app names should be unique within an org. The command prompts for confirmation before deletion unless you use the --no-prompt flag.

Deleting an app removes it Tableau Next and makes it unavailable to users. Any dashboards, visualizations, data assets, or other components that depend on this app may be affected. Consider the impact on your users and any dependent systems before proceeding.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkManageApp user permission to delete apps. You can only delete apps that exist in the target org.

# flags.target-org.summary

Login username or alias for the target org. Not required if the `target-org` configuration variable is already set.

# flags.api-version.summary

Override the API version used for orchestrator API requests.

# flags.api-version.description

Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.app-id.summary

ID of the app to delete.

# flags.app-name.summary

Name of the app to delete.

# flags.no-prompt.summary

Don't prompt for confirmation.

# flags.no-prompt.description

Skip the confirmation prompt before deleting the app. Use this flag carefully, especially in scripts or automation, as app deletion cannot be undone. This flag is useful for CI/CD pipelines and automated processes.

# noAppSpecified

No app specified for deletion. You must specify either an app ID with --app-id or an app name with --app-name.

# fetchingApp

Fetching app details...

# deletingApp

Deleting app...

# noAppFound

No app found with the specified ID or name.

# confirmDelete

Are you sure you want to delete the app '%s'? This action can't be undone.

# deleteCancelled

App deletion cancelled.

# deleteSuccess

Successfully deleted app with ID: %s.

# error.MissingRequiredFlag

Either --app-id or --app-name must be provided.

# error.MissingRequiredFlag.Actions

- Use --app-id to specify an app by its unique ID.
- Use --app-name to specify an app by its name.
- Get app IDs and names using "sf orchestrator app list".

# error.AppNotFound

App "%s" not found.

# error.AppNotFound.Actions

- Verify the app ID or name is correct.
- Use "sf orchestrator app list" to see available apps.
- Check your permissions to view apps.
- Make sure you're connected to the correct org with --target-org.

# error.DeleteError

Failed to delete app: %s.

# error.DeleteError.Actions

- Verify that you have permission to delete apps in the target org.
- Check that the app exists and is accessible.
- Ensure Data Cloud and Tableau Next are enabled in your org.
- Try using a different API version with --api-version.
- Verify your authentication and org connection are valid.

# error.InsufficientPermissions

You don't have permission to delete apps in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce admin to request app deletion permissions.
- Verify you're connected to the correct org with --target-org.
- Ensure Data Cloud and Tableau Next are enabled in your org.
- Check that your user profile has the AppFrameworkManageApp permission.

# error.AppInUse

Can't delete app: It's currently in use by active processes.

# error.AppInUse.Actions

- Wait for any active processes using this app to complete.
- Check which processes are using this app.
- Consider stopping dependent processes before deletion.
- Try again after active processes have finished.

# error.MultipleAppsFound

Multiple apps found with name "%s".

# error.MultipleAppsFound.Actions

- Use --app-id instead of --app-name for unique identification.
- Get the specific app ID using "sf orchestrator app list".
- App names should be unique, but this org may have duplicates.

# error.InvalidAppId

App ID "%s" is not valid.

# error.InvalidAppId.Actions

- Verify the app ID format is correct.
- Get valid app IDs using "sf orchestrator app list".
- App IDs should be 15 or 18 character Salesforce IDs.

# examples

- Delete an app by ID with confirmation prompt:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 01t000000000123

- Delete an app by name with confirmation prompt:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "My App"

- Delete an app without confirmation prompt:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 01t000000000123 --no-prompt

- Delete an app with a name containing spaces:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "Sales Analytics App"

- Delete an app in a specific org with API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --app-id 01t000000000123 --api-version 60.0
