# summary

Update an app with a new template.

# description

Update an existing orchestrated app by associating it with a new template or modifying its properties. This command allows you to change the template that an app is based on, update its metadata (label, description), or modify runtime configuration settings.

You can identify the app by either its unique ID or its name, and specify the new template by either its unique ID or its name. App and template IDs are guaranteed to be unique, while names should be unique within an org.

Updating an app with a new template changes the app's underlying structure and configuration to match the new template. This is useful for migrating apps to updated templates or changing an app's functionality. You can also update just the app's metadata without changing the template.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkManageApp user permission to modify applications. Both the app and template must exist in the same org.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for updating the application. This org must have Data Cloud and Tableau Next enabled and you must have the AppFrameworkManageApp user permission to modify applications. Both the app and template must exist in this org.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for orchestrator API requests. Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.app-id.summary

ID of the app to update.

# flags.app-id.description

The unique identifier of the app to update.

# flags.app-name.summary

Name of the app to update.

# flags.app-name.description

The name of the app to update.

# flags.template-id.summary

ID of the template to use for the update.

# flags.template-id.description

The unique identifier of the template to use for updating the app. Template IDs are guaranteed to be unique within an org. Either --template-id or --template-name is required when updating the app's template. Use "sf orchestrator template list" to find available template IDs.

# flags.template-name.summary

Name of the template to use for the update.

# flags.template-name.description

The name of the template to use for updating the app. Template names should be unique within an org. Either --template-id or --template-name is required when updating the app's template. If the name contains spaces, enclose it in quotes.

# flags.label.summary

New label for the app.

# flags.label.description

A new display label for the app. This is the human-readable name shown to users on the App Install History page. The label helps users identify and select the appropriate app. Use clear, descriptive labels that explain the app's purpose.

# flags.description.summary

New description for the app.

# flags.description.description

A new description for the app. This provides detailed information about the app's purpose, features, and intended use cases. The description appears on the App Install History page and helps users understand when and how to use the app effectively

# flags.runtime-method.summary

Runtime method for the app.

# flags.runtime-method.description

Specifies the runtime method for the app execution. This affects how the app processes data and handles user interactions. Valid values are 'sync' and 'async'. This setting overrides the app's default runtime method.

# flags.log-level.summary

Log level for the app.

# flags.log-level.description

Sets the logging level for the app. This controls how much diagnostic information is captured during app execution. Valid values are 'debug', 'info', 'warn', and 'error'. This setting overrides the app's default log level.

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

# error.MissingRequiredFlag

Either --app-id or --app-name must be provided.

# error.MissingRequiredFlag.Actions

- Use --app-id to specify an app by its unique ID
- Use --app-name to specify an app by its name
- Get app IDs and names using "sf orchestrator app list"

# error.AppNotFound

App "%s" not found.

# error.AppNotFound.Actions

- Verify the app ID or name is correct
- Use "sf orchestrator app list" to see available apps
- Check your permissions to view apps
- Make sure you're connected to the correct org with --target-org

# error.TemplateNotFound

Template "%s" not found.

# error.TemplateNotFound.Actions

- Verify the template ID or name is correct
- Use "sf orchestrator template list" to see available templates
- Check your permissions to view templates
- Make sure you're connected to the correct org with --target-org

# error.NoUpdatesProvided

No updates provided. You must specify at least one property to update.

# error.NoUpdatesProvided.Actions

- Use --template-id or --template-name to change the app's template
- Use --label to update the app's display label
- Use --description to update the app's description
- Use --runtime-method or --log-level to update runtime configuration
- Specify at least one property to modify

# error.UpdateError

Failed to update app: %s

# error.UpdateError.Actions

- Verify that you have permission to modify apps in the target org
- Check that both the app and template exist and are accessible
- Ensure Data Cloud and Tableau Next are enabled in your org
- Try using a different API version with --api-version
- Verify your authentication and org connection are valid

# error.InsufficientPermissions

You don't have permission to update apps in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce admin to request app modification permissions
- Verify you're connected to the correct org with --target-org
- Ensure Data Cloud and Tableau Next are enabled in your org
- Check that your user profile has the AppFrameworkManageApp user permission

# examples

- Update an app to use a new template by ID:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 01t000000000123 --template-id 01t000000000456

- Update an app to use a new template by name:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "My App" --template-name "New Template"

- Update an app with a new label and description:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 01t000000000123 --label "Updated App" --description "Updated description for the app"

- Update an app with new template and runtime configuration:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "analytics_app" --template-name "Analytics Template" --runtime-method async --log-level debug

- Update an app using a specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --app-id 01t000000000123 --template-id 01t000000000789 --api-version 60.0
