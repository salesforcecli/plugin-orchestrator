# summary

Display details of an AppFramework app.

# description

Display detailed information about a specific AppFramework app. You must specify either the --app-id or --app-name flag to identify the app.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

Overrides your default org.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

Override the api version used for api requests made by this command.

# flags.app-id.summary

ID of the app to display.

# flags.app-id.description

Specify the ID of the app to display. Either this or --app-name is required.

# flags.app-name.summary

Name of the app to display.

# flags.app-name.description

Specify the name of the app to display. Either this or --app-id is required.

# noAppSpecified

No app specified. You must specify either an app ID with --app-id or an app name with --app-name.

# fetchingApp

Fetching app details...

# noAppFound

No app found with the specified ID or name.

# error.RetrievalError

Failed to retrieve app details: %s

# error.RetrievalError.Actions

- Check that the app ID or name is correct
- Verify you have permissions to view apps in this org
- Ensure your authentication to the org is valid
- Try running with --debug for more details

# examples

- Display app details by ID:
  <%= config.bin %> <%= command.id %> --app-id 00Dxx0000000001

- Display app details by name:
  <%= config.bin %> <%= command.id %> --app-name "My App"
