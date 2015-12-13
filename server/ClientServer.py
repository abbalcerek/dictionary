from flask import Flask

# set the project root directory as the client folder, you can set others.
app = Flask(__name__, static_url_path='')

from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='client')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

if __name__ == "__main__":
    app.run(port=5001)
