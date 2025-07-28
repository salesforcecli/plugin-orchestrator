# summary

Display details about a template.

# description

Display comprehensive information about a specific template including its name, label, ID, type, subtype, description, and other metadata properties. Use this command to inspect templates before using them to create apps or for understanding template configurations.

You can identify a template by either its unique ID or its name. Template IDs are guaranteed to be unique, while template names should be unique within an org. The command displays all available template properties in a formatted, easy-to-read layout.

Template information helps you understand what the template provides, its intended use case, and how to use it effectively when creating orchestrated apps. You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkViewApp user permission to view templates.

# examples

- Display a template using its ID:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-id 01RM0000000HwBGMA0

- Display a template using its name:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-name "MyTemplate"

- Display a template with a name that contains spaces:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-name "Sales Analytics Template"

- Display a template in a specific org using a particular API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --template-id 01RM0000000HwBGMA0 --api-version 60.0

- Display a template by name in your default org:

  <%= config.bin %> <%= command.id %> --template-name dashboard_template

# flags.template-id.summary

ID of the template to display.

# flags.template-id.description

Template IDs are guaranteed to be unique within an org. Use this flag when you know the template's ID, which you can get from "sf orchestrator template list" command. Either --template-id or --template-name is required.

# flags.template-name.summary

The name of the template to display.

# flags.template-name.description

Template names should be unique within an org. Use this flag when you know the template's name but not its ID. If the name contains spaces, enclose it in quotes. Either --template-id or --template-name is required.

# flags.target-org.summary

Login username or alias for the target org. Not required if the `target-org` configuration variable is already set.

# flags.api-version.summary

Override the API version used for orchestrator API requests.

# flags.api-version.description

Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# fetchingTemplate

Fetching template...

# error.MissingRequiredFlag

Either --template-id or --template-name must be provided.

# error.MissingRequiredFlag.Actions

- Use --template-id to specify a template by its unique ID.
- Use --template-name to specify a template by its name.
- Get template IDs and names using "sf orchestrator template list".

# error.CertificateError

Error retrieving template: Certificate validation error.

# error.CertificateError.Actions

- This appears to be a certificate validation issue, which is common in dev environments.
- Try specifying the API version with --api-version=64.0 (or your org's version).
- Make sure you're using the correct org with --target-org YOUR_ORG_ALIAS.
- If using a sandbox or scratch org, ensure your connection is properly authenticated.

# error.AuthenticationError

Error retrieving template: Authentication issue.

# error.AuthenticationError.Actions

- Your session may have expired or you may not have permission to access this resource.
- Try running "sf org login web" to reauthenticate.
- Ensure you have Tableau Next enabled and have permission to view templates.
- Verify the target org is correct and accessible.

# error.TemplateNotFound

Template "%s" not found.

# error.TemplateNotFound.Actions

- Verify that you have the correct template ID or name.
- Ensure the template exists in this org using "sf orchestrator template list".
- Check your permissions to view templates.
- Make sure you're connected to the correct org with --target-org.

# error.GenericError

Error retrieving template: %s.

# error.GenericError.Actions

- Verify that you are using an org with Data Cloud and Tableau Next enabled.
- Check that the template ID or name is correct.
- Ensure you have permission to view templates.
- Try running "sf org login web" to reauthenticate.
- Verify the target org has Data Cloud and Tableau Next properly configured.

# error.MultipleTemplatesFound

Multiple templates found with name "%s".

# error.MultipleTemplatesFound.Actions

- Use --template-id instead of --template-name for unique identification.
- Get the specific template ID using "sf orchestrator template list".
- Template names should be unique, but this org may have duplicates.

# error.InvalidTemplateId

Template ID "%s" is not valid.

# error.InvalidTemplateId.Actions

- Verify the template ID format is correct.
- Get valid template IDs using "sf orchestrator template list".
- Template IDs should be 15 or 18 character Salesforce IDs.
