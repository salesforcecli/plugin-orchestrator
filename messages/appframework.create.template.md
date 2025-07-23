# summary

Create a new AppFramework template.

# description

Create a new AppFramework template that can be used as a blueprint for building AppFramework applications. Templates allow you to define reusable configurations, layouts, and settings that can be shared across multiple applications.

Once created, templates appear in the Analytics Studio UI where developers can use them to create new applications. Templates help standardize application development and ensure consistency across your organization.

You must have AppFramework enabled in your org and appropriate permissions to create templates. The template name must be unique within your org. This command works with production orgs, sandboxes, and scratch orgs that have AppFramework configured.

# examples

- Create a basic app template:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "my_template"

- Create a template with a label for better identification:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "sales_template" --label "Sales Analytics Template"

- Create a dashboard template with a specific subtype:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "dashboard_template" --type dashboard --subtype "analytics"

- Create a comprehensive template with all metadata:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "analytics_template" --type app --subtype "tableau" --label "Sales Template" --description "Template for sales analytics apps"

- Create a template using a specific API version:

  <%= config.bin %> <%= command.id %> --target-org myOrg --name "legacy_template" --api-version 60.0

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for creating the template. This org must have AppFramework enabled and you must have appropriate permissions to create templates.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for API requests to the AppFramework. Use this flag to specify a particular API version when the default version doesn't work with your org's AppFramework configuration.

# flags.name.summary

Name for the new template.

# flags.name.description

A unique identifier for the template. Must be unique within your org. Use descriptive names that help identify the template's purpose. Template names should follow your organization's naming conventions.

# flags.type.summary

Type of template to create.

# flags.type.description

Specifies the type of template to create. Valid options are: app, component, dashboard, or lens. Defaults to 'app' if not specified. Choose the type that matches your intended use case for the template.

# flags.subtype.summary

Subtype for the template.

# flags.subtype.description

An optional subtype categorization for the template (e.g., 'tableau' for app templates). Subtypes help organize templates and provide additional context about their intended use or underlying technology.

# flags.label.summary

Label for the new template.

# flags.label.description

A human-readable label for the template. This is displayed in the Analytics Studio UI and helps users identify the template's purpose. Use clear, descriptive labels that explain what the template does.

# flags.description.summary

Description of the new template.

# flags.description.description

A description of what the template does and its intended use case. This is displayed in the Analytics Studio UI and helps users understand when to use this template. Include information about the template's purpose, features, and any prerequisites.

# fetchingApp

Fetching app information...

# creatingTemplate

Creating template from app...

# createSuccess

Successfully created template with ID: %s

# error.TemplateCreationError

Error creating AppFramework template: %s

# error.TemplateCreationError.Actions

- Verify that you have permission to create templates in the target org
- Ensure the template name is unique within your org
- Check that AppFramework is enabled in your org
- Verify your authentication and org connection are valid
- Try using a different API version with --api-version

# error.InvalidTemplateName

Template name "%s" is invalid or already exists.

# error.InvalidTemplateName.Actions

- Choose a unique name that doesn't exist in your org
- Ensure the name follows your organization's naming conventions
- Use "sf orchestrator template list" to see existing template names
- Avoid special characters and spaces in template names

# error.InsufficientPermissions

You don't have permission to create templates in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce administrator to request template creation permissions
- Verify you're connected to the correct org with --target-org
- Ensure AppFramework is enabled in your org
- Check that your user profile has the necessary AppFramework permissions
