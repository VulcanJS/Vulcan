import pickle
import json

def main():
    with open('datePickles.json', 'r') as pickles_json:
      pickles = json.load(pickles_json)
      for p in pickles:
        if 'datePickle' in pickles[p]:
          datePickle = pickles[p]['datePickle']
          dateTime = pickle.loads(datePickle)
          pickles[p]['date'] = dateTime.isoformat()

    with open('datePicklesOut.json', 'w') as pickles_json_out:
        json.dump(pickles, pickles_json_out)


if __name__ == '__main__':
    main()
