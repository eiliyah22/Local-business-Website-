# MaiCookies

A cookie shop website for the SIS2045 Web Application Development assignment.
Built with HTML, CSS, JavaScript, PHP, MySQL and AJAX.

## What you need

- **XAMPP** (Apache, MySQL and PHP). This project was built with XAMPP 8.0.30.
- A web browser.
- Optional, only for the email feature: a Gmail account.

## How to run it

1. Install XAMPP.
2. Put this project folder inside XAMPP's `htdocs` folder, for example `C:\xampp\htdocs\sis2045-project`.
3. Open the XAMPP Control Panel and start **Apache** and **MySQL**.
4. Create the database:
   1. Go to http://localhost/phpmyadmin
   2. Click **New**, type `maicookies` (exactly), click **Create**.
   3. Click `maicookies` on the left, open the **Import** tab, choose the file `database/maicookies.sql`, click **Go**.
5. Open the website at http://localhost/sis2045-project/index.html

The shop page is http://localhost/sis2045-project/Menu.html

Do not open the HTML files by double-clicking them. The checkout and the contact form need PHP, so the pages must be opened through `http://localhost/...`.

The database connection is in `php/config.php`. It uses the XAMPP defaults (user `root`, no password). Change it there if your MySQL is different.

## Email to the shop owner (optional)

Orders and contact messages are always saved in the database. To also send an email to the owner:

1. In the Gmail account that will send the emails, turn on **2-Step Verification**, then create an **App Password** at https://myaccount.google.com/apppasswords
2. Open `C:\xampp\sendmail\sendmail.ini` (as administrator) and set these lines under `[sendmail]`:
   ```
   smtp_server=smtp.gmail.com
   smtp_port=587
   smtp_ssl=auto
   auth_username=youraddress@gmail.com
   auth_password=your-app-password
   force_sender=youraddress@gmail.com
   ```
3. Open `C:\xampp\php\php.ini` and set:
   ```
   sendmail_path = "\"C:\xampp\sendmail\sendmail.exe\" -t"
   ```
4. Restart Apache.
5. In `php/config.php`, set `$ownerEmail` to the address that should receive the emails.

Never put the App Password in the project files or on GitHub. It stays in `sendmail.ini`.

## Folders

- `index.html`, `Menu.html`, `contact.html`: the pages
- `css/`, `js/`, `images/`: styles, JavaScript and pictures
- `php/`: the server side (`config.php`, `checkout.php`, `getcustomer.php`, `process_contact.php`)
- `database/maicookies.sql`: the database to import

## If something does not work

- **"Connection failed"**: MySQL is not started, or the database is not named `maicookies`.
- **Checkout says it could not reach the server**: the page was opened without `http://localhost/`, or Apache is not started.
- **No emails**: check the email setup above, restart Apache, and look in the Spam folder.
