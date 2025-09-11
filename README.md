# My Personal Portfolio SPA

This is my personal portfolio website built using Flask and designed as
a Single Page Application (SPA). The project demonstrates my skills in
web development, Firebase integration, responsive design, and SPA
architecture.

## Features

-   SPA with dynamic routing using JavaScript
-   Responsive design for mobile and desktop
-   Firebase Realtime Database integration for storing contact for submissions
-   Dynamic project card slider
-   Easy to extend and deploy

## Technologies Used

-   Python 3.x
-   Flask
-   Firebase Realtime Database
-   HTML, CSS, JavaScript
-   Gunicorn for production server

## Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/DayanandSurwase/Portfolio
    cd your-repo
    ```
    
2.  Install dependencies:

    ``` bash
    pip install -r requirements.txt
    ```

3.  Add your Firebase service key file `firebase_key.json`.

4.  Update the Firebase URL in `app.py`:

    ``` python
    'databaseURL': 'https://your-project-id.firebaseio.com/'
    ```

5.  Run the app locally:

    ``` bash
    python app.py
    ```

## Deployment

This project can be deployed to platforms like
[Render](https://render.com/), [Heroku](https://www.heroku.com/), etc.

## Usage

-   Navigate through Home, About, Projects, Contact sections without
    reloading the page.
-   Submit the contact form to store data in Firebase Realtime Database.

## License

MIT License

