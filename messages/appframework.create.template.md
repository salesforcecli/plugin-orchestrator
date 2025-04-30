# summary

Create a new AppFramework template.

# description

Creates a new empty template that can be customized. Templates allow you to define reusable configurations for AppFramework applications.

# flags.target-org.summary

Login username or alias for the target org

# flags.target-org.description

The target org to connect to for creating the template.

# flags.api-version.summary

Override the api version used for api requests

# flags.api-version.description

Override the api version used for api requests to the app framework.

# flags.name.summary

Name for the new template (required)

# flags.name.description

A unique identifier for the template. Must be unique within your org.

# flags.type.summary

Type of template to create

# flags.type.description

Specifies the type of template to create. Valid options are: app, component, dashboard, or lens. Defaults to 'app' if not specified.

# flags.subtype.summary

Subtype for the template

# flags.subtype.description

An optional subtype categorization for the template (e.g., 'tableau' for app templates).

# flags.label.summary

Label for the new template

# flags.label.description

A human-readable label for the template. This is displayed in the Analytics Studio UI.

# flags.description.summary

Description of the new template

# flags.description.description

A description of what the template does. This is displayed in the Analytics Studio UI.

# fetchingApp

Fetching app information...

# creatingTemplate

Creating template from app...

# createSuccess

Successfully created template with ID: %s

# examples

- <%= config.bin %> <%= command.id %> --target-org myOrg --name "my_template"
- <%= config.bin %> <%= command.id %> --target-org myOrg --name "sales_template" --type app --label "My Custom Template"
- <%= config.bin %> <%= command.id %> --target-org myOrg --name "dashboard_template" --type dashboard --subtype "analytics"
- <%= config.bin %> <%= command.id %> --target-org myOrg --name "analytics_template" --type app --subtype "tableau" --label "Sales Template" --description "Template for sales analytics apps"
