from functools import wraps

from flask import Flask
from flask.ext.jsonpify import jsonify
from flask import request, current_app

from server import WordService
from server.db_config import *
from server.Repository import *

app = Flask(__name__)
init_db()


def jsonp(func):
    """Wraps JSONified output for JSONP requests."""

    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)

    return decorated_function


# temp
@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello World!'


# get only for debugging
# @jsonp
@app.route('/word/<word>', methods=['GET', 'PUT'])
def put_word(word):
    word_object = Word(_word=word)
    WordService.initialize_word(word_object)
    if not word_object.initialized():
        return jsonify({"word": None, "comment": "word not found"})
    save_word_if_not_exists(word_object)
    resp = jsonify(**word_object.to_dict())
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/words', methods=['GET'])
def get_words():
    words = [word.to_dict() for word in all_words()]
    resp = jsonify(**{'words': words})
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


# get for debugging only
@app.route('/delete/<word>', methods=['DELETE', 'GET'])
def delete(word):
    delete_word(word)
    print(word)
    resp = jsonify({})
    resp.headers["Content-Type"] = "application/json"
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == '__main__':
    app.run(debug="true")
