## IMPORTANT

Contact Ashwin or Bharat to setup your dev environment

**For Windows**
1. Open terminal in Administrator mode
1. Install `chocolatey`
2. Run `choco install mkcert`
3. Run `mkcert -install`
4. cd into the project directory
5. Run `mkcert dev.app.cloudsbuzz.in localhost.com "*.localhost.com" localhost 127.0.0.1 ::1`
6. Open the windows hosts file for editing in administrator mode (Google how to)
7. Add `127.0.0.1 localhost dev.app.cloudsbuzz.in` to the end of the file

Now, when you run `npm run dev`, you can access the application at 
'https://dev.app.cloudsbuzz.in:3000' IT'S HTTPS

**For Linux**
1. Google how to install mkcert and then follow the same steps
2. Google how to edit the host files and follow the same steps

Contact Ashwin or Bharath for more info on this

Don't ask why this is needed. It's there to make authentication simpler