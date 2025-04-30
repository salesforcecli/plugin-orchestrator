# summary

Decouple an AppFramework app from its template.

# description

Decouples an AppFramework app from its template. This allows the app to be modified independently without being affected by template updates. You must specify either the app-id or app-name flag to identify the app to decouple.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

Overrides your default org.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

Override the api version used for api requests made by this command.

# flags.app-id.summary

ID of the app to decouple.

# flags.app-id.description

Specify the ID of the app to decouple. Either this or app-name is required.

# flags.app-name.summary

Name of the app to decouple.

# flags.app-name.description

Specify the name of the app to decouple. Either this or app-id is required.

# noAppSpecified

No app specified for decoupling. You must specify either an app ID with --app-id or an app name with --app-name.

# fetchingApp

Fetching app details...

# decouplingApp

Decoupling app from template...

# noAppFound

No app found with the specified ID or name.

# noTemplateFound

The specified app does not have an associated template to decouple from.

# decoupleSuccess

Successfully decoupled app: %s

# error.DecoupleError

Failed to decouple app: %s

# error.DecoupleError.Actions

- Check that the app ID or name is correct
- Verify the app is associated with a template
- Ensure you have permissions to decouple apps in this org
- Try running with --debug for more details

# examples

- Decouple an app by ID:
  <%= config.bin %> <%= command.id %> --app-id 00Dxx0000000001

- Decouple an app by name:
  <%= config.bin %> <%= command.id %> --app-name "My App"
