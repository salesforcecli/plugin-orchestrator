# summary

List all available templates in the target org.

# description

Templates are reusable configurations that define the structure and settings for creating orchestrated apps. Use this command to discover available templates in your org before creating new apps.

By default, this command only shows custom templates created in your org. Standard Salesforce-provided templates are filtered out to reduce noise. Use the --all flag to include all templates including the standard ones.

Templates are displayed in a table format showing their name, label, ID, type, and other metadata. This information helps you choose the right template for your orchestrated app development.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkViewApp user permission to view templates. This command works with production orgs, sandboxes, and scratch orgs.

# examples

- List all templates in your default org:

  <%= config.bin %> <%= command.id %>

- List templates in a specific org:

  <%= config.bin %> <%= command.id %> --target-org myOrg

- List templates using a specific API version:

  <%= config.bin %> <%= command.id %> --api-version 64.0

- List templates in a sandbox org with a specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --api-version 60.0

- List all templates including standard Salesforce templates:

  <%= config.bin %> <%= command.id %> --all

- List all templates in a specific org:

  <%= config.bin %> <%= command.id %> --target-org myOrg --all

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for listing templates. This org must have Data Cloud and Tableau Next enabled and you must have the AppFrameworkViewApp user permission to view templates.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for orchestrator API requests. Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.all.summary

Show all templates including standard Salesforce templates.

# flags.all.description

By default, this command only shows custom templates created in your org. Use this flag to include the standard Salesforce-provided templates (those starting with 'sfdc_internal\_\_') in the results.

# templatesFound

Found %s templates:

# noResultsFound

No templates found.

# noCustomTemplatesFound

No custom templates found. Use --all to include standard Salesforce templates.

# fetchingTemplates

Fetching templates...

# templateTypeLegend

Legend: %s, %s, %s - Other template types

# error.CertificateError

Error retrieving templates: Certificate validation error.

# error.CertificateError.Actions

- This appears to be a certificate validation issue, which is common in dev environments
- Try specifying the API version with --api-version=64.0 (or your org's version)
- Make sure you're using the correct org with --target-org YOUR_ORG_ALIAS
- If using a sandbox or scratch org, ensure your connection is properly authenticated

# error.AuthenticationError

Error retrieving templates: Authentication issue.

# error.AuthenticationError.Actions

- Your session may have expired or you may not have permission to access this resource
- Try running "sf org login web" to reauthenticate
- Ensure you have Data Cloud and Tableau Next enabled and have the AppFrameworkViewApp user permission to view templates
- Verify the target org is correct and accessible

# error.GenericError

Error retrieving templates: %s

# error.GenericError.Actions

- Verify that you are using an org with Data Cloud and Tableau Next enabled
- Check that your credentials and permissions are valid
- Check your internet connection
- Try running "sf org login web" to reauthenticate
- Ensure the target org has Data Cloud and Tableau Next properly configured
