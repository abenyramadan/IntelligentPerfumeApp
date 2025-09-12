// items by given key
export function groupDataByKey(data, key) {
  if (data.length < 1) {
    return [];
  }

  // Use reduce to group data into an object
  const groupedObject = data.reduce((accumulator, currentItem) => {
    // Get the value of the key for the current item
    const groupValue = currentItem[key];

    // If the group doesn't exist yet, initialize it as an empty array
    if (!accumulator[groupValue]) {
      accumulator[groupValue] = [];
    }

    // Push the current item to the corresponding group
    accumulator[groupValue].push(currentItem);

    // Return the accumulator for the next iteration
    return accumulator;
  }, {});

  // Convert the grouped object into the desired array format
  const groupedArray = Object.keys(groupedObject).map((groupName) => {
    return {
      topic: groupName,
      questions: groupedObject[groupName],
    };
  });

  return JSON.stringify(groupedArray);
}

export const convertToArray = (string, seperator = ",") => {
  const values = string.split(seperator);
  return values;
};
