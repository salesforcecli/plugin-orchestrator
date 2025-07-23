# summary

List all available AppFramework templates in the target org.

# description

AppFramework templates are reusable configurations that define the structure and settings for creating AppFramework applications. Use this command to discover available templates in your org before creating new apps.

Templates are displayed in a table format showing their name, label, ID, type, and other metadata. This information helps you choose the right template for your AppFramework application development.

You must have AppFramework enabled in your org and appropriate permissions to view templates. This command works with production orgs, sandboxes, and scratch orgs that have AppFramework configured.

# examples

- List all AppFramework templates in your default org:

  <%= config.bin %> <%= command.id %>

- List templates in a specific org:

  <%= config.bin %> <%= command.id %> --target-org myOrg

- List templates using a specific API version:

  <%= config.bin %> <%= command.id %> --api-version 64.0

- List templates in a sandbox org with a specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --api-version 60.0

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for listing templates. This org must have AppFramework enabled and you must have appropriate permissions to view templates.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for API requests to the AppFramework. Use this flag to specify a particular API version when the default version doesn't work with your org's AppFramework configuration.

# templatesFound

Found %s AppFramework templates:

# noResultsFound

No AppFramework templates found.

# fetchingTemplates

Fetching AppFramework templates...

# templateTypeLegend

Legend: %s, %s, %s - Other template types

# error.CertificateError

Error retrieving AppFramework templates: Certificate validation error.

# error.CertificateError.Actions

- This appears to be a certificate validation issue, which is common in dev environments
- Try specifying the API version with --api-version=64.0 (or your org's version)
- Make sure you're using the correct org with --target-org YOUR_ORG_ALIAS
- If using a sandbox or scratch org, ensure your connection is properly authenticated

# error.AuthenticationError

Error retrieving AppFramework templates: Authentication issue.

# error.AuthenticationError.Actions

- Your session may have expired or you may not have permission to access this resource
- Try running "sf org login web" to reauthenticate
- Ensure you have AppFramework enabled and have permission to view templates
- Verify the target org is correct and accessible

# error.GenericError

Error retrieving AppFramework templates: %s

# error.GenericError.Actions

- Verify that you are using an org with AppFramework enabled
- Check that your credentials and permissions are valid
- Check your internet connection
- Try running "sf org login web" to reauthenticate
- Ensure the target org has AppFramework properly configured
