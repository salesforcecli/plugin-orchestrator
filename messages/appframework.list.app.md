# summary

List all AppFramework apps in the target org.

# description

List all AppFramework applications in your org with their key information including name, label, ID, type, and associated template details. This command helps you discover and manage existing applications in your organization.

Applications are displayed in a table format showing their current status, creation details, and template associations. You can use this information to understand your application inventory and make informed decisions about application management.

You must have AppFramework enabled in your org and appropriate permissions to view applications. This command works with production orgs, sandboxes, and scratch orgs that have AppFramework configured.

# examples

- List all AppFramework apps in your default org:

  <%= config.bin %> <%= command.id %>

- List apps in a specific org:

  <%= config.bin %> <%= command.id %> --target-org myOrg

- List apps using a specific API version:

  <%= config.bin %> <%= command.id %> --api-version 64.0

- List apps in a sandbox org with specific API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --api-version 60.0

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

The target org to connect to for listing applications. This org must have AppFramework enabled and you must have appropriate permissions to view applications.

# flags.api-version.summary

Override the API version used for API requests.

# flags.api-version.description

Override the API version used for API requests to the AppFramework. Use this flag to specify a particular API version when the default version doesn't work with your org's AppFramework configuration.

# fetchingApps

Fetching apps from AppFramework. This might take a moment...

# noAppsFound

No AppFramework apps found in the org.

# emptyFilteredApps

No apps found matching the specified filters.

# error.ListError

Failed to list apps: %s

# error.ListError.Actions

- Verify you have permissions to view apps in this org
- Ensure your authentication to the org is valid
- Try running with --debug for more details

# noResultsFound

No AppFramework apps found in the org.

# error.CertificateError

Certificate error: Unable to connect to the org. This is typically caused by an SSL certificate error.

# error.CertificateError.Actions

- Check your network connection and try again
- Ensure that your network is not blocking or intercepting HTTPS requests
- If you are behind a corporate proxy, ensure that your proxy certificates are properly configured
- Try specifying the API version with --api-version

# error.AuthenticationError

Authentication error: Unable to authenticate with the org. Please check your credentials and try again.

# error.AuthenticationError.Actions

- Use "sf org login web" to log in to the org again
- Ensure that your user has the necessary permissions to access the AppFramework API
- Check if your authentication token has expired
- Verify the target org is correct and accessible

# error.GenericError

An error occurred while listing apps: %s

# error.GenericError.Actions

- Check the error message above for more details
- Ensure that AppFramework is enabled in your org
- Ensure that your user has the necessary permissions
- Try running "sf org login web" to reauthenticate
