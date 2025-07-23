# summary

Display details of an AppFramework app.

# description

Display comprehensive information about a specific AppFramework application including its name, label, ID, type, template association, creation details, and configuration properties. This command is useful for inspecting applications to understand their current state, template relationships, and configuration settings.

You can identify the app by either its unique ID or its name. App IDs are guaranteed to be unique, while app names should be unique within an org. The command displays all available app properties in a formatted, easy-to-read layout.

App information helps you understand the application's current configuration, its template relationship, and any runtime settings that may be applied. This is particularly useful before making updates, troubleshooting issues, or understanding app dependencies.

You must have AppFramework enabled in your org and appropriate permissions to view applications.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for displaying the application. This org must have AppFramework enabled and you must have appropriate permissions to view applications. The application must exist in this org.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for API requests to the AppFramework. Use this flag to specify a particular API version when the default version doesn't work with your org's AppFramework configuration.

# flags.app-id.summary

ID of the app to display.

# flags.app-id.description

The unique identifier of the application to display. App IDs are guaranteed to be unique within an org. Use this flag when you know the app's ID, which you can get from "sf orchestrator app list" command. Either --app-id or --app-name is required.

# flags.app-name.summary

Name of the app to display.

# flags.app-name.description

The name of the application to display. App names should be unique within an org. Use this flag when you know the app's name but not its ID. If the name contains spaces, enclose it in quotes. Either --app-id or --app-name is required.

# noAppSpecified

No app specified. You must specify either an app ID with --app-id or an app name with --app-name.

# fetchingApp

Fetching app details...

# noAppFound

No app found with the specified ID or name.

# error.MissingRequiredFlag

Either --app-id or --app-name must be provided.

# error.MissingRequiredFlag.Actions

- Use --app-id to specify an app by its unique ID
- Use --app-name to specify an app by its name
- Get app IDs and names using "sf orchestrator app list"

# error.AppNotFound

Application "%s" not found.

# error.AppNotFound.Actions

- Verify that you have the correct app ID or name
- Ensure the app exists in this org using "sf orchestrator app list"
- Check your permissions to view applications
- Make sure you're connected to the correct org with --target-org

# error.RetrievalError

Failed to retrieve app details: %s

# error.RetrievalError.Actions

- Verify that you have permission to view applications in the target org
- Check that the app exists and is accessible
- Ensure AppFramework is enabled in your org
- Try using a different API version with --api-version
- Verify your authentication and org connection are valid

# error.InsufficientPermissions

You don't have permission to view applications in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce administrator to request application view permissions
- Verify you're connected to the correct org with --target-org
- Ensure AppFramework is enabled in your org
- Check that your user profile has the necessary AppFramework permissions

# error.MultipleAppsFound

Multiple applications found with name "%s".

# error.MultipleAppsFound.Actions

- Use --app-id instead of --app-name for unique identification
- Get the specific app ID using "sf orchestrator app list"
- App names should be unique, but this org may have duplicates

# error.InvalidAppId

App ID "%s" is not valid.

# error.InvalidAppId.Actions

- Verify the app ID format is correct
- Get valid app IDs using "sf orchestrator app list"
- App IDs should be 15 or 18 character Salesforce IDs

# examples

- Display an app using its ID:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 01t000000000123

- Display an app using its name:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "My App"

- Display an app with a name that contains spaces:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "Sales Analytics App"

- Display an app in a specific org using a particular API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --app-id 01t000000000456 --api-version 60.0

- Display an app by name in your default org:

  <%= config.bin %> <%= command.id %> --app-name "dashboard_app"
