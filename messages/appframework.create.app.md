# summary

Create a new app from a template.

# description

Create a new orchestrated app using an existing template as the foundation. The app is initialized with the configuration, structure, and settings defined in the template, providing a quick start for app development.

You can identify the template to use by either its unique ID or its name. Template IDs are guaranteed to be unique, while template names should be unique within an org. The new app inherits the template's configuration, but can be customized independently after creation.

Use this command to quickly create apps with consistent configurations and accelerate your development workflow. The created app assets appear in Data Cloud and Tableau Next where you can customize as needed. You can manage the app from the App Install History page in Setup.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkManageApp user permission to create apps. Both the template and the new app must be in the same org.

# examples

- Create an app from a template by ID:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "my_app" --template-id 01t000000000123

- Create an app from a template by name:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "sales_app" --template-name "Sales_Template"

- Create an app with a custom label and description:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "analytics_app" --template-name "Analytics_Template" --label "My Analytics App" --description "Custom analytics app"

- Create an app with specific runtime configuration:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "dashboard_app" --template-id 01t000000000456 --runtime-method async --log-level debug

- Create an app using a specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --name "test_app" --template-name "Test Template" --api-version 60.0

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for creating the app. This org must have Data Cloud and Tableau Next enabled and you must have the AppFrameworkManageApp user permission to create apps. The template must also exist in this org.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for orchestrator API requests. Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.name.summary

Name for the new app.

# flags.name.description

A unique identifier for the app. Must be unique within your org. Use descriptive names that help identify the app's purpose. App names should follow your org's naming conventions.

# flags.label.summary

Label for the new app.

# flags.label.description

A human-readable label for the app. This is displayed on the App Install History setup page and helps users identify the app's purpose. If not provided, the name will be used as the label.

# flags.description.summary

Description of the new app.

# flags.description.description

A description of what the app does and its intended use case. This helps users understand the app's purpose and functionality. The description appears on the App Install History page.

# flags.template-id.summary

ID of the template to use for creating the app.

# flags.template-id.description

The unique identifier of the template to use for generating the new app.

# flags.template-name.summary

Name of the template to use for creating the app.

# flags.template-name.description

The name of the template to use for generating the new app.

# flags.runtime-method.summary

Runtime method for the app.

# flags.runtime-method.description

Specifies the runtime method for the app execution. This affects how the app processes data and handles user interactions. Valid values are 'sync' and 'async'.

# flags.log-level.summary

Log level for the app.

# flags.log-level.description

Sets the logging level for the app. This controls how much diagnostic information is captured during app execution. Valid values are 'debug', 'info', 'warn', and 'error'.

# noTemplateSpecified

No template specified. You must specify either a template ID with --template-id or a template name with --template-name.

# fetchingTemplate

Fetching template details...

# creatingApp

Creating app from template...

# createSuccess

Successfully created app with ID: %s

# error.MissingRequiredFlag

Either --template-id or --template-name must be provided.

# error.MissingRequiredFlag.Actions

- Use --template-id to specify a template by its unique ID
- Use --template-name to specify a template by its name
- Get template IDs and names using "sf orchestrator template list"

# error.TemplateNotFound

Template not found.

# error.TemplateNotFound.Actions

- Verify the template ID or name is correct
- Use "sf orchestrator template list" to see available templates
- Check your permissions to view templates
- Make sure you're connected to the correct org with --target-org

# error.AppCreationError

Failed to create app: %s

# error.AppCreationError.Actions

- Verify that you have permission to create apps in the target org
- Ensure the app name is unique within your org
- Check that Data Cloud and Tableau Next are enabled in your org
- Verify your authentication and org connection are valid
- Try using a different API version with --api-version

# error.InvalidAppName

App name "%s" is invalid or already exists.

# error.InvalidAppName.Actions

- Choose a unique name that doesn't exist in your org
- Ensure the name follows your org's naming conventions
- Use "sf orchestrator app list" to see existing app names
- Avoid special characters and spaces in app names

# error.InsufficientPermissions

You don't have permission to create apps in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce admin to request app creation permissions
- Verify you're connected to the correct org with --target-org
- Check that Data Cloud and Tableau Next are enabled in your org
- Check that your user profile has the AppFrameworkManageApp user permission
