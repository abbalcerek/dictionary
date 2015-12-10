from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# import tempfile
import os.path

# engine = create_engine('sqlite:///' + os.path.join(tempfile.gettempdir(), 'test.db'))
engine = create_engine('sqlite:///' + os.path.join(os.path.dirname(os.path.realpath(__file__)), 'test.db'))
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    #import yourapplication.models
    from Word import Word
    Base.metadata.create_all(bind=engine)
