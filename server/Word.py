__author__ = 'Adam'
from sqlalchemy import Column, Integer, String

from server.db_config import Base
from server import utils


class Word(Base):
    __tablename__ = 'words'
    _id = Column(Integer, primary_key=True)
    _word = Column(String(100), unique=True)
    _parsed_page_content = Column(String(1000))

    def __init__(self, _id=None, _word=None, _parsed_page_content=None):
        self._id = _id
        self._word = _word
        self._page_content = None
        self._parsed_page_content = _parsed_page_content

    def initialized(self):
        return self._page_content and self._parsed_page_content

    def to_dict(self):
        return {'id': self._id, 'word': self._word, 'content': utils.string_to_dict(self._parsed_page_content)}

    def __str__(self):
        return str(self.to_dict())

    @property
    def id(self):
        return self._id

    @property
    def word(self):
        return self._word

    @property
    def page_content(self):
        return self._page_content

    @property
    def parsed_page_content(self):
        return self._parsed_page_content
