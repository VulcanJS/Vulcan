# Setup for Nitrous.IO

Before you can run this project, you will need to install Meteor with Autoparts (open-source package manager built specifically for Nitrous.IO boxes).

Run the following commands in the Terminal below:

1. `cd ~/workspace/Telescope/`
2. `parts install meteor`
3. `meteor -p 0.0.0.0:3000`

Usually you would just run `meteor`, but for nitrous environment host `0.0.0.0` is required.

To preview the app, go to the "Preview Menu" and click "Port 3000"
