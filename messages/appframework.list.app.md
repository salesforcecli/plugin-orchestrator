# summary

List AppFramework apps in your org.

# description

Lists all AppFramework apps in your org. You can filter the results by template type and other criteria.

# flags.target-org.summary

Login username or alias for the target org.

# flags.target-org.description

Overrides your default org.

# flags.api-version.summary

Override the api version used for api requests made by this command.

# flags.api-version.description

Override the api version used for api requests made by this command.

# flags.filter-type.summary

Filter apps by template type.

# flags.filter-type.description

Only show apps with the specified template type, such as 'app', 'dashboard', or 'analytics'.

# flags.filter-subtype.summary

Filter apps by template subtype.

# flags.filter-subtype.description

Only show apps with the specified template subtype.

# flags.json.summary

Format output as JSON.

# flags.json.description

Format output as a JSON array of app records.

# flags.csv.summary

Format output as CSV.

# flags.csv.description

Format output as CSV on the specified fields.

# flags.csv-fields.summary

Fields to include when generating CSV output.

# flags.csv-fields.description

Specify a comma-separated list of field API names to include in the CSV output.

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

# examples

- List all AppFramework apps in your default org:
  <%= config.bin %> <%= command.id %>
- List apps with a specific API version:
  <%= config.bin %> <%= command.id %> --api-version=64.0

# noResultsFound

No AppFramework apps found in the org.

# error.CertificateError

Certificate error: Unable to connect to the org. This is typically caused by an SSL certificate error.

# error.CertificateError.Actions

- Check your network connection and try again.
- Ensure that your network is not blocking or intercepting HTTPS requests.
- If you are behind a corporate proxy, ensure that your proxy certificates are properly configured.

# error.AuthenticationError

Authentication error: Unable to authenticate with the org. Please check your credentials and try again.

# error.AuthenticationError.Actions

- Use `sf org login` to log in to the org again.
- Ensure that your user has the necessary permissions to access the AppFramework API.
- Check if your authentication token has expired.

# error.GenericError

An error occurred while listing apps: %s

# error.GenericError.Actions

- Check the error message above for more details.
- Ensure that AppFramework is enabled in your org.
- Ensure that your user has the necessary permissions.
