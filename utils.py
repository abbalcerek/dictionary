__author__ = 'Adam'
import ast


def dict_to_string(dictionary):
    import json
    json_value = json.dumps(dictionary, sort_keys=True, indent=2, separators=(',', ': '))
    return str(json_value)


def prittify_json_string(string):
    import json
    json.load(string, sort_keys=True, indent=2, separators=(',', ': '))
    return str(json)


def string_to_dict(string):
    if not string: return None
    return ast.literal_eval(string)
