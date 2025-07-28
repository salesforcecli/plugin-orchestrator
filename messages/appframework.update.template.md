# summary

Update an existing template.

# description

Update the metadata and properties of an existing template. Use this command to modify the template's label, description, and other properties to keep your templates current and well-documented.

You can identify the template to update by either its unique ID or its name. Template IDs are guaranteed to be unique, while template names should be unique within an org. You can update one or more properties in a single command.

Template updates are useful for maintaining accurate documentation, improving template discoverability, and ensuring templates remain relevant as your org's needs evolve. Updated templates immediately reflect changes in Tableau Next.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkModifyApp user permission to modify templates. You can only update templates that exist in the target org.

# examples

- Update a template's label by ID:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-id 0XtB000000001aXYAQ --label "New Display Label"

- Update a template's description by name:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-name MyTemplate --description "Updated template description"

- Update both label and description:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-id 0XtB000000001aXYAQ --label "Sales Analytics Template" --description "Template for comprehensive sales reporting and analytics"

- Update a template in a specific org with API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --template-name "Dashboard Template" --label "Executive Dashboard" --api-version 60.0

- Update a template with a name containing spaces:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-name "Sales Analytics Template" --description "Enhanced template for sales team analytics"

# flags.target-org.summary

Login username or alias for the target org. Not required if the `target-org` configuration variable is already set.

# flags.api-version.summary

Override the API version used for orchestrator API requests.

# flags.api-version.description

Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.template-id.summary

ID of the template to update.

# flags.template-id.description

Template IDs are guaranteed to be unique within an org. Use this flag when you know the template's ID, which you can get from "sf orchestrator template list" command. Either --template-id or --template-name is required.

# flags.template-name.summary

Name of the template to update.

# flags.template-name.description

Template names should be unique within an org. Use this flag when you know the template's name but not its ID. If the name contains spaces, enclose it in quotes. Either --template-id or --template-name is required.

# flags.label.summary

New label for the template.

# flags.label.description

This label is the human-readable name shown to users in Tableau Next. The label helps users identify and select the appropriate template when creating apps.

# flags.description.summary

New description for the template.

# flags.description.description

The description appears in Tableau Next and helps users understand when and how to use the template effectively.

# fetchingTemplate

Fetching template information...

# updatingTemplate

Updating template...

# updateSuccess

Successfully updated template '%s' (ID: %s).

# missingRequiredField

You must provide either --template-id or --template-name.

# error.MissingRequiredField.Actions

- Use --template-id to specify a template by its unique ID.
- Use --template-name to specify a template by its name.
- Get template IDs and names using "sf orchestrator template list".

# error.TemplateNotFound

Template "%s" not found.

# error.TemplateNotFound.Actions

- Verify that you have the correct template ID or name.
- Ensure the template exists in this org using "sf orchestrator template list".
- Check your permissions to view and modify templates.
- Make sure you're connected to the correct org with --target-org.

# error.InsufficientPermissions

You don't have permission to update templates in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce admin to request template modification permissions.
- Verify you're connected to the correct org with --target-org.
- Ensure Data Cloud and Tableau Next are enabled in your org.
- Check that your user profile has the AppFrameworkModifyApp user permission.

# error.NoUpdatesProvided

No updates provided. You must specify at least one property to update.

# error.NoUpdatesProvided.Actions

- Use --label to update the template's display label.
- Use --description to update the template's description.
- Specify at least one property to modify.

# error.UpdateFailed

Failed to update template: %s.

# error.UpdateFailed.Actions

- Verify that you have permission to modify templates in the target org.
- Check that the template exists and is accessible.
- Ensure Data Cloud and Tableau Next are enabled in your org.
- Try using a different API version with --api-version.
- Verify your authentication and org connection are valid.

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
