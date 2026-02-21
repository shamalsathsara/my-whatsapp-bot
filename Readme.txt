node bot.js



PROGRESS


01- deploy bot [DONE]
02- create a menu
03- add developer details
04- add yt and social media downloader
05- add languages
06- kick, ban msg



Deploy to Heroku
Heroku is a cloud platform that allows you to easily deploy and manage web applications.

Sign up for Heroku: Go to heroku.com and create a free account.

Create a new app: From your Heroku dashboard, click "New" and then "Create new app." Give it a unique name.

Connect to GitHub: In your new Heroku app's dashboard, go to the "Deploy" tab. Under "Deployment method," select "GitHub." Connect your GitHub account and then search for and select the repository you just created.

Enable Automatic Deploys: Turn on "Automatic Deploys." This is a powerful feature that tells Heroku to automatically redeploy your bot whenever you push new changes to your GitHub repository.

Step 4: Add Your API Key as a Config Variable
It is not safe to keep your API key directly in your code. You must use a "Config Variable" (or environment variable) on Heroku.

In your Heroku app's dashboard, go to the "Settings" tab.

Click "Reveal Config Vars."

Add a new variable:

KEY: API_KEY

VALUE: Paste your actual Gemini API key here.

Step 5: Handling Session Persistence (The Most Important Step!)
This is a critical issue for WhatsApp bots on Heroku. Heroku's free servers are "ephemeral," which means they restart frequently and all local files are erased. This includes the LocalAuth folder where your session data is stored.

This means every time your bot restarts on Heroku, it will lose its session and need to scan a QR code. This is not a sustainable solution.

A proper solution involves cloud storage, but for a quick fix, you can save the session data as an environment variable. However, this is quite complex and requires significant changes to the code.

For now, the simplest way to proceed is to use a local solution like pm2 if you want it to run 24/7 on your own computer without having to manually restart it.

Step 6: Final Deployment and Monitoring
Go back to the "Deploy" tab on your Heroku app dashboard.

If you have pushed all your changes to GitHub, you should see a "Manual deploy" option at the bottom. Click "Deploy Branch."

Heroku will now build and deploy your bot. You can monitor the progress in the log output.

Once the build is complete, go to the "More" button in the top-right and select "View logs" to see your bot's output. It will show you the QR code in the logs that you can copy to your terminal and scan.

Important: Remember, if the server restarts, you'll need to re-scan the QR code from the logs again.

This process should get your bot up and running on Heroku. Good luck, and let me know if you run into any issues during the process!

