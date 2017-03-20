export default function hashFromList(list, getKey) {
  return list.reduce((dict, element) => {
    dict[getKey(element)] = element;
    return dict;
  }, {});
}
