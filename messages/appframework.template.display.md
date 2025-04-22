# summary

Display details of an AppFramework template.

# description

Shows detailed information about a specific AppFramework template including its name, label, ID, type, and other properties.

# flags.template-id.summary

The ID of the template to display.

# flags.template-id.description

Specify the unique identifier of the template you want to display. Use this flag when you know the template's ID.

# flags.template-name.summary

The name of the template to display.

# flags.template-name.description

Specify the name of the template you want to display. Use this flag when you know the template's name but not its ID.

# flags.target-org.summary

Login username or alias for the target org

# flags.target-org.description

The target org to connect to for displaying the template.

# flags.api-version.summary

Override the api version used for api requests

# flags.api-version.description

Override the api version used for api requests to the app framework.

# fetchingTemplate

Fetching AppFramework template...

# error.MissingRequiredFlag

Either --template-id or --template-name must be provided

# error.MissingRequiredFlag.Actions

- Use --template-id to specify a template by ID
- Use --template-name to specify a template by name

# error.CertificateError

Error retrieving AppFramework template: Certificate validation error

# error.CertificateError.Actions

- This appears to be a certificate validation issue, which is common in dev environments
- Try specifying the API version with --api-version=64.0 (or your org's version)
- Make sure you're using the correct org with -o YOUR_ORG_ALIAS
- If using a sandbox or scratch org, ensure your connection is properly authenticated

# error.AuthenticationError

Error retrieving AppFramework template: Authentication issue

# error.AuthenticationError.Actions

- Your session may have expired or you may not have permission to access this resource
- Try running sf org refresh to update your credentials
- Ensure you have AppFramework enabled and have permission to view templates

# error.TemplateNotFound

Template %s not found

# error.TemplateNotFound.Actions

- Verify that you have the correct template ID or name
- Ensure the template exists in this org
- Check your permissions to view templates

# error.GenericError

Error retrieving AppFramework template: %s

# error.GenericError.Actions

- Verify that you are using an org with AppFramework enabled
- Check that the template ID or name is correct
- Check your credentials and permissions
- Try running sf org refresh to update your credentials

# examples

- Display a template using its ID:
  <%= config.bin %> <%= command.id %> --template-id 01RM0000000HwBGMA0
- Display a template using its name:
  <%= config.bin %> <%= command.id %> --template-name MyTemplate
