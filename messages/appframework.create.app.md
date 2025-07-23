# summary

Create a new AppFramework app from a template.

# description

Create a new AppFramework application using an existing template as the foundation. The app will be initialized with the configuration, structure, and settings defined in the template, providing a quick start for application development.

You can identify the template to use by either its unique ID or its name. Template IDs are guaranteed to be unique, while template names should be unique within an org. The new app will inherit the template's configuration but can be customized independently after creation.

This command is useful for quickly creating applications with consistent configurations and accelerating development workflows. The created app appears in the Analytics Studio UI where it can be further customized and deployed.

You must have AppFramework enabled in your org and appropriate permissions to create applications. Both the template and the new app must be in the same org.

# examples

- Create an app from a template by ID:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "my_app" --template-id 01t000000000123

- Create an app from a template by name:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "sales_app" --template-name "Sales_Template"

- Create an app with a custom label and description:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "analytics_app" --template-name "Analytics_Template" --label "My Analytics App" --description "Custom analytics application"

- Create an app with specific runtime configuration:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "dashboard_app" --template-id 01t000000000456 --runtime-method async --log-level debug

- Create an app using a specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --name "test_app" --template-name "Test Template" --api-version 60.0

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for creating the application. This org must have AppFramework enabled and you must have appropriate permissions to create applications. The template must also exist in this org.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for API requests to the AppFramework. Use this flag to specify a particular API version when the default version doesn't work with your org's AppFramework configuration.

# flags.name.summary

Name for the new app.

# flags.name.description

A unique identifier for the app. Must be unique within your org. Use descriptive names that help identify the app's purpose. App names should follow your organization's naming conventions.

# flags.label.summary

Label for the new app.

# flags.label.description

A human-readable label for the app. This is displayed in the Analytics Studio UI and helps users identify the app's purpose. If not provided, the name will be used as the label.

# flags.description.summary

Description of the new app.

# flags.description.description

A description of what the app does and its intended use case. This helps users understand the app's purpose and functionality. The description appears in the Analytics Studio UI.

# flags.template-id.summary

ID of the template to use for creating the app.

# flags.template-id.description

The unique identifier of the template to use as the foundation for the new app. Template IDs are guaranteed to be unique within an org. Either --template-id or --template-name is required. Use "sf orchestrator template list" to find available template IDs.

# flags.template-name.summary

Name of the template to use for creating the app.

# flags.template-name.description

The name of the template to use as the foundation for the new app. Template names should be unique within an org. Either --template-id or --template-name is required. If the name contains spaces, enclose it in quotes.

# flags.runtime-method.summary

Runtime method for the app.

# flags.runtime-method.description

Specifies the runtime method for the app execution. This affects how the app processes data and handles user interactions. Common values include sync and async.

# flags.log-level.summary

Log level for the app.

# flags.log-level.description

Sets the logging level for the app. This controls how much diagnostic information is captured during app execution. Common values include debug, info, warn, and error.

# creatingApp

Creating app from template...

# createSuccess

Successfully created app '%s' with ID: %s

# error.MissingRequiredFlag

Either --template-id or --template-name must be provided.

# error.MissingRequiredFlag.Actions

- Use --template-id to specify a template by its unique ID
- Use --template-name to specify a template by its name
- Get template IDs and names using "sf orchestrator template list"

# error.TemplateNotFound

Template "%s" not found.

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
- Check that AppFramework is enabled in your org
- Verify your authentication and org connection are valid
- Try using a different API version with --api-version

# error.InvalidAppName

App name "%s" is invalid or already exists.

# error.InvalidAppName.Actions

- Choose a unique name that doesn't exist in your org
- Ensure the name follows your organization's naming conventions
- Use "sf orchestrator app list" to see existing app names
- Avoid special characters and spaces in app names

# error.InsufficientPermissions

You don't have permission to create apps in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce administrator to request app creation permissions
- Verify you're connected to the correct org with --target-org
- Ensure AppFramework is enabled in your org
- Check that your user profile has the necessary AppFramework permissions
