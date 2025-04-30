# summary

List all available AppFramework templates in the target org.

# description

Lists AppFramework templates available in the target org. Shows template name, label, ID and other information.

# flags.target-org.summary

Login username or alias for the target org

# flags.target-org.description

The target org to connect to for listing templates.

# flags.api-version.summary

Override the api version used for api requests

# flags.api-version.description

Override the api version used for api requests to the app framework.

# templatesFound

Found %s AppFramework templates:

# noResultsFound

No AppFramework templates found.

# fetchingTemplates

Fetching AppFramework templates...

# templateTypeLegend

Legend: %s - Application templates, %s - Component templates, %s - Other template types

# error.CertificateError

Error retrieving AppFramework templates: Certificate validation error

# error.CertificateError.Actions

- This appears to be a certificate validation issue, which is common in dev environments
- Try specifying the API version with --api-version=64.0 (or your org's version)
- Make sure you're using the correct org with -o YOUR_ORG_ALIAS
- If using a sandbox or scratch org, ensure your connection is properly authenticated

# error.AuthenticationError

Error retrieving AppFramework templates: Authentication issue

# error.AuthenticationError.Actions

- Your session may have expired or you may not have permission to access this resource
- Try running sf org refresh to update your credentials
- Ensure you have AppFramework enabled and have permission to view templates

# error.GenericError

Error retrieving AppFramework templates: %s

# error.GenericError.Actions

- Verify that you are using an org with AppFramework enabled
- Check that your credentials and permissions are valid
- Check your internet connection
- Try running sf org refresh to update your credentials

# examples

- List all AppFramework templates in your default org:
  <%= config.bin %> <%= command.id %>
- List templates with a specific API version:
  <%= config.bin %> <%= command.id %> --api-version=64.0
