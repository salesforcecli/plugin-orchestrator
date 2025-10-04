# summary

Upgrade an app using template chains.

# description

Upgrade an existing orchestrated app by running its template's upgrade chains. This command allows you to apply template updates, reconfigure the app with new template values, and modify runtime settings while staying within the same template.

You can identify the app by either its unique ID or its name. App IDs are guaranteed to be unique, while names should be unique within an org.

Use this command to run template-defined upgrade workflows that can update app configurations, apply new template versions, or reconfigure template values. This is different from the update command which only changes basic metadata like label and description.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkManageApp user permission to modify apps. The template ID must match the app's current template - you cannot change the underlying template an app is based on.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for upgrading the app.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for orchestrator API requests. Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.app-id.summary

ID of the app to upgrade.

# flags.app-id.description

The unique identifier of the app to upgrade.

# flags.app-name.summary

Name of the app to upgrade.

# flags.app-name.description

The name of the app to upgrade.

# flags.template-id.summary

ID of the template to use for the upgrade.

# flags.template-id.description

The unique identifier of the template to use for upgrading the app. This must match the app's current template ID. Template upgrades run the template's defined upgrade chains to reconfigure or update the app. Use "sf orchestrator template list" to find available template IDs.

# flags.template-values.summary

Template-specific configuration values as JSON.

# flags.template-values.description

A JSON object containing template-specific configuration values to pass to the upgrade chain. The available values depend on the template's variable definitions. For example: '{"dataSource":"mySource","refreshInterval":30}'. These values customize how the template upgrade chain configures the app.

# flags.runtime-method.summary

Runtime method for the upgrade execution.

# flags.runtime-method.description

Specifies how the upgrade chain should be executed. Use 'sync' for synchronous execution (wait for completion) or 'async' for asynchronous execution (run in background). This affects how long the command takes to complete and how errors are handled.

# flags.log-level.summary

Log level for the upgrade execution.

# flags.log-level.description

Sets the logging level for the upgrade chain execution. Higher levels provide more diagnostic information: 'debug' (most verbose), 'info' (normal), 'warn' (warnings only), or 'error' (errors only). Use 'debug' when troubleshooting upgrade issues.

# flags.chain-name.summary

Specific chain name to execute for the upgrade.

# flags.chain-name.description

The name of the specific upgrade chain to execute. If not specified, the template's default upgrade chain will be used. Different chains may perform different types of upgrades or configurations within the same template.

# noAppSpecified

No app specified for upgrade. You must specify either an app ID with --app-id or an app name with --app-name.

# noAppFound

No app found with the specified ID or name.

# invalidTemplateValues

Invalid template values JSON. Please provide a valid JSON object for --template-values.

# fetchingApp

Fetching app details...

# upgradingApp

Upgrading app...

# upgradeSuccess

Successfully upgraded app: %s

# error.UpgradeError

Failed to upgrade app: %s

# error.UpgradeError.Actions

- Verify that you have permission to modify apps in the target org
- Check that the app exists and is accessible
- Ensure the template ID matches the app's current template
- Verify the template values are valid JSON and match expected variables
- Check that Data Cloud and Tableau Next are enabled in your org
- Try using a different API version with --api-version
- Verify your authentication and org connection are valid

# examples

- Upgrade an app with its current template:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 1zAxx000000000123 --template-id 1zDxx000000001EAA

- Upgrade an app with new template values:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-name "My App" --template-id 1zDxx000000001EAA --template-values '{"dataSource":"newSource","refreshInterval":60}'

- Upgrade an app with async execution:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 1zAxx000000000123 --template-id 1zDxx000000001EAA --runtime-method async --log-level debug

- Upgrade an app using a specific chain:

  <%= config.bin %> <%= command.id %> --target-org myOrg --app-id 1zAxx000000000123 --template-id 1zDxx000000001EAA --chain-name "UpdateConfiguration"
