# summary

Delete an AppFramework template.

# description

Deletes an existing template. By default, apps created from this template will remain but will no longer be linked to the template. Use --force-delete to delete both the template and all apps created from it. Use --decouple to keep the apps but remove their link to the template.

# flags.target-org.summary

Login username or alias for the target org

# flags.target-org.description

The target org to connect to for deleting the template.

# flags.api-version.summary

Override the api version used for api requests

# flags.api-version.description

Override the api version used for api requests to the app framework.

# flags.template-id.summary

ID of the template to delete

# flags.template-id.description

The unique identifier of the template to delete.

# flags.template-name.summary

Name of the template to delete

# flags.template-name.description

The name of the template to delete. Use this if you don't know the template ID.

# flags.force-delete.summary

Force delete the template and all apps created from it

# flags.force-delete.description

When set, all apps created from this template will also be deleted. Otherwise, the apps will remain but will no longer be linked to any template.

# flags.decouple.summary

Decouple apps from this template before deleting it

# flags.decouple.description

When set, apps created from this template will have their link to the template removed before the template is deleted. This allows the apps to exist independently after the template is gone.

# flags.no-prompt.summary

Do not prompt for confirmation

# flags.no-prompt.description

Skip the confirmation prompt before deleting the template.

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

WARNING: This will delete the template AND all apps created from it. This operation cannot be undone. Continue? (y/n)

# confirmDecoupleYesNo

This will decouple all apps from the template and then delete the template. Apps will remain independent after the template is gone. Continue? (y/n)

# deleteTemplateSuccess

Successfully deleted template with ID: %s

# error.MissingRequiredFlag

You must provide either template-id or template-name.

# error.MissingRequiredFlag.Actions

- Specify the template ID with --template-id
- Or specify the template name with --template-name

# error.TemplateNotFound

Could not find template: %s

# error.TemplateNotFound.Actions

- Verify the template ID or name is correct
- Use 'sf appframework template list' to see available templates

# error.CertificateError

Error connecting to Salesforce: Certificate validation failed.

# error.CertificateError.Actions

- Check your network connection
- Verify you have valid certificates
- Try again with a different org

# error.AuthenticationError

Error connecting to Salesforce: Authentication failed.

# error.AuthenticationError.Actions

- Verify your credentials
- Run 'sf org login' to reauthenticate
- Check if your session has expired

# error.GenericError

Error deleting template: %s

# error.GenericError.Actions

- Review the error message for details
- Check if you have permission to delete templates
- Verify the template isn't being used by active apps

# deleteAppSuccess

Successfully deleted app '%s' (ID: %s)

# decoupleAppSuccess

Successfully decoupled app '%s' (ID: %s) from template

# deletionCancelled

Template deletion cancelled.

# examples

- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ
- <%= config.bin %> <%= command.id %> --template-name "My Template"
- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ --force-delete
- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ --no-prompt
