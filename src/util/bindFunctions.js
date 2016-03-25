export default function bindFunctions(context, functions) {
  /* eslint-disable no-param-reassign */
  functions.forEach((name) => { context[name] = context[name].bind(context); });
}
