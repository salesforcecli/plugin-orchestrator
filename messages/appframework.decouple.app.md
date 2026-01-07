# summary

Decouple an app from its template.

# description

Decouple an existing app from its template, removing all references to the template from the app. This operation makes the app independent and no longer tied to template updates or changes. Once decoupled, the app maintains its current configuration but can be modified independently without affecting the original template.

You must specify the app to decouple using its unique ID. App IDs are guaranteed to be unique and work reliably with the decouple operation.

Use this command when you want to break the relationship between an app and its template, allowing for independent customization without template constraints. After decoupling, the app will no longer receive updates when the template is modified.

You must have the AppFrameworkManageApp user permission to decouple apps. The app must exist in the target org and be currently associated with a template.

# examples

- Decouple an app from its template:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 1zAxx000000004rEAA

- Decouple an app using a specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --app-id 1zAxx000000004rEAA --api-version 60.0

- Find app IDs using the list command first:

  <%= config.bin %> orchestrator app list --target-org myOrg

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org containing the app to decouple. You must have the AppFrameworkManageApp user permission in this org to decouple apps.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for orchestrator API requests. Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.app-id.summary

ID of the app to decouple from its template.

# flags.app-id.description

The unique identifier of the app to decouple from its template. App IDs are guaranteed to be unique within the org and work reliably with the decouple operation. Use "sf orchestrator app list" to find app IDs.

# decouplingApp

Decoupling app from template...

# decoupleSuccess

Successfully decoupled app '%s' from its template.

# error.AppNotFound

App with ID '%s' not found.

# error.AppNotFound.Actions

- Verify the app ID is correct
- Use "sf orchestrator app list" to see available apps and their IDs
- Check your permissions to view apps
- Make sure you're connected to the correct org with --target-org

# error.CannotDecouple

The app '%s' cannot be decoupled from its template. This app may be a source template or doesn't meet the requirements for decoupling.

# error.CannotDecouple.Actions

- Check that this app is not the source template for other apps
- Verify that the app is currently associated with a template (has templateSourceId)
- Ensure you have the AppFrameworkManageApp permission
- Use "sf orchestrator app display --app-id <app-id>" to see app details
- Try decoupling from the app hub interface first

# error.InvalidOperation

The app cannot be decoupled from its template.

# error.InvalidOperation.Actions

- Verify that the app is currently associated with a template
- Check that you have permission to modify apps in the target org
- Ensure the app is not in a state that prevents decoupling
- Try using a different API version with --api-version

# error.GenericError

Failed to decouple app: %s

# error.GenericError.Actions

- Verify that you have permission to modify apps in the target org
- Check your authentication and org connection are valid
- Ensure the app exists and is accessible
- Try using a different API version with --api-version
- Contact your Salesforce admin if the issue persists