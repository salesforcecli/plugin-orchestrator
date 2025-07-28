# summary

Delete a template.

# description

Delete a template from your org. This command provides several options for handling apps that were created from the template.

By default, when you delete a template, any apps created from it remain in your org but lose their association with the template. You can also choose to force delete both the template and all associated apps, or decouple apps before deletion to ensure they continue functioning independently.

This is a destructive operation that can't be undone. The command prompts for confirmation unless you use the --no-prompt flag. Consider carefully which deletion strategy best fits your needs before proceeding.

You must have Data Cloud and Tableau Next enabled in your org and the AppFrameworkManageApp user permission to delete templates. You can only delete templates that exist in the target org.

# examples

- Delete a template by ID (keeps associated apps):

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-id 0XtB000000001aXYAQ

- Delete a template by name with confirmation prompt:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-name "My Template"

- Force delete template and all apps created from it:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-id 0XtB000000001aXYAQ --force-delete

- Delete template without confirmation prompt:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-id 0XtB000000001aXYAQ --no-prompt

- Decouple apps before deleting template:

  <%= config.bin %> <%= command.id %> --target-org myOrg --template-name "Sales Template" --decouple

- Delete template in specific org with API version:

  <%= config.bin %> <%= command.id %> --target-org mySandbox --template-id 0XtB000000001aXYAQ --api-version 60.0

# flags.target-org.summary

Login username or alias for the target org. Not required if the `target-org` configuration variable is already set.

# flags.api-version.summary

Override the API version used for orchestrator API requests.

# flags.api-version.description

Use this flag to specify a particular API version when the default version doesn't work with your org's configuration.

# flags.template-id.summary

ID of the template to delete.

# flags.template-id.description

The unique identifier of the template to delete. Template IDs are guaranteed to be unique within an org. Use this flag when you know the template's ID, which you can get from "sf orchestrator template list" command. Either --template-id or --template-name is required.

# flags.template-name.summary

Name of the template to delete.

# flags.template-name.description

Template names should be unique within an org. Use this flag when you know the template's name but not its ID. If the name contains spaces, enclose it in quotes. Either --template-id or --template-name is required.

# flags.force-delete.summary

Force delete the template and all apps created from it.

# flags.force-delete.description

When specified, all apps created from this template are also deleted. This is a destructive operation that can't be undone. Use with caution as it permanently removes both the template and all associated apps from your org.

# flags.decouple.summary

Decouple apps from this template before deleting it.

# flags.decouple.description

When specified, apps created from this template have their association with the template removed before the template is deleted. This ensures apps continue to function independently after the template is gone. Use this option when you want to preserve apps while removing the template.

# flags.no-prompt.summary

Don't prompt for confirmation.

# flags.no-prompt.description

Skip the confirmation prompt before deleting the template. Use this flag carefully, especially in scripts or automation, as template deletion can't be undone.

# fetchingTemplate

Fetching template information...

# deletingTemplate

Deleting template...

# decouplingApps

Decoupling apps from template...

# deletingApps

Deleting apps created from this template...

# confirmDeleteYesNo

Are you sure you want to delete this template? Apps created from it will remain but will no longer be linked to the template. (y/n)

# confirmForceDeleteYesNo

WARNING: This operation will delete the template AND all apps created from it. This operation can't be undone. Continue? (y/n)

# confirmDecoupleYesNo

This operation will decouple all apps from the template and then delete the template. Apps will remain independent after the template is gone. Continue? (y/n)

# deleteTemplateSuccess

Successfully deleted template with ID: %s.

# error.MissingRequiredFlag

You must provide either --template-id or --template-name.

# error.MissingRequiredFlag.Actions

- Use --template-id to specify a template by its unique ID.
- Use --template-name to specify a template by its name.
- Get template IDs and names using "sf orchestrator template list".

# error.TemplateNotFound

Couldn't find template: %s.

# error.TemplateNotFound.Actions

- Verify the template ID or name is correct.
- Use "sf orchestrator template list" to see available templates.
- Check your permissions to view templates.
- Make sure you're connected to the correct org with --target-org.

# error.CertificateError

Error connecting to Salesforce: Certificate validation failed.

# error.CertificateError.Actions

- Check your network connection.
- Verify you have valid certificates.
- Try specifying the API version with --api-version.
- If using a sandbox or scratch org, ensure your connection is properly authenticated.

# error.AuthenticationError

Error connecting to Salesforce: Authentication failed.

# error.AuthenticationError.Actions

- Verify your credentials are valid.
- Run "sf org login web" to reauthenticate.
- Check if your session has expired.
- Ensure you have Data Cloud and Tableau Next enabled and the AppFrameworkManageApp user permission.

# error.GenericError

Error deleting template: %s.

# error.GenericError.Actions

- Review the error message for details.
- Check if you have permission to delete templates.
- Verify the template isn't locked or protected.
- Ensure Data Cloud and Tableau Next are enabled in your org.

# error.InsufficientPermissions

You don't have permission to delete templates in this org.

# error.InsufficientPermissions.Actions

- Contact your Salesforce admin to request template deletion permissions.
- Verify you're connected to the correct org with --target-org.
- Ensure Data Cloud and Tableau Next are enabled in your org.
- Check that your user profile has the AppFrameworkManageApp user permission.

# error.TemplateInUse

Can't delete template: It's currently in use by active processes.

# error.TemplateInUse.Actions

- Wait for any active processes using this template to complete.
- Use --force-delete to delete the template and all associated apps.
- Use --decouple to preserve apps while deleting the template.
- Check which apps are using this template with "sf orchestrator app list".

# deleteAppSuccess

Successfully deleted app '%s' (ID: %s).

# decoupleAppSuccess

Successfully decoupled app '%s' (ID: %s) from template.

# deletionCancelled

Template deletion cancelled.
