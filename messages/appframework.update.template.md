# summary

Update an existing AppFramework template.

# description

Updates an existing template. This allows you to refresh a template after making changes to its source app.

# flags.target-org.summary

Login username or alias for the target org

# flags.target-org.description

The target org to connect to for updating the template.

# flags.api-version.summary

Override the api version used for api requests

# flags.api-version.description

Override the api version used for api requests to the app framework.

# flags.template-id.summary

ID of the template to update

# flags.template-id.description

The unique identifier of the template to update.

# flags.template-name.summary

Name of the template to update

# flags.template-name.description

The name of the template to update. Use this if you don't know the template ID.

# flags.label.summary

New label for the template

# flags.label.description

A new display label for the template. This is the name that will be shown to users in the UI. Note that this only changes the display label, not the template's unique name which cannot be changed after creation.

# flags.description.summary

New description for the template

# flags.description.description

A new description for the template. This provides additional information about the template's purpose and contents.

# fetchingTemplate

Fetching template information...

# updatingTemplate

Updating template...

# updateSuccess

Successfully updated template '%s' (ID: %s)

# missingRequiredField

You must provide either template-id or template-name.

# examples

- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ
- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ --label "New Display Label"
- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ --description "Updated template description"
- <%= config.bin %> <%= command.id %> --template-id 0XtB000000001aXYAQ --label "New Label" --description "New description" --asset-version 3
