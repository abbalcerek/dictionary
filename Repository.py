from db_config import db_session
from Word import Word


def save_model(model):
    print(model.__table__)
    db_session.add(model)
    db_session.commit()
    return model


def save_word_if_not_exists(word):
    result = db_session.query(Word) \
        .filter(Word._word == word.word).limit(1)
    for model in result:
        return model
    return save_model(word)


def all_words():
    return [i for i in db_session.query(Word).all()]


def delete_word(word):
    db_session.query(Word).filter_by(_word=word).delete()
    db_session.commit()
