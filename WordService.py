__author__ = 'Adam'
import utils

BASE_URL = 'http://dictionary.reference.com/browse/'


def initialize_word(word):
    """initializes word object with parsed data donwload from Dictionary.com"""
    if not word.initialized():
        download_page_content(word)
        if word.page_content:
            parse_page(word)
    return word


def download_page_content(word):
    """initializes page content in word object"""
    import urllib.request
    from requests.exceptions import HTTPError

    url = BASE_URL + word.word
    try:
        response = urllib.request.urlopen(url)
        data = response.read()
        text = data.decode('utf-8', 'ignore')
        word._page_content = text
    except HTTPError as error:
        print(error)
    finally:
        return word


def parse_page(word):
    """initializes parsed page content in word object"""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(word.page_content, 'html.parser')
    word._parsed_page_content = utils.dict_to_string({'speaker': parse_speaker(soup), 'meaning': parse_def_sets(soup)})
    return word


def parse_def_sets(soup):
    """parses meaning of the word"""
    def_sets = soup.findAll("div", {"class": "def-set"})
    return [string for string in [def_set.div.contents[0].strip() for def_set in def_sets if def_set.div]
            if len(string) > 3]


def parse_speaker(soup):
    """parses url to mp3 with pronunciation"""
    speakers = soup.findAll("a", {"class": "speaker"})
    speaker = None
    if len(speakers) > 0:
        speaker = speakers[0].get('href')
    print(speaker)
    return speaker


def main():
    """tests"""
    from Word import Word
    word = Word(1, 'book')
    download_page_content(word)


if __name__ == "__main__":
    main()
